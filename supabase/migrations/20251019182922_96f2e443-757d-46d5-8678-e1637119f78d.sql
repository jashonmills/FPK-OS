-- Fix search_path for match_kb_documents function
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
SECURITY DEFINER
SET search_path = public
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