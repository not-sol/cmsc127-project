set check_function_bodies = off;

insert into public.departments (department_name, college_name)
select department_name, 'College of Science'
from (
  values
    ('CSMOD'),
    ('DBSES'),
    ('DFSC'),
    ('DMPCS')
) as allowed_departments(department_name)
where not exists (
  select 1
  from public.departments d
  where d.department_name = allowed_departments.department_name
);

create unique index if not exists departments_department_name_key
  on public.departments (department_name);

alter table public.accomplishment_reports
  alter column faculty_id drop default;

alter table public.accomplishment_reports
  add column if not exists department_id bigint;

alter table public.accomplishment_reports
  drop constraint if exists accomplishment_reports_department_id_fkey,
  add constraint accomplishment_reports_department_id_fkey
    foreign key (department_id) references public.departments(department_id)
    on update cascade
    on delete set null;

alter table public.accomplishment_reports
  drop constraint if exists accomplishment_reports_status_check,
  add constraint accomplishment_reports_status_check
    check (status in ('draft', 'pending', 'reviewed', 'archived'));

alter table public.reviews
  alter column reviewed_by drop default,
  alter column review_date set default current_date,
  alter column status type text using status::text;

alter table public.reviews
  drop constraint if exists reviews_status_check,
  add constraint reviews_status_check
    check (status in ('approved', 'partially_approved'));

create or replace function public.current_user_department_id()
returns bigint
language sql
stable
security definer
set search_path = public
as $$
  select u.department_id
  from public.users u
  where u.id = auth.uid();
$$;

create or replace function public.is_faculty()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select public.current_user_role() in ('faculty', 'department_chair', 'admin');
$$;

create or replace function public.can_manage_department(p_department_id bigint)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select public.is_admin()
    or (
      public.current_user_role() = 'department_chair'
      and p_department_id is not null
      and p_department_id = public.current_user_department_id()
    );
$$;

create or replace function public.report_department_id(p_report_id bigint)
returns bigint
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(ar.department_id, u.department_id)
  from public.accomplishment_reports ar
  left join public.users u on u.id = ar.faculty_id
  where ar.report_id = p_report_id;
$$;

create or replace function public.can_read_report(p_report_id bigint)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select public.has_verified_profile()
    and exists (
      select 1
      from public.accomplishment_reports ar
      where ar.report_id = p_report_id
        and (
          public.is_admin()
          or ar.faculty_id = auth.uid()
          or (
            public.current_user_role() = 'department_chair'
            and ar.status in ('pending', 'reviewed')
            and public.report_department_id(ar.report_id) = public.current_user_department_id()
          )
        )
    );
$$;

create or replace function public.can_edit_report(p_report_id bigint)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select public.has_verified_profile()
    and exists (
      select 1
      from public.accomplishment_reports ar
      where ar.report_id = p_report_id
        and (
          public.is_admin()
          or ar.faculty_id = auth.uid()
          or (
            public.current_user_role() = 'department_chair'
            and public.report_department_id(ar.report_id) = public.current_user_department_id()
          )
        )
    );
$$;

create or replace function public.can_read_review(p_review_id bigint)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select public.has_verified_profile()
    and exists (
      select 1
      from public.reviews r
      join public.accomplishment_reports ar on ar.report_id = r.report_id
      where r.reviews_id = p_review_id
        and (
          public.is_admin()
          or ar.faculty_id = auth.uid()
          or (
            public.current_user_role() = 'department_chair'
            and public.report_department_id(ar.report_id) = public.current_user_department_id()
          )
        )
    );
$$;

create or replace function public.can_edit_review(p_review_id bigint)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select public.has_verified_profile()
    and exists (
      select 1
      from public.reviews r
      join public.accomplishment_reports ar on ar.report_id = r.report_id
      where r.reviews_id = p_review_id
        and (
          public.is_admin()
          or (
            public.current_user_role() = 'department_chair'
            and public.report_department_id(ar.report_id) = public.current_user_department_id()
          )
        )
    );
$$;

create or replace function public.ensure_user_profile()
returns public.users
language plpgsql
security definer
set search_path = public, auth
as $$
declare
  auth_user auth.users%rowtype;
  app_user public.users%rowtype;
  selected_department_id bigint;
begin
  if auth.uid() is null then
    raise exception 'An authenticated session is required'
      using errcode = '28000';
  end if;

  select *
  into auth_user
  from auth.users
  where id = auth.uid();

  if auth_user.id is null or auth_user.email_confirmed_at is null then
    raise exception 'Email verification is required before creating an application user'
      using errcode = '28000';
  end if;

  if nullif(auth_user.raw_user_meta_data ->> 'department', '') is not null then
    select d.department_id
    into selected_department_id
    from public.departments d
    where d.department_name = auth_user.raw_user_meta_data ->> 'department';

    if selected_department_id is null then
      raise exception 'Invalid department selected'
        using errcode = '23514';
    end if;
  end if;

  insert into public.users (
    id,
    email,
    first_name,
    last_name,
    department_id,
    role
  )
  values (
    auth_user.id,
    auth_user.email,
    nullif(auth_user.raw_user_meta_data ->> 'first_name', ''),
    nullif(auth_user.raw_user_meta_data ->> 'last_name', ''),
    selected_department_id,
    'faculty'
  )
  on conflict (id) do update
    set email = excluded.email,
        first_name = coalesce(public.users.first_name, excluded.first_name),
        last_name = coalesce(public.users.last_name, excluded.last_name),
        department_id = coalesce(public.users.department_id, excluded.department_id);

  select *
  into app_user
  from public.users
  where id = auth_user.id;

  return app_user;
end;
$$;

create or replace function public.review_accomplishment_report(
  p_report_id bigint,
  p_status text,
  p_remarks text default null
)
returns public.reviews
language plpgsql
security definer
set search_path = public
as $$
declare
  target_report public.accomplishment_reports%rowtype;
  created_review public.reviews%rowtype;
begin
  if auth.uid() is null or not public.has_verified_profile() then
    raise exception 'An authenticated verified session is required'
      using errcode = '28000';
  end if;

  if p_status not in ('approved', 'partially_approved') then
    raise exception 'Review status must be approved or partially_approved'
      using errcode = '23514';
  end if;

  select *
  into target_report
  from public.accomplishment_reports
  where report_id = p_report_id
  for update;

  if target_report.report_id is null then
    raise exception 'Report not found'
      using errcode = 'P0002';
  end if;

  if target_report.status not in ('pending', 'reviewed') then
    raise exception 'Only pending or reviewed reports can be reviewed'
      using errcode = '23514';
  end if;

  if not (
    public.is_admin()
    or (
      public.current_user_role() = 'department_chair'
      and public.report_department_id(target_report.report_id) = public.current_user_department_id()
    )
  ) then
    raise exception 'Not allowed to review this report'
      using errcode = '42501';
  end if;

  update public.accomplishment_reports
  set status = 'reviewed'
  where report_id = target_report.report_id;

  insert into public.reviews (
    review_date,
    status,
    remarks,
    report_id,
    reviewed_by
  )
  values (
    current_date,
    p_status,
    nullif(p_remarks, ''),
    target_report.report_id,
    auth.uid()
  )
  returning * into created_review;

  return created_review;
end;
$$;

revoke all on table public.users from anon;
revoke all on table public.accomplishment_reports from anon;
revoke all on table public.reviews from anon;
revoke all on table public.departments from anon;

grant select on table public.departments to authenticated;
grant select, insert, update, delete on table public.accomplishment_reports to authenticated;
grant select, update on table public.reviews to authenticated;
grant usage, select on sequence public.reviews_reviews_id_seq to authenticated;
grant select, update, delete on table public.users to authenticated;

revoke execute on function public.current_user_department_id() from public, anon;
revoke execute on function public.is_faculty() from public, anon;
revoke execute on function public.can_manage_department(bigint) from public, anon;
revoke execute on function public.report_department_id(bigint) from public, anon;
revoke execute on function public.can_read_report(bigint) from public, anon;
revoke execute on function public.can_edit_report(bigint) from public, anon;
revoke execute on function public.can_read_review(bigint) from public, anon;
revoke execute on function public.can_edit_review(bigint) from public, anon;
revoke execute on function public.review_accomplishment_report(bigint, text, text) from public, anon;

grant execute on function public.current_user_department_id() to authenticated;
grant execute on function public.is_faculty() to authenticated;
grant execute on function public.can_manage_department(bigint) to authenticated;
grant execute on function public.report_department_id(bigint) to authenticated;
grant execute on function public.can_read_report(bigint) to authenticated;
grant execute on function public.can_edit_report(bigint) to authenticated;
grant execute on function public.can_read_review(bigint) to authenticated;
grant execute on function public.can_edit_review(bigint) to authenticated;
grant execute on function public.review_accomplishment_report(bigint, text, text) to authenticated;

drop policy if exists "Verified users can read accomplishment_reports" on public.accomplishment_reports;
drop policy if exists "Verified users can insert accomplishment_reports" on public.accomplishment_reports;
drop policy if exists "Verified users can update accomplishment_reports" on public.accomplishment_reports;
drop policy if exists "Verified users can delete accomplishment_reports" on public.accomplishment_reports;
drop policy if exists "Faculty and reviewers can read reports" on public.accomplishment_reports;
drop policy if exists "Faculty can create own reports" on public.accomplishment_reports;
drop policy if exists "Faculty and reviewers can update reports" on public.accomplishment_reports;
drop policy if exists "Faculty and reviewers can delete reports" on public.accomplishment_reports;

create policy "Faculty and reviewers can read reports"
  on public.accomplishment_reports
  for select
  to authenticated
  using (public.can_read_report(report_id));

create policy "Faculty can create own reports"
  on public.accomplishment_reports
  for insert
  to authenticated
  with check (
    public.has_verified_profile()
    and (
      public.is_admin()
      or (
        faculty_id = auth.uid()
        and department_id = public.current_user_department_id()
      )
    )
  );

create policy "Faculty and reviewers can update reports"
  on public.accomplishment_reports
  for update
  to authenticated
  using (public.can_edit_report(report_id))
  with check (
    public.has_verified_profile()
    and (
      public.is_admin()
      or faculty_id = auth.uid()
      or public.can_manage_department(public.report_department_id(report_id))
    )
  );

create policy "Faculty and reviewers can delete reports"
  on public.accomplishment_reports
  for delete
  to authenticated
  using (public.can_edit_report(report_id));

drop policy if exists "Verified users can read reviews" on public.reviews;
drop policy if exists "Verified users can insert reviews" on public.reviews;
drop policy if exists "Verified users can update reviews" on public.reviews;
drop policy if exists "Verified users can delete reviews" on public.reviews;
drop policy if exists "Faculty and reviewers can read reviews" on public.reviews;
drop policy if exists "Reviewers can update reviews" on public.reviews;

create policy "Faculty and reviewers can read reviews"
  on public.reviews
  for select
  to authenticated
  using (public.can_read_review(reviews_id));

create policy "Reviewers can update reviews"
  on public.reviews
  for update
  to authenticated
  using (public.can_edit_review(reviews_id))
  with check (public.can_edit_review(reviews_id));

drop policy if exists "Admins can delete users" on public.users;
drop policy if exists "Users can update own profile" on public.users;

create policy "Admins can delete users"
  on public.users
  for delete
  to authenticated
  using (public.is_admin());

create policy "Users can update own profile"
  on public.users
  for update
  to authenticated
  using (id = auth.uid() and public.has_verified_profile())
  with check (
    id = auth.uid()
    and role = public.current_user_role()
    and department_id is not distinct from public.current_user_department_id()
  );
