-- Create storage policy for library-book-pdf bucket to allow user uploads
-- Only create the upload policy that is missing
CREATE POLICY "Authenticated users can upload PDFs"
ON storage.objects
FOR INSERT
TO public
WITH CHECK (
  bucket_id = 'library-book-pdf' 
  AND auth.role() = 'authenticated'
);