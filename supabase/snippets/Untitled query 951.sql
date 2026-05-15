INSERT INTO public.users (id, email, first_name, last_name, role)
VALUES ('d0d0d0d0-d0d0-d0d0-d0d0-d0d0d0d0d0d0', 'test@up.edu.ph', 'Test', 'User', 'admin')
ON CONFLICT (id) DO NOTHING;