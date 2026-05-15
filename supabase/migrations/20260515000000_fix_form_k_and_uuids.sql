-- Migration to fix Form K and ensure UUIDs
-- This migration updates the new form_k_other_accomplishments table
-- to include the missing endDate field and ensures it's ready for use.

ALTER TABLE public.form_k_other_accomplishments 
ADD COLUMN IF NOT EXISTS end_date date;

-- Ensure RLS is correctly set for the new tables (redundant if already done, but safe)
DO $$
DECLARE
    table_name text;
    tables text[] := ARRAY[
        'form_a_publications',
        'form_b_grants_and_fellowships',
        'form_c_presentations',
        'form_d_patents',
        'form_e_creative_work_outputs',
        'form_f_awards_and_grants',
        'form_g_trainings',
        'form_h_extension_programs',
        'form_i_partnerships',
        'form_j_authorships',
        'form_k_other_accomplishments'
    ];
BEGIN
    FOREACH table_name IN ARRAY tables LOOP
        -- Enable RLS
        EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY', table_name);

        -- Insert Policy: Users can only insert their own records
        EXECUTE format('DROP POLICY IF EXISTS "Users can insert their own records" ON public.%I', table_name);
        EXECUTE format('CREATE POLICY "Users can insert their own records" ON public.%I FOR INSERT TO authenticated WITH CHECK (auth.uid() = submitted_by)', table_name);

        -- Select Policy: Users can view all records
        EXECUTE format('DROP POLICY IF EXISTS "Enable select for authenticated users only" ON public.%I', table_name);
        EXECUTE format('CREATE POLICY "Enable select for authenticated users only" ON public.%I FOR SELECT TO authenticated USING (true)', table_name);

        -- Update Policy: Users can only update their own records
        EXECUTE format('DROP POLICY IF EXISTS "Users can update their own records" ON public.%I', table_name);
        EXECUTE format('CREATE POLICY "Users can update their own records" ON public.%I FOR UPDATE TO authenticated USING (auth.uid() = submitted_by)', table_name);
        
        -- Delete Policy: Users can only delete their own records
        EXECUTE format('DROP POLICY IF EXISTS "Users can delete their own records" ON public.%I', table_name);
        EXECUTE format('CREATE POLICY "Users can delete their own records" ON public.%I FOR DELETE TO authenticated USING (auth.uid() = submitted_by)', table_name);
    END LOOP;
END $$;
