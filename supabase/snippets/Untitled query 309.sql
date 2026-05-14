create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
as $$
begin
  insert into public.faculties (
    faculty_id,
    email,
    roles,
    department_id
  )
  values (
    new.id,
    new.email,
    'faculty',
    new.raw_user_meta_data->>'department_id'
  );

  return new;
end;
$$;