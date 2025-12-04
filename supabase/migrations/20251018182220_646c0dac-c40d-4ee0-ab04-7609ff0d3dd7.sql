-- Enable pgvector extension for semantic search
CREATE EXTENSION IF NOT EXISTS vector;

-- Create kb_documents table for storing knowledge base documents
CREATE TABLE IF NOT EXISTS public.kb_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  source_name TEXT NOT NULL,
  source_type TEXT NOT NULL CHECK (source_type IN ('academic_database', 'clinical_resource', 'institutional', 'specialized')),
  document_type TEXT NOT NULL CHECK (document_type IN ('research_paper', 'guideline', 'blog_post', 'course_material', 'report', 'article')),
  source_url TEXT,
  publication_date DATE,
  focus_areas TEXT[] DEFAULT '{}',
  metadata JSONB DEFAULT '{}',
  content_hash TEXT UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id)
);

-- Create kb_embeddings table for vector embeddings
CREATE TABLE IF NOT EXISTS public.kb_embeddings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id UUID NOT NULL REFERENCES public.kb_documents(id) ON DELETE CASCADE,
  chunk_index INTEGER NOT NULL,
  chunk_text TEXT NOT NULL,
  embedding vector(1536),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create kb_scraping_jobs table for tracking ingestion jobs
CREATE TABLE IF NOT EXISTS public.kb_scraping_jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_type TEXT NOT NULL CHECK (job_type IN ('academic_search', 'web_scrape', 'api_fetch')),
  source_name TEXT NOT NULL,
  search_queries TEXT[],
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'failed')),
  documents_found INTEGER DEFAULT 0,
  documents_added INTEGER DEFAULT 0,
  error_message TEXT,
  created_by UUID REFERENCES auth.users(id),
  started_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_kb_documents_source ON public.kb_documents(source_name, source_type);
CREATE INDEX IF NOT EXISTS idx_kb_documents_focus_areas ON public.kb_documents USING gin(focus_areas);
CREATE INDEX IF NOT EXISTS idx_kb_documents_content_hash ON public.kb_documents(content_hash);
CREATE INDEX IF NOT EXISTS idx_kb_embeddings_document ON public.kb_embeddings(document_id);
CREATE INDEX IF NOT EXISTS idx_kb_scraping_jobs_status ON public.kb_scraping_jobs(status, created_at);

-- Create vector similarity search index (using ivfflat for cosine similarity)
CREATE INDEX IF NOT EXISTS idx_kb_embeddings_vector ON public.kb_embeddings USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);

-- Create function for semantic search
CREATE OR REPLACE FUNCTION public.search_kb_embeddings(
  query_embedding vector(1536),
  match_threshold float DEFAULT 0.7,
  match_count int DEFAULT 20
)
RETURNS TABLE (
  document_id uuid,
  chunk_text text,
  similarity float,
  chunk_index integer
)
LANGUAGE sql STABLE
AS $$
  SELECT
    kb_embeddings.document_id,
    kb_embeddings.chunk_text,
    1 - (kb_embeddings.embedding <=> query_embedding) AS similarity,
    kb_embeddings.chunk_index
  FROM public.kb_embeddings
  WHERE 1 - (kb_embeddings.embedding <=> query_embedding) > match_threshold
  ORDER BY similarity DESC
  LIMIT match_count;
$$;

-- Enable RLS on all tables
ALTER TABLE public.kb_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.kb_embeddings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.kb_scraping_jobs ENABLE ROW LEVEL SECURITY;

-- RLS Policies for kb_documents
CREATE POLICY "Admins can manage all kb_documents"
  ON public.kb_documents
  FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Authenticated users can view kb_documents"
  ON public.kb_documents
  FOR SELECT
  USING (auth.uid() IS NOT NULL);

-- RLS Policies for kb_embeddings
CREATE POLICY "Admins can manage all kb_embeddings"
  ON public.kb_embeddings
  FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Authenticated users can view kb_embeddings"
  ON public.kb_embeddings
  FOR SELECT
  USING (auth.uid() IS NOT NULL);

-- RLS Policies for kb_scraping_jobs
CREATE POLICY "Admins can manage all kb_scraping_jobs"
  ON public.kb_scraping_jobs
  FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Users can view their own scraping jobs"
  ON public.kb_scraping_jobs
  FOR SELECT
  USING (auth.uid() = created_by OR has_role(auth.uid(), 'admin'::app_role));