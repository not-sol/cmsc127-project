set check_function_bodies = off;

drop trigger if exists on_auth_user_created on auth.users;
drop function if exists public.handle_new_user();

do $$
begin
  if to_regclass('public.faculties') is not null
     and to_regclass('public.users') is null then
    alter table public.faculties rename to users;
  end if;
end $$;

do $$
begin
  if exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'users'
      and column_name = 'faculty_id'
  ) and not exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'users'
      and column_name = 'id'
  ) then
    alter table public.users rename column faculty_id to id;
  end if;
end $$;

do $$
begin
  if exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'users'
      and column_name = 'roles'
  ) and not exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'users'
      and column_name = 'role'
  ) then
    alter table public.users rename column roles to role;
  end if;
end $$;

do $$
begin
  if not exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'users'
      and column_name = 'role'
  ) then
    alter table public.users add column role text;
  end if;
end $$;

update public.users
set role = 'faculty'
where role is null;

alter table public.users
  alter column id drop default,
  alter column email set not null,
  alter column role set default 'faculty',
  alter column role set not null;

revoke all on table public.users from anon;
grant select on table public.users to authenticated;
grant update (username, first_name, last_name, employment_type, department_id) on table public.users to authenticated;
grant all on table public.users to service_role;

alter table public.users
  drop constraint if exists faculties_roles_check,
  drop constraint if exists users_role_check,
  add constraint users_role_check
    check (role in ('faculty', 'department_chair', 'admin'));

alter table public.users
  drop constraint if exists faculties_faculty_id_fkey,
  drop constraint if exists users_id_fkey,
  add constraint users_id_fkey
    foreign key (id) references auth.users(id)
    on update cascade
    on delete cascade;

alter table public.users enable row level security;

drop policy if exists "Enable insert for authenticated users only" on public.users;
drop policy if exists "Enable select for authenticated users only" on public.users;
drop policy if exists "Enable update for authenticated users only" on public.users;
drop policy if exists "Users can read own profile" on public.users;
drop policy if exists "Admins can read all users" on public.users;
drop policy if exists "Admins can update users" on public.users;

create or replace function public.has_verified_profile()
returns boolean
language sql
stable
security definer
set search_path = public, auth
as $$
  select auth.uid() is not null
    and exists (
      select 1
      from public.users u
      join auth.users au on au.id = u.id
      where u.id = auth.uid()
        and au.email_confirmed_at is not null
    );
$$;

create or replace function public.current_user_role()
returns text
language sql
stable
security definer
set search_path = public
as $$
  select u.role
  from public.users u
  where u.id = auth.uid();
$$;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select public.current_user_role() = 'admin';
$$;

create or replace function public.is_department_chair()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select public.current_user_role() in ('department_chair', 'admin');
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

  insert into public.users (
    id,
    email,
    first_name,
    last_name,
    role
  )
  values (
    auth_user.id,
    auth_user.email,
    nullif(auth_user.raw_user_meta_data ->> 'first_name', ''),
    nullif(auth_user.raw_user_meta_data ->> 'last_name', ''),
    'faculty'
  )
  on conflict (id) do update
    set email = excluded.email,
        first_name = coalesce(public.users.first_name, excluded.first_name),
        last_name = coalesce(public.users.last_name, excluded.last_name);

  select *
  into app_user
  from public.users
  where id = auth_user.id;

  return app_user;
end;
$$;

revoke execute on function public.ensure_user_profile() from public;
grant execute on function public.ensure_user_profile() to authenticated;

create policy "Users can read own profile"
  on public.users
  for select
  to authenticated
  using (id = auth.uid() and public.has_verified_profile());

create policy "Admins can read all users"
  on public.users
  for select
  to authenticated
  using (public.is_admin());

create policy "Admins can update users"
  on public.users
  for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

do $$
declare
  table_name text;
begin
  foreach table_name in array array[
    'accomplishment_reports',
    'reviews',
    'export_records',
    'departments',
    'accomplishment_entries',
    'form_types',
    'supporting_documents',
    'isip_publication_forms',
    'pbms_publication_forms',
    'isip_research_forms',
    'pbms_research_forms',
    'isip_oral_forms',
    'pbms_oral_forms',
    'isip_patents_forms',
    'pbms_patents_forms',
    'isip_creative_work_forms',
    'pbms_creative_work_forms',
    'isip_awards_forms',
    'isip_trainings_forms',
    'pbms_trainings_forms',
    'isip_extension_programs_forms',
    'pbms_extension_programs_forms',
    'isip_partnership_forms',
    'pbms_partnerships_forms',
    'isip_authorship_forms',
    'isip_other_accomplishments_forms',
    'pbms_other_accomplishments_forms'
  ] loop
    if to_regclass(format('public.%I', table_name)) is not null then
      execute format('alter table public.%I enable row level security', table_name);
      execute format('drop policy if exists "Verified users can read %1$I" on public.%1$I', table_name);
      execute format('drop policy if exists "Verified users can insert %1$I" on public.%1$I', table_name);
      execute format('drop policy if exists "Verified users can update %1$I" on public.%1$I', table_name);
      execute format('drop policy if exists "Verified users can delete %1$I" on public.%1$I', table_name);
      execute format('create policy "Verified users can read %1$I" on public.%1$I for select to authenticated using (public.has_verified_profile())', table_name);
      execute format('create policy "Verified users can insert %1$I" on public.%1$I for insert to authenticated with check (public.has_verified_profile())', table_name);
      execute format('create policy "Verified users can update %1$I" on public.%1$I for update to authenticated using (public.has_verified_profile()) with check (public.has_verified_profile())', table_name);
      execute format('create policy "Verified users can delete %1$I" on public.%1$I for delete to authenticated using (public.has_verified_profile())', table_name);
    end if;
  end loop;
end $$;
