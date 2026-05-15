-- supabase/migrations/20260516031233_create_form_f_bucket.sql

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'form-f-bucket',
    'form-f-bucket',
    false,
    52428800,
    '{image/*,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document}'
)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "Allow authenticated uploads to form-f-bucket" ON storage.objects;
CREATE POLICY "Allow authenticated uploads to form-f-bucket"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'form-f-bucket');

DROP POLICY IF EXISTS "Allow authenticated users to read form-f-bucket" ON storage.objects;
CREATE POLICY "Allow authenticated users to read form-f-bucket"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'form-f-bucket' AND (auth.uid() = owner));

DROP POLICY IF EXISTS "Allow authenticated users to update form-f-bucket" ON storage.objects;
CREATE POLICY "Allow authenticated users to update form-f-bucket"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'form-f-bucket' AND (auth.uid() = owner))
WITH CHECK (bucket_id = 'form-f-bucket');

DROP POLICY IF EXISTS "Allow authenticated users to delete from form-f-bucket" ON storage.objects;
CREATE POLICY "Allow authenticated users to delete from form-f-bucket"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'form-f-bucket' AND (auth.uid() = owner));
