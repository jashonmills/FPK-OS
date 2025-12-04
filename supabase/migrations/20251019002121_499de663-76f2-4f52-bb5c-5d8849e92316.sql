-- Create partner_resources table
CREATE TABLE IF NOT EXISTS public.partner_resources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  tagline TEXT NOT NULL,
  description TEXT NOT NULL,
  logo_url TEXT NOT NULL,
  website_url TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'General',
  display_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by UUID REFERENCES auth.users(id),
  
  CONSTRAINT valid_website_url CHECK (website_url ~* '^https?://')
);

-- Enable RLS
ALTER TABLE public.partner_resources ENABLE ROW LEVEL SECURITY;

-- Anyone can view active partners (public page)
CREATE POLICY "Anyone can view active partners"
  ON public.partner_resources
  FOR SELECT
  USING (is_active = true);

-- Admins can manage all partners
CREATE POLICY "Admins can manage all partners"
  ON public.partner_resources
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_roles.user_id = auth.uid()
      AND user_roles.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_roles.user_id = auth.uid()
      AND user_roles.role = 'admin'
    )
  );

-- Create index for ordering
CREATE INDEX idx_partner_resources_display_order 
  ON public.partner_resources(display_order, created_at);

-- Create index for category filtering
CREATE INDEX idx_partner_resources_category 
  ON public.partner_resources(category) 
  WHERE is_active = true;

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_partner_resources_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER partner_resources_updated_at
  BEFORE UPDATE ON public.partner_resources
  FOR EACH ROW
  EXECUTE FUNCTION update_partner_resources_updated_at();

-- Create partner-logos storage bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('partner-logos', 'partner-logos', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies
CREATE POLICY "Admins can upload partner logos"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'partner-logos' AND
  EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_roles.user_id = auth.uid()
    AND user_roles.role = 'admin'
  )
);

CREATE POLICY "Admins can update partner logos"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'partner-logos' AND
  EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_roles.user_id = auth.uid()
    AND user_roles.role = 'admin'
  )
);

CREATE POLICY "Admins can delete partner logos"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'partner-logos' AND
  EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_roles.user_id = auth.uid()
    AND user_roles.role = 'admin'
  )
);

CREATE POLICY "Anyone can view partner logos"
ON storage.objects
FOR SELECT
USING (bucket_id = 'partner-logos');

-- Seed data: Add Snugz as first partner
INSERT INTO public.partner_resources (
  name,
  tagline,
  description,
  logo_url,
  website_url,
  category,
  display_order
) VALUES (
  'Snugz',
  'Sensory Earbuds for Over-stimulation',
  'A fantastic tool to help manage auditory sensitivity and focus in noisy environments. We highly recommend them for learners who need to reduce sensory overwhelm and maintain concentration in challenging acoustic settings.',
  'https://www.snugzhq.com/cdn/shop/files/Snugz_Logo_primary.png',
  'https://www.snugzhq.com/',
  'Sensory Tools',
  1
);