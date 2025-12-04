-- Create vector search function for knowledge base RAG
CREATE OR REPLACE FUNCTION match_kb_documents(
  query_embedding vector(1536),
  match_threshold float,
  match_count int
)
RETURNS TABLE (
  id uuid,
  chunk_text text,
  similarity float,
  source_name text,
  document_type text,
  publication_date date
) 
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    ke.id,
    ke.chunk_text,
    1 - (ke.embedding <=> query_embedding) as similarity,
    kd.source_name,
    kd.document_type,
    kd.publication_date
  FROM kb_embeddings ke
  JOIN kb_documents kd ON ke.document_id = kd.id
  WHERE 1 - (ke.embedding <=> query_embedding) > match_threshold
  ORDER BY ke.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;

-- Add RAG feature flag to phoenix_feature_flags
INSERT INTO phoenix_feature_flags (feature_name, description, is_enabled, configuration)
VALUES (
  'rag_knowledge_base',
  'Retrieval Augmented Generation using institutional knowledge base for evidence-based responses',
  true,
  jsonb_build_object(
    'match_threshold', 0.78,
    'max_results', 5,
    'include_metadata', true,
    'cache_results', false
  )
)
ON CONFLICT (feature_name) DO UPDATE
SET 
  description = EXCLUDED.description,
  is_enabled = EXCLUDED.is_enabled,
  configuration = EXCLUDED.configuration,
  updated_at = NOW();