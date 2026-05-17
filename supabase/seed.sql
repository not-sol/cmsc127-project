SET session_replication_role = replica;

SELECT pg_catalog.set_config('search_path', 'public, auth, extensions', false);

-- Local admin account only. Demo accomplishment data lives in manual snippets.
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

INSERT INTO public.users (id, email, first_name, last_name, role)
VALUES ('d0d0d0d0-d0d0-d0d0-d0d0-d0d0d0d0d0d0', 'test@up.edu.ph', 'Test', 'User', 'admin')
ON CONFLICT (id) DO NOTHING;

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

RESET ALL;
