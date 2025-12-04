-- Add RLS policies for org-assets bucket to allow file uploads

-- Allow authenticated users to insert files into org-assets bucket
CREATE POLICY "Allow authenticated users to upload to org-assets" 
ON storage.objects 
FOR INSERT 
TO authenticated
WITH CHECK (bucket_id = 'org-assets');

-- Allow authenticated users to select files from org-assets bucket
CREATE POLICY "Allow authenticated users to view org-assets files" 
ON storage.objects 
FOR SELECT 
TO authenticated
USING (bucket_id = 'org-assets');

-- Allow authenticated users to update files in org-assets bucket
CREATE POLICY "Allow authenticated users to update org-assets files" 
ON storage.objects 
FOR UPDATE 
TO authenticated
USING (bucket_id = 'org-assets');

-- Allow authenticated users to delete files from org-assets bucket
CREATE POLICY "Allow authenticated users to delete org-assets files" 
ON storage.objects 
FOR DELETE 
TO authenticated
USING (bucket_id = 'org-assets');