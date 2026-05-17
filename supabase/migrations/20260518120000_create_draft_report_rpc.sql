create or replace function public.create_draft_accomplishment_report(
  p_start_date date default null,
  p_end_date date default null,
  p_remarks text default null,
  p_department_id bigint default null
)
returns public.accomplishment_reports
language plpgsql
security definer
set search_path = public
as $$
declare
  current_department_id bigint;
  user_role text;
  target_department_id bigint;
  created_report public.accomplishment_reports%rowtype;
begin
  if auth.uid() is null or not public.has_verified_profile() then
    raise exception 'An authenticated verified session is required'
      using errcode = '28000';
  end if;

  current_department_id := public.current_user_department_id();
  user_role := public.current_user_role();
  target_department_id := coalesce(p_department_id, current_department_id);

  if user_role is distinct from 'admin' then
    if current_department_id is null then
      raise exception 'Your profile must have a department before creating accomplishment reports'
        using errcode = '23502';
    end if;

    if target_department_id is distinct from current_department_id then
      raise exception 'Cannot create a report for another department'
        using errcode = '42501';
    end if;
  end if;

  insert into public.accomplishment_reports (
    start_date,
    end_date,
    remarks,
    department_id,
    status,
    faculty_id
  )
  values (
    p_start_date,
    p_end_date,
    nullif(p_remarks, ''),
    target_department_id,
    'draft',
    auth.uid()
  )
  returning * into created_report;

  return created_report;
end;
$$;

revoke execute on function public.create_draft_accomplishment_report(date, date, text, bigint) from public, anon;
grant execute on function public.create_draft_accomplishment_report(date, date, text, bigint) to authenticated;
