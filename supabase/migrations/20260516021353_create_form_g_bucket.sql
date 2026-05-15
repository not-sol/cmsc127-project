-- supabase/migrations/20260516021353_create_form_g_bucket.sql

-- Create Form G's dedicated private storage bucket.
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'form-g-bucket',
    'form-g-bucket',
    false,
    52428800,
    '{image/*,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document}'
)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "Allow authenticated uploads to form-g-bucket" ON storage.objects;
CREATE POLICY "Allow authenticated uploads to form-g-bucket"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'form-g-bucket');

DROP POLICY IF EXISTS "Allow authenticated users to read form-g-bucket" ON storage.objects;
CREATE POLICY "Allow authenticated users to read form-g-bucket"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'form-g-bucket' AND (auth.uid() = owner));

DROP POLICY IF EXISTS "Allow authenticated users to update form-g-bucket" ON storage.objects;
CREATE POLICY "Allow authenticated users to update form-g-bucket"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'form-g-bucket' AND (auth.uid() = owner))
WITH CHECK (bucket_id = 'form-g-bucket');

DROP POLICY IF EXISTS "Allow authenticated users to delete from form-g-bucket" ON storage.objects;
CREATE POLICY "Allow authenticated users to delete from form-g-bucket"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'form-g-bucket' AND (auth.uid() = owner));
