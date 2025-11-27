-- Make org-assets bucket public so background images can be displayed
UPDATE storage.buckets 
SET public = true 
WHERE id = 'org-assets';