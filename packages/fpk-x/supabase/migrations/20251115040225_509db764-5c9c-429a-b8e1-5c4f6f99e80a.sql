-- Fix get_client_goals function overloading issue
-- Drop all versions and recreate with a single unified version
DROP FUNCTION IF EXISTS public.get_client_goals(UUID);
DROP FUNCTION IF EXISTS public.get_client_goals(UUID, BOOLEAN);

CREATE OR REPLACE FUNCTION public.get_client_goals(
  p_client_id UUID,
  p_active_only BOOLEAN DEFAULT true
)
RETURNS TABLE (
  goal_id UUID,
  goal_title TEXT,
  goal_type TEXT,
  target_value NUMERIC,
  current_value NUMERIC,
  progress_percentage NUMERIC,
  is_active BOOLEAN,
  created_at TIMESTAMPTZ
)
LANGUAGE sql
SECURITY DEFINER
SET search_path TO public
AS $$
  SELECT 
    g.id as goal_id,
    g.goal_title,
    g.goal_type,
    g.target_value,
    g.current_value,
    CASE 
      WHEN g.target_value > 0 THEN ROUND((g.current_value / g.target_value) * 100, 2)
      ELSE 0
    END as progress_percentage,
    g.is_active,
    g.created_at
  FROM goals g
  WHERE g.client_id = p_client_id
    AND (NOT p_active_only OR g.is_active = true)
  ORDER BY g.created_at DESC;
$$;

-- Fix get_ai_extracted_goals ambiguous column reference
-- Since ai_extracted_goals table doesn't exist, we'll create a function that returns empty for now
DROP FUNCTION IF EXISTS public.get_ai_extracted_goals(UUID);

CREATE OR REPLACE FUNCTION public.get_ai_extracted_goals(
  p_client_id UUID
)
RETURNS TABLE (
  goal_id UUID,
  goal_title TEXT,
  goal_type TEXT,
  target_value NUMERIC,
  current_value NUMERIC,
  progress_percentage NUMERIC,
  source_document TEXT,
  extracted_at TIMESTAMPTZ
)
LANGUAGE sql
SECURITY DEFINER
SET search_path TO public
AS $$
  -- Return goals extracted from bedrock metrics
  SELECT 
    gen_random_uuid() as goal_id,
    bm.metric_name as goal_title,
    bm.metric_type as goal_type,
    bm.target_value,
    bm.metric_value as current_value,
    CASE 
      WHEN bm.target_value > 0 THEN ROUND((bm.metric_value / bm.target_value) * 100, 2)
      ELSE 0
    END as progress_percentage,
    bd.file_name as source_document,
    bm.created_at as extracted_at
  FROM bedrock_metrics bm
  INNER JOIN bedrock_documents bd ON bm.document_id = bd.id
  WHERE bm.client_id = p_client_id
    AND bm.target_value IS NOT NULL
  ORDER BY bm.created_at DESC;
$$;