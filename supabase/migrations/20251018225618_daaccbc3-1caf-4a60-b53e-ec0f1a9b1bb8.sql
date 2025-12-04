-- Create blog_media_assets table
CREATE TABLE IF NOT EXISTS public.blog_media_assets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  storage_path TEXT NOT NULL UNIQUE,
  title TEXT,
  alt_text TEXT,
  description TEXT,
  asset_type TEXT DEFAULT 'general',
  file_size BIGINT,
  mime_type TEXT,
  dimensions JSONB,
  uploaded_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create blog_media_usage table
CREATE TABLE IF NOT EXISTS public.blog_media_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  media_id UUID REFERENCES public.blog_media_assets(id) ON DELETE CASCADE,
  usage_type TEXT NOT NULL,
  reference_id UUID NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(media_id, usage_type, reference_id)
);

-- Enable RLS
ALTER TABLE public.blog_media_assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_media_usage ENABLE ROW LEVEL SECURITY;

-- RLS Policies for blog_media_assets
CREATE POLICY "Anyone can view media assets"
  ON public.blog_media_assets FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can insert media assets"
  ON public.blog_media_assets FOR INSERT
  WITH CHECK (auth.uid() = uploaded_by);

CREATE POLICY "Users can update their own media assets"
  ON public.blog_media_assets FOR UPDATE
  USING (auth.uid() = uploaded_by OR has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete media assets"
  ON public.blog_media_assets FOR DELETE
  USING (has_role(auth.uid(), 'admin'::app_role));

-- RLS Policies for blog_media_usage
CREATE POLICY "Anyone can view media usage"
  ON public.blog_media_usage FOR SELECT
  USING (true);

CREATE POLICY "System can manage media usage"
  ON public.blog_media_usage FOR ALL
  USING (true)
  WITH CHECK (true);

-- Create indexes for better performance
CREATE INDEX idx_media_assets_storage_path ON public.blog_media_assets(storage_path);
CREATE INDEX idx_media_usage_media_id ON public.blog_media_usage(media_id);
CREATE INDEX idx_media_usage_reference ON public.blog_media_usage(reference_id, usage_type);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_blog_media_assets_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_blog_media_assets_updated_at
  BEFORE UPDATE ON public.blog_media_assets
  FOR EACH ROW
  EXECUTE FUNCTION update_blog_media_assets_updated_at();