BEGIN;

ALTER TABLE public.form_f_awards_and_grants
  ALTER COLUMN entry_id DROP IDENTITY IF EXISTS;

DROP SEQUENCE IF EXISTS public.form_f_awards_and_grants_entry_id_seq;

COMMIT;
