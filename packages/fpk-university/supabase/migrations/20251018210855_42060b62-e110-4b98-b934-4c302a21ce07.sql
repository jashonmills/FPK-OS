-- Add missing metadata column to kb_embeddings table
ALTER TABLE public.kb_embeddings 
ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}';