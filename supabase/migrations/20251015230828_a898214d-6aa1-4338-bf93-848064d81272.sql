-- Create article authors table
CREATE TABLE public.article_authors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  bio TEXT,
  credentials TEXT,
  photo_url TEXT,
  linkedin_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create article categories table
CREATE TABLE public.article_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  parent_category_id UUID REFERENCES article_categories(id) ON DELETE SET NULL,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create public articles table
CREATE TABLE public.public_articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  meta_title TEXT,
  meta_description TEXT,
  description TEXT,
  content TEXT NOT NULL,
  excerpt TEXT,
  featured_image_url TEXT,
  author_id UUID REFERENCES article_authors(id) ON DELETE SET NULL,
  category_id UUID REFERENCES article_categories(id) ON DELETE SET NULL,
  pillar_page_id UUID REFERENCES public_articles(id) ON DELETE SET NULL,
  schema_type TEXT DEFAULT 'Article',
  keywords TEXT[],
  is_published BOOLEAN DEFAULT false,
  published_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ DEFAULT now(),
  view_count INTEGER DEFAULT 0,
  reading_time_minutes INTEGER
);

-- Create article relationships junction table
CREATE TABLE public.article_relationships (
  article_id UUID REFERENCES public_articles(id) ON DELETE CASCADE,
  related_article_id UUID REFERENCES public_articles(id) ON DELETE CASCADE,
  relationship_type TEXT DEFAULT 'related',
  created_at TIMESTAMPTZ DEFAULT now(),
  PRIMARY KEY (article_id, related_article_id)
);

-- Enable Row Level Security
ALTER TABLE public.article_authors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.article_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.public_articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.article_relationships ENABLE ROW LEVEL SECURITY;

-- RLS Policies for article_authors
CREATE POLICY "Anyone can view article authors"
  ON public.article_authors FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage article authors"
  ON public.article_authors FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- RLS Policies for article_categories
CREATE POLICY "Anyone can view article categories"
  ON public.article_categories FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage article categories"
  ON public.article_categories FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- RLS Policies for public_articles
CREATE POLICY "Anyone can view published articles"
  ON public.public_articles FOR SELECT
  USING (is_published = true OR has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can manage articles"
  ON public.public_articles FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- RLS Policies for article_relationships
CREATE POLICY "Anyone can view article relationships"
  ON public.article_relationships FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage article relationships"
  ON public.article_relationships FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Create indexes for performance
CREATE INDEX idx_public_articles_slug ON public.public_articles(slug);
CREATE INDEX idx_public_articles_published ON public.public_articles(is_published, published_at DESC);
CREATE INDEX idx_public_articles_category ON public.public_articles(category_id);
CREATE INDEX idx_public_articles_author ON public.public_articles(author_id);
CREATE INDEX idx_article_categories_slug ON public.article_categories(slug);
CREATE INDEX idx_article_authors_slug ON public.article_authors(slug);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_article_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_public_articles_updated_at
  BEFORE UPDATE ON public.public_articles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_article_updated_at();

CREATE TRIGGER update_article_authors_updated_at
  BEFORE UPDATE ON public.article_authors
  FOR EACH ROW
  EXECUTE FUNCTION public.update_article_updated_at();

CREATE TRIGGER update_article_categories_updated_at
  BEFORE UPDATE ON public.article_categories
  FOR EACH ROW
  EXECUTE FUNCTION public.update_article_updated_at();