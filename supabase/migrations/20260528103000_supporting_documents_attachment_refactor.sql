ALTER TABLE public.supporting_documents
ADD COLUMN IF NOT EXISTS bucket_id text,
ADD COLUMN IF NOT EXISTS storage_path text,
ADD COLUMN IF NOT EXISTS document_type text;

CREATE OR REPLACE FUNCTION public._storage_paths_from_text(value text)
RETURNS SETOF text
LANGUAGE plpgsql
AS $$
BEGIN
  IF value IS NULL OR btrim(value) = '' THEN
    RETURN;
  END IF;

  IF left(btrim(value), 1) = '[' THEN
    BEGIN
      RETURN QUERY
      SELECT jsonb_array_elements_text(value::jsonb);
      RETURN;
    EXCEPTION WHEN others THEN
      RETURN NEXT value;
      RETURN;
    END;
  END IF;

  RETURN NEXT value;
END;
$$;

CREATE OR REPLACE FUNCTION public._migrate_supporting_document_column(
  source_table regclass,
  source_column text,
  target_bucket text,
  target_document_type text
)
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_attribute
    WHERE attrelid = source_table
      AND attname = source_column
      AND NOT attisdropped
  ) THEN
    RETURN;
  END IF;

  EXECUTE format(
    $sql$
      INSERT INTO public.supporting_documents (
        entry_id,
        file_name,
        bucket_id,
        storage_path,
        document_type
      )
      SELECT
        source.entry_id,
        regexp_replace(split_part(paths.storage_path, '/', array_length(string_to_array(paths.storage_path, '/'), 1)), '^[0-9a-f-]{36}-', '', 'i'),
        %L,
        paths.storage_path,
        %L
      FROM %s AS source
      CROSS JOIN LATERAL public._storage_paths_from_text(source.%I) AS paths(storage_path)
      WHERE paths.storage_path IS NOT NULL
        AND btrim(paths.storage_path) <> ''
        AND NOT EXISTS (
          SELECT 1
          FROM public.supporting_documents existing
          WHERE existing.entry_id = source.entry_id
            AND existing.bucket_id = %L
            AND existing.storage_path = paths.storage_path
            AND existing.document_type = %L
        )
    $sql$,
    target_bucket,
    target_document_type,
    source_table,
    source_column,
    target_bucket,
    target_document_type
  );
END;
$$;

SELECT public._migrate_supporting_document_column('public.isip_publication_forms', 'publication_proof', 'form-a-bucket', 'publication_proof');
SELECT public._migrate_supporting_document_column('public.pbms_publication_forms', 'utilization_proof', 'form-a-bucket', 'utilization_proof');
SELECT public._migrate_supporting_document_column('public.isip_research_forms', 'attachments', 'form-b-bucket', 'attachments');
SELECT public._migrate_supporting_document_column('public.isip_oral_forms', 'attachments', 'form-c-bucket', 'attachments');
SELECT public._migrate_supporting_document_column('public.isip_patents_forms', 'attachments', 'form-d-bucket', 'attachments');
SELECT public._migrate_supporting_document_column('public.isip_creative_work_forms', 'research_proof', 'form-e-bucket', 'research_proof');
SELECT public._migrate_supporting_document_column('public.pbms_creative_work_forms', 'utilization_proof', 'form-e-bucket', 'utilization_proof');
SELECT public._migrate_supporting_document_column('public.isip_awards_forms', 'attachments', 'form-f-bucket', 'attachments');
SELECT public._migrate_supporting_document_column('public.isip_trainings_forms', 'attachments', 'form-g-bucket', 'attachments');
SELECT public._migrate_supporting_document_column('public.isip_extension_programs_forms', 'program_description', 'form-h-bucket', 'program_description');
SELECT public._migrate_supporting_document_column('public.pbms_partnerships_forms', 'partnership_agreement', 'form-i-bucket', 'partnership_agreement');
SELECT public._migrate_supporting_document_column('public.isip_authorship_forms', 'attachments', 'form-j-bucket', 'attachments');
SELECT public._migrate_supporting_document_column('public.isip_other_accomplishments_forms', 'attachments', 'form-k-bucket', 'attachments');

DROP VIEW IF EXISTS public.isip_awards_grants_forms;

ALTER TABLE public.isip_authorship_forms DROP COLUMN IF EXISTS attachments;
ALTER TABLE public.isip_awards_forms DROP COLUMN IF EXISTS attachments;
ALTER TABLE public.isip_creative_work_forms DROP COLUMN IF EXISTS research_proof;
ALTER TABLE public.isip_extension_programs_forms DROP COLUMN IF EXISTS program_description;
ALTER TABLE public.isip_trainings_forms DROP COLUMN IF EXISTS attachments;
ALTER TABLE public.isip_other_accomplishments_forms DROP COLUMN IF EXISTS attachments;
ALTER TABLE public.isip_publication_forms DROP COLUMN IF EXISTS publication_proof;
ALTER TABLE public.isip_research_forms DROP COLUMN IF EXISTS attachments;
ALTER TABLE public.isip_oral_forms DROP COLUMN IF EXISTS attachments;
ALTER TABLE public.isip_patents_forms DROP COLUMN IF EXISTS attachments;
ALTER TABLE public.pbms_publication_forms DROP COLUMN IF EXISTS utilization_proof;
ALTER TABLE public.pbms_creative_work_forms DROP COLUMN IF EXISTS utilization_proof;
ALTER TABLE public.pbms_partnerships_forms DROP COLUMN IF EXISTS partnership_agreement;

CREATE OR REPLACE VIEW public.isip_awards_grants_forms
WITH (security_invoker = true) AS
SELECT
    entry_id,
    type,
    award,
    source,
    details,
    start_date,
    end_date,
    remarks,
    related_kras
FROM public.isip_awards_forms;

REVOKE ALL ON public.isip_awards_grants_forms FROM anon;
REVOKE ALL ON public.isip_awards_grants_forms FROM PUBLIC;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.isip_awards_grants_forms TO authenticated;

DROP FUNCTION IF EXISTS public._migrate_supporting_document_column(regclass, text, text, text);
DROP FUNCTION IF EXISTS public._storage_paths_from_text(text);

NOTIFY pgrst, 'reload schema';
