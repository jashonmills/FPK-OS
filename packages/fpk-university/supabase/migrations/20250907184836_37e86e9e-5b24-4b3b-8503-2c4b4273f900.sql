-- Fix storage policies for org branding uploads
-- Drop existing restrictive policies
drop policy if exists "Org members can upload branding files" on storage.objects;
drop policy if exists "Org members can update branding files" on storage.objects;

-- Create simpler policies that work
create policy "Authenticated users can upload to org branding bucket" on storage.objects
  for insert with check (
    bucket_id = 'org-branding' 
    and auth.uid() is not null
  );

create policy "Authenticated users can update org branding files" on storage.objects
  for update using (
    bucket_id = 'org-branding' 
    and auth.uid() is not null
  );

create policy "Authenticated users can delete org branding files" on storage.objects
  for delete using (
    bucket_id = 'org-branding' 
    and auth.uid() is not null
  );