-- Migration to remove submitted_by from isip_other_accomplishments_forms
-- This column was redundant as ownership is managed via the forms -> accomplishment_reports relationship

DO $$ 
BEGIN
    -- 1. Drop the policy that depends on the column
    DROP POLICY IF EXISTS "Verified users can update isip_other_accomplishments_forms" ON public.isip_other_accomplishments_forms;

    -- 2. Remove the column if it exists
    IF EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'isip_other_accomplishments_forms' 
        AND column_name = 'submitted_by'
    ) THEN
        ALTER TABLE public.isip_other_accomplishments_forms DROP COLUMN submitted_by;
    END IF;

    -- 3. Re-create the update policy using has_verified_profile() 
    -- consistency with the generic policies applied in 20260514120845
    CREATE POLICY "Verified users can update isip_other_accomplishments_forms" 
    ON public.isip_other_accomplishments_forms FOR UPDATE 
    TO authenticated 
    USING (public.has_verified_profile())
    WITH CHECK (public.has_verified_profile());

END $$;
