-- Extend organizations with branding fields
ALTER TABLE public.organizations
  ADD COLUMN IF NOT EXISTS logo_url text,
  ADD COLUMN IF NOT EXISTS banner_url text,
  ADD COLUMN IF NOT EXISTS theme_accent text,      -- hex or css var, e.g. #6d28d9
  ADD COLUMN IF NOT EXISTS theme_mode text DEFAULT 'light',   -- 'light' | 'dark' (optional)
  ADD COLUMN IF NOT EXISTS updated_by uuid REFERENCES auth.users(id),
  ADD COLUMN IF NOT EXISTS updated_at timestamptz DEFAULT now();

-- Create index for performance
CREATE INDEX IF NOT EXISTS organizations_theme_idx ON public.organizations(id, theme_accent);

-- Create Supabase Storage bucket for org branding (public read)
INSERT INTO storage.buckets (id, name, public) 
VALUES ('org-branding', 'org-branding', true)
ON CONFLICT (id) DO NOTHING;

-- RLS for storage bucket - public read, auth write with org ownership check
CREATE POLICY "Anyone can view org branding files" ON storage.objects
  FOR SELECT USING (bucket_id = 'org-branding');

CREATE POLICY "Org owners/instructors can upload branding" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'org-branding' AND
    auth.uid() IS NOT NULL AND
    EXISTS (
      SELECT 1 FROM public.org_members m
      JOIN public.organizations o ON o.id = m.org_id
      WHERE m.user_id = auth.uid()
        AND m.role IN ('owner', 'instructor')  
        AND m.status = 'active'
        AND SPLIT_PART(name, '/', 1) = o.id::text
    )
  );

CREATE POLICY "Org owners/instructors can update branding" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'org-branding' AND
    auth.uid() IS NOT NULL AND
    EXISTS (
      SELECT 1 FROM public.org_members m
      JOIN public.organizations o ON o.id = m.org_id
      WHERE m.user_id = auth.uid()
        AND m.role IN ('owner', 'instructor')
        AND m.status = 'active'
        AND SPLIT_PART(name, '/', 1) = o.id::text
    )
  );

CREATE POLICY "Org owners/instructors can delete branding" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'org-branding' AND
    auth.uid() IS NOT NULL AND
    EXISTS (
      SELECT 1 FROM public.org_members m
      JOIN public.organizations o ON o.id = m.org_id
      WHERE m.user_id = auth.uid()
        AND m.role IN ('owner', 'instructor')
        AND m.status = 'active'
        AND SPLIT_PART(name, '/', 1) = o.id::text
    )
  );

-- Add trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_organizations_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  NEW.updated_by = auth.uid();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER organizations_updated_at_trigger
  BEFORE UPDATE ON public.organizations
  FOR EACH ROW
  EXECUTE FUNCTION update_organizations_updated_at();