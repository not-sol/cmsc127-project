-- Ensure departments have a unique name constraint for reliable seeding
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE table_name = 'departments' 
        AND table_schema = 'public'
        AND constraint_name = 'departments_department_name_key'
    ) THEN
        ALTER TABLE public.departments ADD CONSTRAINT departments_department_name_key UNIQUE (department_name);
    END IF;
END $$;

-- Seed departments with fixed values
-- These values must persist consistently across all environments
INSERT INTO public.departments (department_name, college_name)
VALUES 
  ('CSMOD', 'College of Science and Mathematics'),
  ('DBSES', 'College of Science and Mathematics'),
  ('DFSC', 'College of Science and Mathematics'),
  ('DMPCS', 'College of Science and Mathematics')
ON CONFLICT (department_name) DO UPDATE 
SET college_name = EXCLUDED.college_name;

-- Prevent deletion of these core departments
CREATE OR REPLACE FUNCTION public.prevent_department_deletion()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.department_name IN ('CSMOD', 'DBSES', 'DFSC', 'DMPCS') THEN
    RAISE EXCEPTION 'Core departments cannot be deleted';
  END IF;
  RETURN OLD;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS tr_prevent_department_deletion ON public.departments;
CREATE TRIGGER tr_prevent_department_deletion
BEFORE DELETE ON public.departments
FOR EACH ROW EXECUTE FUNCTION public.prevent_department_deletion();
