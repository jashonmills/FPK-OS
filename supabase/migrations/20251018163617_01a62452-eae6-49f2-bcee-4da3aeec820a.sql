-- Create blog system tables and infrastructure

-- Blog posts main table
CREATE TABLE public.blog_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  meta_title TEXT NOT NULL,
  meta_description TEXT,
  author_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'scheduled', 'archived')),
  published_at TIMESTAMPTZ,
  scheduled_for TIMESTAMPTZ,
  featured_image_url TEXT,
  featured_image_alt TEXT,
  content TEXT NOT NULL,
  excerpt TEXT,
  focus_keyword TEXT,
  seo_score INTEGER DEFAULT 0 CHECK (seo_score >= 0 AND seo_score <= 100),
  readability_score NUMERIC,
  word_count INTEGER DEFAULT 0,
  read_time_minutes INTEGER DEFAULT 0,
  views_count INTEGER DEFAULT 0,
  likes_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  updated_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

-- Categories for taxonomy
CREATE TABLE public.blog_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  parent_id UUID REFERENCES public.blog_categories(id) ON DELETE CASCADE,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tags for flexible labeling
CREATE TABLE public.blog_tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  usage_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Junction table: posts to categories
CREATE TABLE public.blog_post_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID REFERENCES public.blog_posts(id) ON DELETE CASCADE NOT NULL,
  category_id UUID REFERENCES public.blog_categories(id) ON DELETE CASCADE NOT NULL,
  UNIQUE(post_id, category_id)
);

-- Junction table: posts to tags
CREATE TABLE public.blog_post_tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID REFERENCES public.blog_posts(id) ON DELETE CASCADE NOT NULL,
  tag_id UUID REFERENCES public.blog_tags(id) ON DELETE CASCADE NOT NULL,
  UNIQUE(post_id, tag_id)
);

-- Analytics tracking
CREATE TABLE public.blog_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID REFERENCES public.blog_posts(id) ON DELETE CASCADE NOT NULL,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  views INTEGER DEFAULT 0,
  unique_visitors INTEGER DEFAULT 0,
  avg_time_on_page INTEGER DEFAULT 0,
  bounce_rate NUMERIC,
  referrer_sources JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(post_id, date)
);

-- Author profiles
CREATE TABLE public.blog_authors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  display_name TEXT NOT NULL,
  bio TEXT,
  avatar_url TEXT,
  social_links JSONB DEFAULT '{}'::jsonb,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Internal linking tracking
CREATE TABLE public.blog_internal_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source_post_id UUID REFERENCES public.blog_posts(id) ON DELETE CASCADE NOT NULL,
  target_post_id UUID REFERENCES public.blog_posts(id) ON DELETE CASCADE,
  target_url TEXT,
  link_text TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  CHECK (target_post_id IS NOT NULL OR target_url IS NOT NULL)
);

-- Newsletter subscribers
CREATE TABLE public.blog_subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'unsubscribed', 'bounced')),
  subscribed_at TIMESTAMPTZ DEFAULT NOW(),
  unsubscribed_at TIMESTAMPTZ,
  metadata JSONB DEFAULT '{}'::jsonb
);

-- Enable RLS
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_post_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_post_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_authors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_internal_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_subscribers ENABLE ROW LEVEL SECURITY;

-- RLS Policies for blog_posts
CREATE POLICY "Public can view published posts"
ON public.blog_posts FOR SELECT
USING (status = 'published' AND published_at <= NOW());

CREATE POLICY "Admins can manage all posts"
ON public.blog_posts FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Authors can view their own drafts"
ON public.blog_posts FOR SELECT
USING (author_id = auth.uid());

CREATE POLICY "Authors can create posts"
ON public.blog_posts FOR INSERT
WITH CHECK (
  (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'instructor'::app_role))
  AND author_id = auth.uid()
);

CREATE POLICY "Authors can update their own posts"
ON public.blog_posts FOR UPDATE
USING (author_id = auth.uid())
WITH CHECK (author_id = auth.uid());

-- RLS Policies for categories
CREATE POLICY "Anyone can view active categories"
ON public.blog_categories FOR SELECT
USING (is_active = true);

CREATE POLICY "Admins can manage categories"
ON public.blog_categories FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- RLS Policies for tags
CREATE POLICY "Anyone can view tags"
ON public.blog_tags FOR SELECT
USING (true);

CREATE POLICY "Admins can manage tags"
ON public.blog_tags FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- RLS Policies for junction tables
CREATE POLICY "Junction access mirrors post access"
ON public.blog_post_categories FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.blog_posts
    WHERE id = post_id AND (author_id = auth.uid() OR has_role(auth.uid(), 'admin'::app_role))
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.blog_posts
    WHERE id = post_id AND (author_id = auth.uid() OR has_role(auth.uid(), 'admin'::app_role))
  )
);

CREATE POLICY "Tag junction access mirrors post access"
ON public.blog_post_tags FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.blog_posts
    WHERE id = post_id AND (author_id = auth.uid() OR has_role(auth.uid(), 'admin'::app_role))
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.blog_posts
    WHERE id = post_id AND (author_id = auth.uid() OR has_role(auth.uid(), 'admin'::app_role))
  )
);

-- RLS Policies for analytics
CREATE POLICY "Admins can view analytics"
ON public.blog_analytics FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "System can track analytics"
ON public.blog_analytics FOR INSERT
WITH CHECK (true);

-- RLS Policies for authors
CREATE POLICY "Anyone can view active authors"
ON public.blog_authors FOR SELECT
USING (is_active = true);

CREATE POLICY "Users can manage their author profile"
ON public.blog_authors FOR ALL
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Admins can manage all author profiles"
ON public.blog_authors FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- RLS Policies for subscribers
CREATE POLICY "Public can subscribe"
ON public.blog_subscribers FOR INSERT
WITH CHECK (true);

CREATE POLICY "Admins can manage subscribers"
ON public.blog_subscribers FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

-- Triggers and Functions

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_blog_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

CREATE TRIGGER blog_posts_updated_at
BEFORE UPDATE ON public.blog_posts
FOR EACH ROW EXECUTE FUNCTION update_blog_updated_at();

CREATE TRIGGER blog_authors_updated_at
BEFORE UPDATE ON public.blog_authors
FOR EACH ROW EXECUTE FUNCTION update_blog_updated_at();

-- Auto-generate slug from title
CREATE OR REPLACE FUNCTION generate_slug_from_title()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  IF NEW.slug IS NULL OR NEW.slug = '' THEN
    NEW.slug := LOWER(REGEXP_REPLACE(
      REGEXP_REPLACE(NEW.title, '[^a-zA-Z0-9\s-]', '', 'g'),
      '\s+', '-', 'g'
    ));
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER auto_generate_slug
BEFORE INSERT ON public.blog_posts
FOR EACH ROW EXECUTE FUNCTION generate_slug_from_title();

-- Auto-calculate word count and read time
CREATE OR REPLACE FUNCTION calculate_post_metrics()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.word_count := COALESCE(array_length(regexp_split_to_array(NEW.content, '\s+'), 1), 0);
  NEW.read_time_minutes := GREATEST(1, ROUND(NEW.word_count::NUMERIC / 200));
  RETURN NEW;
END;
$$;

CREATE TRIGGER calculate_metrics
BEFORE INSERT OR UPDATE OF content ON public.blog_posts
FOR EACH ROW EXECUTE FUNCTION calculate_post_metrics();

-- Increment tag usage count
CREATE OR REPLACE FUNCTION increment_tag_usage()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.blog_tags SET usage_count = usage_count + 1 WHERE id = NEW.tag_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.blog_tags SET usage_count = GREATEST(0, usage_count - 1) WHERE id = OLD.tag_id;
  END IF;
  RETURN COALESCE(NEW, OLD);
END;
$$;

CREATE TRIGGER update_tag_usage
AFTER INSERT OR DELETE ON public.blog_post_tags
FOR EACH ROW EXECUTE FUNCTION increment_tag_usage();

-- Function to auto-publish scheduled posts
CREATE OR REPLACE FUNCTION auto_publish_scheduled_posts()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.blog_posts
  SET status = 'published', published_at = NOW()
  WHERE status = 'scheduled' AND scheduled_for <= NOW();
END;
$$;

-- Function to get related posts
CREATE OR REPLACE FUNCTION get_related_posts(
  p_post_id UUID,
  p_limit INTEGER DEFAULT 3
)
RETURNS TABLE(
  id UUID,
  title TEXT,
  slug TEXT,
  excerpt TEXT,
  featured_image_url TEXT,
  published_at TIMESTAMPTZ
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT DISTINCT bp.id, bp.title, bp.slug, bp.excerpt, bp.featured_image_url, bp.published_at
  FROM public.blog_posts bp
  INNER JOIN public.blog_post_tags bpt1 ON bp.id = bpt1.post_id
  WHERE bp.status = 'published'
    AND bp.id != p_post_id
    AND EXISTS (
      SELECT 1 FROM public.blog_post_tags bpt2
      WHERE bpt2.post_id = p_post_id AND bpt2.tag_id = bpt1.tag_id
    )
  ORDER BY bp.published_at DESC
  LIMIT p_limit;
END;
$$;

-- Seed initial categories
INSERT INTO public.blog_categories (name, slug, description, display_order) VALUES
('IEP Advocacy & Special Education', 'iep-advocacy', 'Understanding IEPs, legal rights, and parent advocacy', 1),
('Neurodiversity & Learning', 'neurodiversity', 'ADHD, Autism, Dyslexia, and understanding different learning styles', 2),
('Executive Functioning', 'executive-functioning', 'Planning, organization, time management, and self-regulation', 3),
('Study Strategies', 'study-strategies', 'Active learning, note-taking, test prep, and memory techniques', 4),
('AI-Powered Learning', 'ai-learning', 'Using AI tools and EdTech for personalized education', 5),
('Parent & Educator Resources', 'parent-educator-resources', 'Tips and tools for supporting neurodiverse learners', 6),
('Data Tracking', 'data-tracking', 'Progress monitoring and evidence-based decision making', 7),
('Self-Directed Learning', 'self-directed-learning', 'Student empowerment and independent learning skills', 8),
('Assistive Technology', 'assistive-technology', 'Tools and apps that support diverse learners', 9),
('Success Stories', 'success-stories', 'Real-world examples and case studies', 10),
('Research & Evidence', 'research-evidence', 'Evidence-based practices and latest research', 11),
('Wellness & Development', 'wellness', 'Whole-child development and emotional well-being', 12);

-- Seed initial tags
INSERT INTO public.blog_tags (name, slug) VALUES
('ADHD', 'adhd'),
('Autism', 'autism'),
('Dyslexia', 'dyslexia'),
('Executive Function', 'executive-function'),
('IEP', 'iep'),
('Study Skills', 'study-skills'),
('Homework', 'homework'),
('Test Anxiety', 'test-anxiety'),
('Time Management', 'time-management'),
('Parent Tips', 'parent-tips'),
('Teacher Resources', 'teacher-resources'),
('Self-Advocacy', 'self-advocacy'),
('Accommodations', 'accommodations'),
('Technology', 'technology'),
('Apps', 'apps'),
('AI Learning', 'ai-learning'),
('Accessibility', 'accessibility'),
('Sleep', 'sleep'),
('Emotional Regulation', 'emotional-regulation'),
('Mindfulness', 'mindfulness'),
('Motivation', 'motivation'),
('Memory', 'memory'),
('Reading', 'reading'),
('Writing', 'writing'),
('Math', 'math'),
('Organization', 'organization'),
('Planning', 'planning'),
('Focus', 'focus'),
('Data', 'data'),
('Progress Monitoring', 'progress-monitoring');