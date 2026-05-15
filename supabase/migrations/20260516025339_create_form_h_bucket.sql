-- supabase/migrations/20260516025339_create_form_h_bucket.sql

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'form-h-bucket',
    'form-h-bucket',
    false,
    52428800,
    '{image/*,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document}'
)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "Allow authenticated uploads to form-h-bucket" ON storage.objects;
CREATE POLICY "Allow authenticated uploads to form-h-bucket"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'form-h-bucket');

DROP POLICY IF EXISTS "Allow authenticated users to read form-h-bucket" ON storage.objects;
CREATE POLICY "Allow authenticated users to read form-h-bucket"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'form-h-bucket' AND (auth.uid() = owner));

DROP POLICY IF EXISTS "Allow authenticated users to update form-h-bucket" ON storage.objects;
CREATE POLICY "Allow authenticated users to update form-h-bucket"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'form-h-bucket' AND (auth.uid() = owner))
WITH CHECK (bucket_id = 'form-h-bucket');

DROP POLICY IF EXISTS "Allow authenticated users to delete from form-h-bucket" ON storage.objects;
CREATE POLICY "Allow authenticated users to delete from form-h-bucket"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'form-h-bucket' AND (auth.uid() = owner));
