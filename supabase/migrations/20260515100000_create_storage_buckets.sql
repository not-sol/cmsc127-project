-- Create the publication_proof bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('publication_proof', 'publication_proof', false)
ON CONFLICT (id) DO NOTHING;

-- Ensure RLS is enabled on storage.objects (usually it is by default in Supabase)
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- The policies are already defined in 20260512163016_remote_schema.sql, 
-- but we ensure they exist or are reinforced here if needed.
-- Since they were already in the remote schema, they should be fine.
