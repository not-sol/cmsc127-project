-- supabase/migrations/20260516025340_create_form_j_bucket.sql

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'form-j-bucket',
    'form-j-bucket',
    false,
    52428800,
    '{image/*,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document}'
)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "Allow authenticated uploads to form-j-bucket" ON storage.objects;
CREATE POLICY "Allow authenticated uploads to form-j-bucket"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'form-j-bucket');

DROP POLICY IF EXISTS "Allow authenticated users to read form-j-bucket" ON storage.objects;
CREATE POLICY "Allow authenticated users to read form-j-bucket"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'form-j-bucket' AND (auth.uid() = owner));

DROP POLICY IF EXISTS "Allow authenticated users to update form-j-bucket" ON storage.objects;
CREATE POLICY "Allow authenticated users to update form-j-bucket"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'form-j-bucket' AND (auth.uid() = owner))
WITH CHECK (bucket_id = 'form-j-bucket');

DROP POLICY IF EXISTS "Allow authenticated users to delete from form-j-bucket" ON storage.objects;
CREATE POLICY "Allow authenticated users to delete from form-j-bucket"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'form-j-bucket' AND (auth.uid() = owner));
