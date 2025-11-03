-- Create help_articles table with full-text search
CREATE TABLE public.help_articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  content TEXT NOT NULL,
  search_vector TSVECTOR,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for full-text search
CREATE INDEX idx_help_articles_search ON public.help_articles USING gin(search_vector);

-- Create function to update search vector automatically
CREATE OR REPLACE FUNCTION update_help_article_search_vector()
RETURNS TRIGGER AS $$
BEGIN
  NEW.search_vector := 
    setweight(to_tsvector('english', COALESCE(NEW.title, '')), 'A') ||
    setweight(to_tsvector('english', COALESCE(NEW.content, '')), 'B');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger
CREATE TRIGGER trigger_update_help_article_search_vector
BEFORE INSERT OR UPDATE ON public.help_articles
FOR EACH ROW EXECUTE FUNCTION update_help_article_search_vector();

-- RLS Policies
ALTER TABLE public.help_articles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view help articles"
ON public.help_articles FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Admins can manage help articles"
ON public.help_articles FOR ALL
TO authenticated
USING (has_role(auth.uid(), 'admin'))
WITH CHECK (has_role(auth.uid(), 'admin'));

-- Add onboarding status to profiles
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS has_completed_onboarding BOOLEAN DEFAULT false;

ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS help_preferences JSONB DEFAULT '{"show_contextual_help": true, "completed_tours": []}'::jsonb;

-- Create help_analytics table
CREATE TABLE public.help_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  article_slug TEXT,
  action TEXT,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.help_analytics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own analytics"
ON public.help_analytics FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "System can create analytics"
ON public.help_analytics FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Admins can view all analytics"
ON public.help_analytics FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'admin'));