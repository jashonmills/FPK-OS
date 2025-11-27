-- Phase 1: AI Knowledge Sources Table
CREATE TABLE public.ai_knowledge_sources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  url TEXT UNIQUE NOT NULL,
  source_name TEXT NOT NULL,
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  category_id UUID REFERENCES public.blog_categories(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.ai_knowledge_sources ENABLE ROW LEVEL SECURITY;

-- Admin-only access policy
CREATE POLICY "Admins can manage AI knowledge sources"
ON public.ai_knowledge_sources
FOR ALL
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Index for category filtering
CREATE INDEX idx_ai_knowledge_sources_category ON public.ai_knowledge_sources(category_id) WHERE is_active = true;

-- Updated_at trigger
CREATE TRIGGER update_ai_knowledge_sources_updated_at
BEFORE UPDATE ON public.ai_knowledge_sources
FOR EACH ROW
EXECUTE FUNCTION update_blog_updated_at();

-- Phase 2: AI Knowledge Cache Table
CREATE TABLE public.ai_knowledge_cache (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source_url TEXT UNIQUE NOT NULL,
  cleaned_text_content TEXT NOT NULL,
  last_scraped_at TIMESTAMPTZ DEFAULT NOW(),
  etag TEXT,
  content_hash TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.ai_knowledge_cache ENABLE ROW LEVEL SECURITY;

-- System-only access
CREATE POLICY "System can manage knowledge cache"
ON public.ai_knowledge_cache
FOR ALL
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Indexes
CREATE INDEX idx_ai_knowledge_cache_url ON public.ai_knowledge_cache(source_url);
CREATE INDEX idx_ai_knowledge_cache_scraped_at ON public.ai_knowledge_cache(last_scraped_at);

-- Phase 3: AI Generation History Table
CREATE TABLE public.ai_generation_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  post_id UUID REFERENCES public.blog_posts(id) ON DELETE CASCADE,
  generation_mode TEXT NOT NULL CHECK (generation_mode IN ('outline', 'draft')),
  topic TEXT NOT NULL,
  focus_keyword TEXT,
  category_id UUID REFERENCES public.blog_categories(id),
  sources_used JSONB DEFAULT '[]',
  ai_model_used TEXT DEFAULT 'google/gemini-2.5-flash',
  prompt_tokens INTEGER,
  completion_tokens INTEGER,
  total_duration_ms INTEGER,
  status TEXT DEFAULT 'in_progress' CHECK (status IN ('in_progress', 'completed', 'failed', 'cancelled')),
  error_message TEXT,
  outline_json JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

-- Enable RLS
ALTER TABLE public.ai_generation_history ENABLE ROW LEVEL SECURITY;

-- Users can view their own history
CREATE POLICY "Users can view their generation history"
ON public.ai_generation_history
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Admins can view all
CREATE POLICY "Admins can view all generation history"
ON public.ai_generation_history
FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

-- System can insert/update
CREATE POLICY "System can manage generation history"
ON public.ai_generation_history
FOR ALL
TO authenticated
USING (auth.uid() = user_id OR has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (auth.uid() = user_id OR has_role(auth.uid(), 'admin'::app_role));

-- Indexes
CREATE INDEX idx_ai_generation_user ON public.ai_generation_history(user_id, created_at DESC);
CREATE INDEX idx_ai_generation_post ON public.ai_generation_history(post_id);