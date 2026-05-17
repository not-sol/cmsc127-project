-- Normalize CSM department rows. Demo accomplishment data is intentionally not
-- seeded by migrations; run supabase/snippets/seed_user_accomplishment_demo.sql
-- manually when sample reports are needed.

INSERT INTO public.departments (department_name, college_name)
VALUES
  ('Department of Biological Science & Environmental Studies', 'College of Science and Mathematics'),
  ('Department of Food Science & Chemistry', 'College of Science and Mathematics'),
  ('Department of Mathematics, Physics & Computer Science', 'College of Science and Mathematics')
ON CONFLICT (department_name) DO UPDATE
SET college_name = EXCLUDED.college_name;

DO $$
DECLARE
  dbses_id bigint;
  dfsc_id bigint;
  dmpcs_id bigint;
BEGIN
  SELECT department_id INTO dbses_id
  FROM public.departments
  WHERE department_name = 'Department of Biological Science & Environmental Studies';

  SELECT department_id INTO dfsc_id
  FROM public.departments
  WHERE department_name = 'Department of Food Science & Chemistry';

  SELECT department_id INTO dmpcs_id
  FROM public.departments
  WHERE department_name = 'Department of Mathematics, Physics & Computer Science';

  UPDATE public.users
  SET department_id = CASE upper(legacy.department_name)
    WHEN 'DBSES' THEN dbses_id
    WHEN 'DFSC' THEN dfsc_id
    WHEN 'DSFC' THEN dfsc_id
    WHEN 'DMPCS' THEN dmpcs_id
    WHEN 'CSMOD' THEN dmpcs_id
    ELSE public.users.department_id
  END
  FROM public.departments AS legacy
  WHERE public.users.department_id = legacy.department_id
    AND upper(legacy.department_name) IN ('DBSES', 'DFSC', 'DSFC', 'DMPCS', 'CSMOD');

  UPDATE public.accomplishment_reports
  SET department_id = CASE upper(legacy.department_name)
    WHEN 'DBSES' THEN dbses_id
    WHEN 'DFSC' THEN dfsc_id
    WHEN 'DSFC' THEN dfsc_id
    WHEN 'DMPCS' THEN dmpcs_id
    WHEN 'CSMOD' THEN dmpcs_id
    ELSE public.accomplishment_reports.department_id
  END
  FROM public.departments AS legacy
  WHERE public.accomplishment_reports.department_id = legacy.department_id
    AND upper(legacy.department_name) IN ('DBSES', 'DFSC', 'DSFC', 'DMPCS', 'CSMOD');

  UPDATE auth.users
  SET raw_user_meta_data = jsonb_set(
    COALESCE(raw_user_meta_data, '{}'::jsonb),
    '{department}',
    to_jsonb(CASE upper(raw_user_meta_data ->> 'department')
      WHEN 'DBSES' THEN 'Department of Biological Science & Environmental Studies'
      WHEN 'DFSC' THEN 'Department of Food Science & Chemistry'
      WHEN 'DSFC' THEN 'Department of Food Science & Chemistry'
      WHEN 'DMPCS' THEN 'Department of Mathematics, Physics & Computer Science'
      WHEN 'CSMOD' THEN 'Department of Mathematics, Physics & Computer Science'
      ELSE raw_user_meta_data ->> 'department'
    END),
    true
  )
  WHERE upper(raw_user_meta_data ->> 'department') IN ('DBSES', 'DFSC', 'DSFC', 'DMPCS', 'CSMOD');

  DELETE FROM public.departments
  WHERE upper(department_name) IN ('DBSES', 'DFSC', 'DSFC', 'DMPCS', 'CSMOD');
END $$;
