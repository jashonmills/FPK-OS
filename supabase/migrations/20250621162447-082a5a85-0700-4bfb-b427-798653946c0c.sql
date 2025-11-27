
-- Create knowledge_embeddings table for vector storage
CREATE TABLE public.knowledge_embeddings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  content TEXT NOT NULL,
  embedding TEXT NOT NULL, -- JSON string of embedding vector
  metadata JSONB DEFAULT '{}',
  user_id UUID REFERENCES auth.users,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create knowledge_cache table for caching retrieved knowledge
CREATE TABLE public.knowledge_cache (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  query_hash TEXT NOT NULL,
  content TEXT NOT NULL,
  source_type TEXT NOT NULL CHECK (source_type IN ('external', 'personal', 'hybrid')),
  metadata JSONB DEFAULT '{}',
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add indexes for performance
CREATE INDEX idx_knowledge_embeddings_user_id ON public.knowledge_embeddings(user_id);
CREATE INDEX idx_knowledge_embeddings_metadata ON public.knowledge_embeddings USING gin(metadata);
CREATE INDEX idx_knowledge_cache_query_hash ON public.knowledge_cache(query_hash);
CREATE INDEX idx_knowledge_cache_expires_at ON public.knowledge_cache(expires_at);
CREATE INDEX idx_knowledge_cache_source_type ON public.knowledge_cache(source_type);

-- Add Row Level Security (RLS)
ALTER TABLE public.knowledge_embeddings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.knowledge_cache ENABLE ROW LEVEL SECURITY;

-- RLS policies for knowledge_embeddings
CREATE POLICY "Users can view their own embeddings" 
  ON public.knowledge_embeddings 
  FOR SELECT 
  USING (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can create embeddings" 
  ON public.knowledge_embeddings 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can update their own embeddings" 
  ON public.knowledge_embeddings 
  FOR UPDATE 
  USING (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can delete their own embeddings" 
  ON public.knowledge_embeddings 
  FOR DELETE 
  USING (auth.uid() = user_id OR user_id IS NULL);

-- RLS policies for knowledge_cache (more permissive for shared knowledge)
CREATE POLICY "Users can view knowledge cache" 
  ON public.knowledge_cache 
  FOR SELECT 
  USING (true);

CREATE POLICY "System can manage knowledge cache" 
  ON public.knowledge_cache 
  FOR ALL 
  USING (true);

-- Add trigger for updating updated_at column
CREATE TRIGGER update_knowledge_embeddings_updated_at
  BEFORE UPDATE ON public.knowledge_embeddings
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
