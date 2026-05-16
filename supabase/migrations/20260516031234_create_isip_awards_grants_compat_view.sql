-- supabase/migrations/20260516031234_create_isip_awards_grants_compat_view.sql

-- The canonical table is public.isip_awards_forms. This compatibility view
-- prevents older clients from failing with PGRST205 on isip_awards_grants_forms.
CREATE OR REPLACE VIEW public.isip_awards_grants_forms AS
SELECT
    entry_id,
    type,
    award,
    source,
    details,
    start_date,
    end_date,
    attachments,
    remarks,
    related_kras
FROM public.isip_awards_forms;

GRANT SELECT, INSERT, UPDATE, DELETE ON public.isip_awards_grants_forms TO authenticated;

NOTIFY pgrst, 'reload schema';
