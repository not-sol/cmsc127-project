-- Add Form K business fields used by the current frontend/API.
ALTER TABLE public.isip_other_accomplishments_forms
ADD COLUMN IF NOT EXISTS participation text,
ADD COLUMN IF NOT EXISTS venue text,
ADD COLUMN IF NOT EXISTS remarks text,
ADD COLUMN IF NOT EXISTS related_kras text;

ALTER TABLE public.pbms_other_accomplishments_forms
ADD COLUMN IF NOT EXISTS venue text,
ADD COLUMN IF NOT EXISTS participation text,
ADD COLUMN IF NOT EXISTS remarks text,
ADD COLUMN IF NOT EXISTS related_kras text;

-- Username is no longer part of the application user model.
ALTER TABLE public.users
DROP COLUMN IF EXISTS username;

GRANT UPDATE (first_name, last_name, employment_type, department_id) ON TABLE public.users TO authenticated;

NOTIFY pgrst, 'reload schema';
