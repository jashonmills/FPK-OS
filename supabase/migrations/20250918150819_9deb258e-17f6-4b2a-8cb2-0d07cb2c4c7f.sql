-- Create comprehensive org_branding table
CREATE TABLE IF NOT EXISTS public.org_branding (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  org_id UUID NOT NULL UNIQUE,
  accent_hex TEXT DEFAULT '#675bff',
  logo_light_url TEXT,
  logo_dark_url TEXT,
  banner_url TEXT,
  favicon_url TEXT,
  radius_scale TEXT DEFAULT 'md' CHECK (radius_scale IN ('sm', 'md', 'lg')),
  watermark_opacity REAL DEFAULT 0.1 CHECK (watermark_opacity >= 0 AND watermark_opacity <= 1),
  version INTEGER DEFAULT 1,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  CONSTRAINT fk_org_branding_org_id FOREIGN KEY (org_id) REFERENCES public.organizations(id) ON DELETE CASCADE
);

-- Enable RLS
ALTER TABLE public.org_branding ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Org owners can manage their branding" ON public.org_branding
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.organizations o 
      WHERE o.id = org_branding.org_id 
      AND o.owner_id = auth.uid()
    )
  );

CREATE POLICY "Org members can view org branding" ON public.org_branding
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.org_members om 
      WHERE om.org_id = org_branding.org_id 
      AND om.user_id = auth.uid() 
      AND om.status = 'active'
    )
  );

-- Create storage buckets for branding assets
INSERT INTO storage.buckets (id, name, public) 
VALUES ('org-branding', 'org-branding', true)
ON CONFLICT (id) DO NOTHING;

-- Create storage policies
CREATE POLICY "Org members can view branding assets" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'org-branding' AND 
    EXISTS (
      SELECT 1 FROM public.org_members om 
      WHERE om.org_id = (storage.foldername(name))[1]::uuid 
      AND om.user_id = auth.uid() 
      AND om.status = 'active'
    )
  );

CREATE POLICY "Org owners can upload branding assets" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'org-branding' AND 
    EXISTS (
      SELECT 1 FROM public.organizations o 
      WHERE o.id = (storage.foldername(name))[1]::uuid 
      AND o.owner_id = auth.uid()
    )
  );

CREATE POLICY "Org owners can update branding assets" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'org-branding' AND 
    EXISTS (
      SELECT 1 FROM public.organizations o 
      WHERE o.id = (storage.foldername(name))[1]::uuid 
      AND o.owner_id = auth.uid()
    )
  );

-- Create trigger to update updated_at
CREATE OR REPLACE FUNCTION public.update_org_branding_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  NEW.version = OLD.version + 1;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_org_branding_updated_at
  BEFORE UPDATE ON public.org_branding
  FOR EACH ROW
  EXECUTE FUNCTION public.update_org_branding_updated_at();