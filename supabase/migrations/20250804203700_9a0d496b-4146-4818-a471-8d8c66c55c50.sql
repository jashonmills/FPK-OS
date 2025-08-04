-- Create storage policies for library-book-pdf bucket to allow user uploads
-- Policy for authenticated users to upload PDFs
CREATE POLICY "Authenticated users can upload PDFs"
ON storage.objects
FOR INSERT
TO public
WITH CHECK (
  bucket_id = 'library-book-pdf' 
  AND auth.role() = 'authenticated'
);

-- Policy for users to update their own uploads
CREATE POLICY "Users can update their own uploads"
ON storage.objects
FOR UPDATE
TO public
USING (
  bucket_id = 'library-book-pdf' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Policy for users to delete their own uploads
CREATE POLICY "Users can delete their own uploads"
ON storage.objects
FOR DELETE
TO public
USING (
  bucket_id = 'library-book-pdf' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);