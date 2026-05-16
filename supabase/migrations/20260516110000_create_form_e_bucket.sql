-- Create the shared Form E storage bucket.
-- Files are organized by the application under:
--   form-e-bucket/bin-1/
--   form-e-bucket/bin-2/

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'form-e-bucket',
    'form-e-bucket',
    false,
    52428800,
    '{image/*,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document}'
)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "Allow authenticated uploads to form-e-bucket" ON storage.objects;
CREATE POLICY "Allow authenticated uploads to form-e-bucket"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'form-e-bucket');

DROP POLICY IF EXISTS "Allow authenticated users to read form-e-bucket" ON storage.objects;
CREATE POLICY "Allow authenticated users to read form-e-bucket"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'form-e-bucket' AND (auth.uid() = owner));

DROP POLICY IF EXISTS "Allow authenticated users to update form-e-bucket" ON storage.objects;
CREATE POLICY "Allow authenticated users to update form-e-bucket"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'form-e-bucket' AND (auth.uid() = owner))
WITH CHECK (bucket_id = 'form-e-bucket');

DROP POLICY IF EXISTS "Allow authenticated users to delete from form-e-bucket" ON storage.objects;
CREATE POLICY "Allow authenticated users to delete from form-e-bucket"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'form-e-bucket' AND (auth.uid() = owner));
