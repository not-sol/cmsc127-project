-- Seed departments
insert into public.departments (department_name, college_name)
values 
  ('CSMOD', 'College of Science and Mathematics'),
  ('DBSES', 'College of Science and Mathematics'),
  ('DFSC', 'College of Science and Mathematics'),
  ('DMPCS', 'College of Science and Mathematics')
on conflict (department_name) do nothing;

-- Create a test user for local development
-- email: test@up.edu.ph
-- password: password123
INSERT INTO auth.users (
  id, 
  instance_id, 
  email, 
  encrypted_password, 
  email_confirmed_at, 
  raw_app_meta_data, 
  raw_user_meta_data, 
  is_super_admin, 
  role, 
  last_sign_in_at, 
  created_at, 
  updated_at, 
  aud,
  is_sso_user,
  is_anonymous
)
VALUES (
  'd0d0d0d0-d0d0-d0d0-d0d0-d0d0d0d0d0d0',
  '00000000-0000-0000-0000-000000000000',
  'test@up.edu.ph',
  extensions.crypt('password123', extensions.gen_salt('bf')),
  now(),
  '{"provider":"email","providers":["email"]}',
  '{"first_name":"Test","last_name":"User"}',
  false,
  'authenticated',
  now(),
  now(),
  now(),
  'authenticated',
  false,
  false
) ON CONFLICT (id) DO NOTHING;

INSERT INTO auth.identities (
  id,
  user_id, 
  identity_data, 
  provider, 
  provider_id,
  last_sign_in_at, 
  created_at, 
  updated_at
)
VALUES (
  gen_random_uuid(),
  'd0d0d0d0-d0d0-d0d0-d0d0-d0d0d0d0d0d0',
  format('{"sub":"%s","email":"%s"}', 'd0d0d0d0-d0d0-d0d0-d0d0-d0d0d0d0d0d0', 'test@up.edu.ph')::jsonb,
  'email',
  'd0d0d0d0-d0d0-d0d0-d0d0-d0d0d0d0d0d0',
  now(),
  now(),
  now()
) ON CONFLICT (provider, provider_id) DO NOTHING;

INSERT INTO public.users (id, email, first_name, last_name, role)
VALUES ('d0d0d0d0-d0d0-d0d0-d0d0-d0d0d0d0d0d0', 'test@up.edu.ph', 'Test', 'User', 'admin')
ON CONFLICT (id) DO NOTHING;

delete from public.accomplishment_reports
where remarks like 'Dummy seed:%';

insert into public.accomplishment_reports (
  start_date,
  end_date,
  date_submitted,
  status,
  remarks,
  department_id,
  faculty_id
)
values
  ('2026-01-01', '2026-03-31', '2026-04-05', 'pending', 'Dummy seed: CSMOD Q1 research, publications, and training report awaiting chair review.', (select department_id from public.departments where department_name = 'CSMOD'), null),
  ('2026-04-01', '2026-06-30', '2026-07-04', 'reviewed', 'Dummy seed: CSMOD Q2 accomplishments reviewed with minor documentation follow-up.', (select department_id from public.departments where department_name = 'CSMOD'), null),
  ('2025-10-01', '2025-12-31', '2026-01-10', 'draft', 'Dummy seed: CSMOD year-end report still being prepared by faculty.', (select department_id from public.departments where department_name = 'CSMOD'), null),

  ('2026-01-01', '2026-03-31', '2026-04-08', 'pending', 'Dummy seed: DBSES biodiversity monitoring and extension report pending review.', (select department_id from public.departments where department_name = 'DBSES'), null),
  ('2026-04-01', '2026-06-30', '2026-07-06', 'reviewed', 'Dummy seed: DBSES coastal research and community engagement report reviewed.', (select department_id from public.departments where department_name = 'DBSES'), null),
  ('2025-07-01', '2025-09-30', '2025-10-12', 'archived', 'Dummy seed: DBSES archived quarterly accomplishments report.', (select department_id from public.departments where department_name = 'DBSES'), null),

  ('2026-01-01', '2026-03-31', '2026-04-03', 'pending', 'Dummy seed: DFSC food systems research report pending department chair action.', (select department_id from public.departments where department_name = 'DFSC'), null),
  ('2026-04-01', '2026-06-30', '2026-07-02', 'reviewed', 'Dummy seed: DFSC laboratory service and publication report reviewed.', (select department_id from public.departments where department_name = 'DFSC'), null),
  ('2025-10-01', '2025-12-31', '2026-01-09', 'draft', 'Dummy seed: DFSC draft accomplishments for validation.', (select department_id from public.departments where department_name = 'DFSC'), null),

  ('2026-01-01', '2026-03-31', '2026-04-07', 'pending', 'Dummy seed: DMPCS computational science and math education report pending review.', (select department_id from public.departments where department_name = 'DMPCS'), null),
  ('2026-04-01', '2026-06-30', '2026-07-08', 'reviewed', 'Dummy seed: DMPCS reviewed report covering research dissemination and student mentoring.', (select department_id from public.departments where department_name = 'DMPCS'), null),
  ('2025-07-01', '2025-09-30', '2025-10-07', 'archived', 'Dummy seed: DMPCS archived report retained for historical testing.', (select department_id from public.departments where department_name = 'DMPCS'), null);
