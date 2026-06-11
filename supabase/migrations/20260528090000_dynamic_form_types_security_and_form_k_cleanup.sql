-- Resolve form types from the lookup table and keep the canonical names stable.
INSERT INTO public.form_types (form_type_id, form_name)
VALUES
  (1, 'Publications'),
  (2, 'Research, Grants, and Fellowships'),
  (3, 'Paper Presentations'),
  (4, 'Patents'),
  (5, 'Creative Work'),
  (6, 'Awards and Grants'),
  (7, 'Trainings'),
  (8, 'Extension Programs'),
  (9, 'Partnerships'),
  (10, 'Authorships'),
  (11, 'Other Accomplishments')
ON CONFLICT (form_type_id) DO UPDATE
SET form_name = EXCLUDED.form_name;

WITH entry_form_types AS (
  SELECT entry_id, 'Publications' AS form_name FROM public.isip_publication_forms
  UNION ALL
  SELECT entry_id, 'Research, Grants, and Fellowships' FROM public.isip_research_forms
  UNION ALL
  SELECT entry_id, 'Paper Presentations' FROM public.isip_oral_forms
  UNION ALL
  SELECT entry_id, 'Patents' FROM public.isip_patents_forms
  UNION ALL
  SELECT entry_id, 'Creative Work' FROM public.isip_creative_work_forms
  UNION ALL
  SELECT entry_id, 'Awards and Grants' FROM public.isip_awards_forms
  UNION ALL
  SELECT entry_id, 'Trainings' FROM public.isip_trainings_forms
  UNION ALL
  SELECT entry_id, 'Extension Programs' FROM public.isip_extension_programs_forms
  UNION ALL
  SELECT entry_id, 'Partnerships' FROM public.isip_partnership_forms
  UNION ALL
  SELECT entry_id, 'Authorships' FROM public.isip_authorship_forms
  UNION ALL
  SELECT entry_id, 'Other Accomplishments' FROM public.isip_other_accomplishments_forms
)
UPDATE public.forms AS forms
SET form_type_id = form_types.form_type_id
FROM entry_form_types
JOIN public.form_types
  ON form_types.form_name = entry_form_types.form_name
WHERE forms.entry_id = entry_form_types.entry_id
  AND forms.form_type_id IS DISTINCT FROM form_types.form_type_id;

-- The legacy compatibility view should run with caller permissions so base-table
-- RLS policies on public.isip_awards_forms remain authoritative.
ALTER VIEW IF EXISTS public.isip_awards_grants_forms
SET (security_invoker = true);

REVOKE ALL ON public.isip_awards_grants_forms FROM anon;
REVOKE ALL ON public.isip_awards_grants_forms FROM PUBLIC;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.isip_awards_grants_forms TO authenticated;

-- Keep PBMS Form K to PBMS-only fields. Shared title/date/venue/participation/
-- remarks/KRA data lives in public.isip_other_accomplishments_forms.
ALTER TABLE public.pbms_other_accomplishments_forms
DROP COLUMN IF EXISTS accomplishment_title,
DROP COLUMN IF EXISTS accomplishment_date,
DROP COLUMN IF EXISTS venue,
DROP COLUMN IF EXISTS participation,
DROP COLUMN IF EXISTS remarks,
DROP COLUMN IF EXISTS related_kras;

NOTIFY pgrst, 'reload schema';
