insert into public.departments (department_name, college_name)
values 
  ('CSMOD', 'College of Science and Mathematics'),
  ('DBSES', 'College of Science and Mathematics'),
  ('DFSC', 'College of Science and Mathematics'),
  ('DMPCS', 'College of Science and Mathematics')
on conflict (department_name) do nothing;