-- supabase/migrations/20260515120000_create_form_c_bucket.sql

-- 1. Create the bucket 'form-c-bucket' if it doesn't exist
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'form-c-bucket', 
    'form-c-bucket', 
    false, -- private bucket
    52428800, -- 50MB limit
    '{image/*,application/pdf}'
)
ON CONFLICT (id) DO NOTHING;

-- 2. Create Storage Policies for 'form-c-bucket'
-- Policy: Allow authenticated users to upload files
DROP POLICY IF EXISTS "Allow authenticated uploads to form-c-bucket" ON storage.objects;
CREATE POLICY "Allow authenticated uploads to form-c-bucket"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'form-c-bucket');

-- Policy: Allow authenticated users to view THEIR OWN files
DROP POLICY IF EXISTS "Allow authenticated users to read form-c-bucket" ON storage.objects;
CREATE POLICY "Allow authenticated users to read form-c-bucket"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'form-c-bucket' AND (auth.uid() = owner));

-- Policy: Allow authenticated users to update THEIR OWN uploads
DROP POLICY IF EXISTS "Allow authenticated users to update form-c-bucket" ON storage.objects;
CREATE POLICY "Allow authenticated users to update form-c-bucket"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'form-c-bucket' AND (auth.uid() = owner))
WITH CHECK (bucket_id = 'form-c-bucket');

-- Policy: Allow authenticated users to delete THEIR OWN uploads
DROP POLICY IF EXISTS "Allow authenticated users to delete from form-c-bucket" ON storage.objects;
CREATE POLICY "Allow authenticated users to delete from form-c-bucket"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'form-c-bucket' AND (auth.uid() = owner));
