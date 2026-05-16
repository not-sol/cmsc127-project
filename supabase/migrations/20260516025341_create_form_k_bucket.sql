-- supabase/migrations/20260516025341_create_form_k_bucket.sql

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'form-k-bucket',
    'form-k-bucket',
    false,
    52428800,
    '{image/*,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document}'
)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "Allow authenticated uploads to form-k-bucket" ON storage.objects;
CREATE POLICY "Allow authenticated uploads to form-k-bucket"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'form-k-bucket');

DROP POLICY IF EXISTS "Allow authenticated users to read form-k-bucket" ON storage.objects;
CREATE POLICY "Allow authenticated users to read form-k-bucket"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'form-k-bucket' AND (auth.uid() = owner));

DROP POLICY IF EXISTS "Allow authenticated users to update form-k-bucket" ON storage.objects;
CREATE POLICY "Allow authenticated users to update form-k-bucket"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'form-k-bucket' AND (auth.uid() = owner))
WITH CHECK (bucket_id = 'form-k-bucket');

DROP POLICY IF EXISTS "Allow authenticated users to delete from form-k-bucket" ON storage.objects;
CREATE POLICY "Allow authenticated users to delete from form-k-bucket"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'form-k-bucket' AND (auth.uid() = owner));
