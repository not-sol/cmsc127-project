-- supabase/migrations/20260516024057_create_form_b_bucket.sql

-- Create Form B's dedicated private storage bucket.
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'form-b-bucket',
    'form-b-bucket',
    false,
    52428800,
    '{image/*,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document}'
)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "Allow authenticated uploads to form-b-bucket" ON storage.objects;
CREATE POLICY "Allow authenticated uploads to form-b-bucket"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'form-b-bucket');

DROP POLICY IF EXISTS "Allow authenticated users to read form-b-bucket" ON storage.objects;
CREATE POLICY "Allow authenticated users to read form-b-bucket"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'form-b-bucket' AND (auth.uid() = owner));

DROP POLICY IF EXISTS "Allow authenticated users to update form-b-bucket" ON storage.objects;
CREATE POLICY "Allow authenticated users to update form-b-bucket"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'form-b-bucket' AND (auth.uid() = owner))
WITH CHECK (bucket_id = 'form-b-bucket');

DROP POLICY IF EXISTS "Allow authenticated users to delete from form-b-bucket" ON storage.objects;
CREATE POLICY "Allow authenticated users to delete from form-b-bucket"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'form-b-bucket' AND (auth.uid() = owner));
