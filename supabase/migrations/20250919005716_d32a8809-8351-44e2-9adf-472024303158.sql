-- Add new columns to org_courses table for course builder
ALTER TABLE org_courses ADD COLUMN IF NOT EXISTS background_image_url TEXT;
ALTER TABLE org_courses ADD COLUMN IF NOT EXISTS framework TEXT DEFAULT 'interactive_micro_learning';
ALTER TABLE org_courses ADD COLUMN IF NOT EXISTS lesson_structure JSONB DEFAULT '[]';
ALTER TABLE org_courses ADD COLUMN IF NOT EXISTS micro_lesson_data JSONB DEFAULT '{}';
ALTER TABLE org_courses ADD COLUMN IF NOT EXISTS duration_estimate_mins INTEGER;
ALTER TABLE org_courses ADD COLUMN IF NOT EXISTS objectives JSONB DEFAULT '[]';
ALTER TABLE org_courses ADD COLUMN IF NOT EXISTS prerequisites JSONB DEFAULT '[]';

-- Create storage bucket for org assets
INSERT INTO storage.buckets (id, name, public) 
VALUES ('org-assets', 'org-assets', false) 
ON CONFLICT (id) DO NOTHING;

-- RLS policies for org-assets bucket
CREATE POLICY "Org members can upload assets" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'org-assets' AND
  EXISTS (
    SELECT 1 FROM org_members 
    WHERE org_id::text = (storage.foldername(name))[1] 
    AND user_id = auth.uid() 
    AND status = 'active'
  )
);

CREATE POLICY "Org members can view their org assets" ON storage.objects
FOR SELECT USING (
  bucket_id = 'org-assets' AND
  EXISTS (
    SELECT 1 FROM org_members 
    WHERE org_id::text = (storage.foldername(name))[1] 
    AND user_id = auth.uid() 
    AND status = 'active'
  )
);

CREATE POLICY "Org members can update their org assets" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'org-assets' AND
  EXISTS (
    SELECT 1 FROM org_members 
    WHERE org_id::text = (storage.foldername(name))[1] 
    AND user_id = auth.uid() 
    AND status = 'active'
  )
);

CREATE POLICY "Org members can delete their org assets" ON storage.objects
FOR DELETE USING (
  bucket_id = 'org-assets' AND
  EXISTS (
    SELECT 1 FROM org_members 
    WHERE org_id::text = (storage.foldername(name))[1] 
    AND user_id = auth.uid() 
    AND status = 'active'
  )
);