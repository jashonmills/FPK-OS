-- Create function to search family-specific data embeddings
CREATE OR REPLACE FUNCTION match_family_data(
  query_embedding vector(1536),
  match_threshold float DEFAULT 0.7,
  match_count int DEFAULT 10,
  p_family_id uuid DEFAULT NULL
)
RETURNS TABLE (
  id uuid,
  family_id uuid,
  student_id uuid,
  source_table text,
  source_id uuid,
  chunk_text text,
  metadata jsonb,
  similarity float
)
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT
    fde.id,
    fde.family_id,
    fde.student_id,
    fde.source_table,
    fde.source_id,
    fde.chunk_text,
    fde.metadata,
    1 - (fde.embedding <=> query_embedding) AS similarity
  FROM family_data_embeddings fde
  WHERE 
    (p_family_id IS NULL OR fde.family_id = p_family_id)
    AND 1 - (fde.embedding <=> query_embedding) > match_threshold
  ORDER BY fde.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;

-- Create function to search clinical knowledge base
CREATE OR REPLACE FUNCTION match_kb_chunks(
  query_embedding vector(1536),
  match_threshold float DEFAULT 0.7,
  match_count int DEFAULT 10
)
RETURNS TABLE (
  id uuid,
  kb_id uuid,
  chunk_text text,
  source_name text,
  similarity float
)
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT
    kbc.id,
    kbc.kb_id,
    kbc.chunk_text,
    kb.source_name,
    1 - (kbc.embedding <=> query_embedding) AS similarity
  FROM kb_chunks kbc
  JOIN knowledge_base kb ON kb.id = kbc.kb_id
  WHERE 1 - (kbc.embedding <=> query_embedding) > match_threshold
  ORDER BY kbc.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;