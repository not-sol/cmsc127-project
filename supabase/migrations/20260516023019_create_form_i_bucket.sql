-- supabase/migrations/20260516023019_create_form_i_bucket.sql

-- Create Form I's dedicated private storage bucket.
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'form-i-bucket',
    'form-i-bucket',
    false,
    52428800,
    '{application/pdf}'
)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "Allow authenticated uploads to form-i-bucket" ON storage.objects;
CREATE POLICY "Allow authenticated uploads to form-i-bucket"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'form-i-bucket');

DROP POLICY IF EXISTS "Allow authenticated users to read form-i-bucket" ON storage.objects;
CREATE POLICY "Allow authenticated users to read form-i-bucket"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'form-i-bucket' AND (auth.uid() = owner));

DROP POLICY IF EXISTS "Allow authenticated users to update form-i-bucket" ON storage.objects;
CREATE POLICY "Allow authenticated users to update form-i-bucket"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'form-i-bucket' AND (auth.uid() = owner))
WITH CHECK (bucket_id = 'form-i-bucket');

DROP POLICY IF EXISTS "Allow authenticated users to delete from form-i-bucket" ON storage.objects;
CREATE POLICY "Allow authenticated users to delete from form-i-bucket"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'form-i-bucket' AND (auth.uid() = owner));
