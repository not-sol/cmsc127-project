-- Migration: Fix user deletion workflow to remove users from both public.users and auth.users
-- This ensures no orphaned auth accounts remain and all related data is cleaned up.

-- 1. Update foreign keys to use ON DELETE CASCADE
-- This allows deletion of a user to automatically clean up their reports, entries, and forms.

-- accomplishment_reports -> users
ALTER TABLE public.accomplishment_reports
  DROP CONSTRAINT IF EXISTS accomplishment_reports_faculty_id_fkey,
  ADD CONSTRAINT accomplishment_reports_faculty_id_fkey
    FOREIGN KEY (faculty_id) REFERENCES public.users(id) ON DELETE CASCADE;

-- forms -> accomplishment_reports
ALTER TABLE public.forms
  DROP CONSTRAINT IF EXISTS accomplishment_entries_report_id_fkey,
  ADD CONSTRAINT accomplishment_entries_report_id_fkey
    FOREIGN KEY (report_id) REFERENCES public.accomplishment_reports(report_id) ON DELETE CASCADE;

-- reviews -> accomplishment_reports
ALTER TABLE public.reviews
  DROP CONSTRAINT IF EXISTS reviews_report_id_fkey,
  ADD CONSTRAINT reviews_report_id_fkey
    FOREIGN KEY (report_id) REFERENCES public.accomplishment_reports(report_id) ON DELETE CASCADE;

-- reviews -> users (reviewer)
-- We set to NULL instead of CASCADE here because we might want to keep the review record 
-- but indicate the reviewer is no longer in the system. 
-- However, if the report owner is deleted, the review will be deleted anyway via the CASCADE above.
ALTER TABLE public.reviews
  DROP CONSTRAINT IF EXISTS reviews_reviewed_by_fkey,
  ADD CONSTRAINT reviews_reviewed_by_fkey
    FOREIGN KEY (reviewed_by) REFERENCES public.users(id) ON DELETE SET NULL;

-- export_records -> users
ALTER TABLE public.export_records
  DROP CONSTRAINT IF EXISTS export_records_generated_by_fkey,
  ADD CONSTRAINT export_records_generated_by_fkey
    FOREIGN KEY (generated_by) REFERENCES public.users(id) ON DELETE CASCADE;

-- supporting_documents -> forms
ALTER TABLE public.supporting_documents
  DROP CONSTRAINT IF EXISTS supporting_documents_entry_id_fkey,
  ADD CONSTRAINT supporting_documents_entry_id_fkey
    FOREIGN KEY (entry_id) REFERENCES public.forms(entry_id) ON DELETE CASCADE;

-- Update all ISIP and PBMS form tables to cascade from the forms table
DO $$
DECLARE
    t text;
BEGIN
    FOR t IN 
        SELECT tablename 
        FROM pg_tables 
        WHERE schemaname = 'public' 
        AND (tablename LIKE 'isip_%' OR tablename LIKE 'pbms_%')
    LOOP
        -- First, clean up orphaned records that don't have a corresponding entry in public.forms
        IF EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_name = t AND column_name = 'entry_id'
        ) THEN
            EXECUTE format('DELETE FROM public.%I WHERE entry_id NOT IN (SELECT entry_id FROM public.forms)', t);
            
            -- Update entry_id foreign key to forms(entry_id)
            DECLARE
                const_name text;
            BEGIN
                SELECT conname INTO const_name
                FROM pg_constraint
                WHERE conrelid = (format('public.%I', t))::regclass
                AND contype = 'f'
                AND confrelid = 'public.forms'::regclass;
                
                IF const_name IS NOT NULL THEN
                    EXECUTE format('ALTER TABLE public.%I DROP CONSTRAINT %I', t, const_name);
                END IF;
                
                EXECUTE format('ALTER TABLE public.%I ADD CONSTRAINT %I_entry_id_fkey FOREIGN KEY (entry_id) REFERENCES public.forms(entry_id) ON DELETE CASCADE', t, t);
            END;
        END IF;

        -- Update submitted_by foreign key to auth.users(id) if it exists
        IF EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_name = t AND column_name = 'submitted_by'
        ) THEN
            DECLARE
                const_name text;
            BEGIN
                SELECT conname INTO const_name
                FROM pg_constraint
                WHERE conrelid = (format('public.%I', t))::regclass
                AND contype = 'f'
                AND confrelid = 'auth.users'::regclass;
                
                IF const_name IS NOT NULL THEN
                    EXECUTE format('ALTER TABLE public.%I DROP CONSTRAINT %I', t, const_name);
                END IF;
                
                EXECUTE format('ALTER TABLE public.%I ADD CONSTRAINT %I_submitted_by_fkey FOREIGN KEY (submitted_by) REFERENCES auth.users(id) ON DELETE CASCADE', t, t);
            END;
        END IF;
    END LOOP;
END $$;


-- 2. Create the RPC function to delete user from auth.users

CREATE OR REPLACE FUNCTION public.delete_user_entirely(target_user_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth
AS $$
BEGIN
  -- Check if the current user is an admin
  IF NOT public.is_admin() THEN
    RAISE EXCEPTION 'Only admins can delete users'
      USING ERRCODE = '42501';
  END IF;

  -- Prevent admin from deleting themselves
  IF target_user_id = auth.uid() THEN
    RAISE EXCEPTION 'Admins cannot delete themselves'
      USING ERRCODE = '42501';
  END IF;

  -- Delete from auth.users
  -- This will cascade to public.users (due to existing constraint)
  -- And then to all other tables due to the cascading constraints added above.
  DELETE FROM auth.users WHERE id = target_user_id;
END;
$$;

-- Grant access to the function
REVOKE EXECUTE ON FUNCTION public.delete_user_entirely(uuid) FROM public;
GRANT EXECUTE ON FUNCTION public.delete_user_entirely(uuid) TO authenticated;

COMMENT ON FUNCTION public.delete_user_entirely(uuid) IS 'Deletes a user from both auth.users and public.users, including all their related data.';
