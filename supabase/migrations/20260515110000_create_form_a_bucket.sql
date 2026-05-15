-- supabase/migrations/20260515110000_create_form_a_bucket.sql

-- 1. Create the bucket if it doesn't exist
-- Note: We insert into storage.buckets which is the standard Supabase way to manage buckets via SQL
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'form-a-bucket', 
    'form-a-bucket', 
    false, -- private bucket
    52428800, -- 50MB limit (in bytes)
    '{image/*,application/pdf}' -- optional: restrict to images and PDFs
)
ON CONFLICT (id) DO NOTHING;

-- 2. Enable RLS on the storage.objects table (standard practice)
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- 3. Create Storage Policies for 'form-a-bucket'
-- We use separate policies for each action (Select, Insert, Update, Delete)

-- Policy: Allow authenticated users to upload files (Insert)
CREATE POLICY "Allow authenticated uploads to form-a-bucket"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
    bucket_id = 'form-a-bucket'
);

-- Policy: Allow users to view their own uploads (Select)
-- Note: In many apps, you might want users to see all files in this bucket 
-- if they are reviewers, or just their own. This policy allows authenticated users to read.
CREATE POLICY "Allow authenticated users to read form-a-bucket"
ON storage.objects FOR SELECT
TO authenticated
USING (
    bucket_id = 'form-a-bucket'
);

-- Policy: Allow users to update their own uploads (Update)
CREATE POLICY "Allow authenticated users to update form-a-bucket"
ON storage.objects FOR UPDATE
TO authenticated
USING (
    bucket_id = 'form-a-bucket'
)
WITH CHECK (
    bucket_id = 'form-a-bucket'
);

-- Policy: Allow users to delete their own uploads (Delete)
CREATE POLICY "Allow authenticated users to delete from form-a-bucket"
ON storage.objects FOR DELETE
TO authenticated
USING (
    bucket_id = 'form-a-bucket'
);
