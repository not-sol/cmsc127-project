-- Add unique constraint to departments if not exists
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'departments_department_name_key'
    ) AND NOT EXISTS (
        SELECT 1 FROM pg_class c JOIN pg_namespace n ON n.oid = c.relnamespace WHERE c.relname = 'departments_department_name_key' AND n.nspname = 'public'
    ) THEN
        ALTER TABLE public.departments ADD CONSTRAINT departments_department_name_key UNIQUE (department_name);
    END IF;
END $$;

-- Insert/Update departments
INSERT INTO public.departments (department_name, college_name)
VALUES 
  ('Department of Architecture', 'College of Humanities & Social Sciences'),
  ('Department of Humanities', 'College of Humanities & Social Sciences'),
  ('Department of Social Sciences', 'College of Humanities & Social Sciences'),
  ('Department of Human Kinetics', 'College of Humanities & Social Sciences'),
  ('CHSS Office of the Dean & College Secretary', 'College of Humanities & Social Sciences'),
  ('Department of Biological Science & Environmental Studies', 'College of Science and Mathematics'),
  ('Department of Food Science & Chemistry', 'College of Science and Mathematics'),
  ('Department of Mathematics, Physics & Computer Science', 'College of Science and Mathematics'),
  ('CSM Office of the Dean & College Secretary', 'College of Science and Mathematics'),
  ('School of Management (SOM)', 'School of Management (SOM)')
ON CONFLICT (department_name) DO UPDATE 
SET college_name = EXCLUDED.college_name;

-- Update ensure_user_profile to handle department_id from metadata
CREATE OR REPLACE FUNCTION public.ensure_user_profile()
RETURNS public.users
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth
AS $$
DECLARE
  auth_user auth.users%ROWTYPE;
  app_user public.users%ROWTYPE;
  dept_id bigint;
  dept_name text;
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'An authenticated session is required'
      USING ERRCODE = '28000';
  END IF;

  SELECT *
  INTO auth_user
  FROM auth.users
  WHERE id = auth.uid();

  IF auth_user.id IS NULL OR auth_user.email_confirmed_at IS NULL THEN
    RAISE EXCEPTION 'Email verification is required before creating an application user'
      USING ERRCODE = '28000';
  END IF;

  -- Get department name from metadata
  dept_name := nullif(auth_user.raw_user_meta_data ->> 'department', '');
  
  -- Lookup department_id
  IF dept_name IS NOT NULL THEN
    SELECT department_id INTO dept_id
    FROM public.departments
    WHERE department_name = dept_name
    LIMIT 1;
  END IF;

  INSERT INTO public.users (
    id,
    email,
    first_name,
    last_name,
    role,
    department_id
  )
  VALUES (
    auth_user.id,
    auth_user.email,
    nullif(auth_user.raw_user_meta_data ->> 'first_name', ''),
    nullif(auth_user.raw_user_meta_data ->> 'last_name', ''),
    'faculty',
    dept_id
  )
  ON CONFLICT (id) DO UPDATE
    SET email = EXCLUDED.email,
        first_name = COALESCE(public.users.first_name, EXCLUDED.first_name),
        last_name = COALESCE(public.users.last_name, EXCLUDED.last_name),
        department_id = COALESCE(public.users.department_id, EXCLUDED.department_id);

  SELECT *
  INTO app_user
  FROM public.users
  WHERE id = auth_user.id;

  RETURN app_user;
END;
$$;
