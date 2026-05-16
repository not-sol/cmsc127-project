-- supabase/migrations/20260516104500_create_form_d_bucket.sql

-- 1. Create the bucket 'form-d-bucket' if it doesn't exist
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'form-d-bucket', 
    'form-d-bucket', 
    false, -- private bucket
    52428800, -- 50MB limit
    '{image/*,application/pdf}'
)
ON CONFLICT (id) DO NOTHING;

-- 2. Create Storage Policies for 'form-d-bucket'
-- Authenticated users can upload
DROP POLICY IF EXISTS "Allow authenticated uploads to form-d-bucket" ON storage.objects;
CREATE POLICY "Allow authenticated uploads to form-d-bucket"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'form-d-bucket');

-- Authenticated users can read THEIR OWN files
DROP POLICY IF EXISTS "Allow authenticated users to read form-d-bucket" ON storage.objects;
CREATE POLICY "Allow authenticated users to read form-d-bucket"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'form-d-bucket' AND (auth.uid() = owner));

-- Authenticated users can update THEIR OWN files
DROP POLICY IF EXISTS "Allow authenticated users to update form-d-bucket" ON storage.objects;
CREATE POLICY "Allow authenticated users to update form-d-bucket"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'form-d-bucket' AND (auth.uid() = owner))
WITH CHECK (bucket_id = 'form-d-bucket');

-- Authenticated users can delete THEIR OWN files
DROP POLICY IF EXISTS "Allow authenticated users to delete from form-d-bucket" ON storage.objects;
CREATE POLICY "Allow authenticated users to delete from form-d-bucket"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'form-d-bucket' AND (auth.uid() = owner));
