-- supabase/migrations/20260516030330_fix_form_k_pbms_other_accomplishments_columns.sql

-- Form K PBMS Other Accomplishments fields used by the frontend/API.
ALTER TABLE public.pbms_other_accomplishments_forms
ADD COLUMN IF NOT EXISTS accomplishment_title text,
ADD COLUMN IF NOT EXISTS accomplishment_description text,
ADD COLUMN IF NOT EXISTS accomplishment_date date;

-- Ask PostgREST to refresh its schema cache after adding columns.
NOTIFY pgrst, 'reload schema';
