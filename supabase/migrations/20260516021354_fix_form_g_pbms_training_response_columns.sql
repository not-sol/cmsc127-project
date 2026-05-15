-- supabase/migrations/20260516021354_fix_form_g_pbms_training_response_columns.sql

ALTER TABLE public.pbms_trainings_forms
ADD COLUMN IF NOT EXISTS no_of_responses_very_satisfactory smallint,
ADD COLUMN IF NOT EXISTS no_of_responses_outstanding smallint;

UPDATE public.pbms_trainings_forms
SET no_of_responses_outstanding = no_of_responses_outsanding
WHERE no_of_responses_outstanding IS NULL
  AND no_of_responses_outsanding IS NOT NULL;
