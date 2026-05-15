-- supabase/migrations/20260515110000_create_form_a_bucket.sql

-- 1. Create the bucket if it doesn't exist
-- We insert into storage.buckets which is the standard Supabase way to manage buckets via SQL.
-- We use ON CONFLICT (id) DO NOTHING to make this idempotent.
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'form-a-bucket', 
    'form-a-bucket', 
    false, -- private bucket
    52428800, -- 50MB limit (in bytes)
    '{image/*,application/pdf}' -- optional: restrict to images and PDFs
)
ON CONFLICT (id) DO NOTHING;

-- Note: We DO NOT call ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY.
-- In Supabase, RLS is enabled by default on storage.objects, and standard
-- database users (even 'postgres') are not the owners of the storage schema.

-- 2. Create Storage Policies for 'form-a-bucket'
-- We use DROP POLICY IF EXISTS to ensure the migration can be re-run safely.

-- Policy: Allow authenticated users to upload files (Insert)
DROP POLICY IF EXISTS "Allow authenticated uploads to form-a-bucket" ON storage.objects;
CREATE POLICY "Allow authenticated uploads to form-a-bucket"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
    bucket_id = 'form-a-bucket'
);

-- Policy: Allow authenticated users to view THEIR OWN files (Select)
DROP POLICY IF EXISTS "Allow authenticated users to read form-a-bucket" ON storage.objects;
CREATE POLICY "Allow authenticated users to read form-a-bucket"
ON storage.objects FOR SELECT
TO authenticated
USING (
    bucket_id = 'form-a-bucket' AND (auth.uid() = owner)
);

-- Policy: Allow authenticated users to update THEIR OWN uploads (Update)
DROP POLICY IF EXISTS "Allow authenticated users to update form-a-bucket" ON storage.objects;
CREATE POLICY "Allow authenticated users to update form-a-bucket"
ON storage.objects FOR UPDATE
TO authenticated
USING (
    bucket_id = 'form-a-bucket' AND (auth.uid() = owner)
)
WITH CHECK (
    bucket_id = 'form-a-bucket'
);

-- Policy: Allow authenticated users to delete THEIR OWN uploads (Delete)
DROP POLICY IF EXISTS "Allow authenticated users to delete from form-a-bucket" ON storage.objects;
CREATE POLICY "Allow authenticated users to delete from form-a-bucket"
ON storage.objects FOR DELETE
TO authenticated
USING (
    bucket_id = 'form-a-bucket' AND (auth.uid() = owner)
);
