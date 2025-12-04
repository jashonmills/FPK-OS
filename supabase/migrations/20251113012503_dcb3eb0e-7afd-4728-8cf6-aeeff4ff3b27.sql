-- Project Bedrock Phase 2: Storage Setup
-- Create storage bucket for V3 documents

INSERT INTO storage.buckets (id, name, public)
VALUES ('v3-documents', 'v3-documents', false)
ON CONFLICT (id) DO NOTHING;

-- RLS policies for v3-documents bucket
CREATE POLICY "Family members can upload their v3 documents"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'v3-documents' AND
  EXISTS (
    SELECT 1 FROM family_members fm
    WHERE (storage.foldername(name))[1]::uuid = fm.family_id
    AND fm.user_id = auth.uid()
  )
);

CREATE POLICY "Family members can view their v3 documents"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'v3-documents' AND
  EXISTS (
    SELECT 1 FROM family_members fm
    WHERE (storage.foldername(name))[1]::uuid = fm.family_id
    AND fm.user_id = auth.uid()
  )
);

CREATE POLICY "Family members can delete their v3 documents"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'v3-documents' AND
  EXISTS (
    SELECT 1 FROM family_members fm
    WHERE (storage.foldername(name))[1]::uuid = fm.family_id
    AND fm.user_id = auth.uid()
  )
);