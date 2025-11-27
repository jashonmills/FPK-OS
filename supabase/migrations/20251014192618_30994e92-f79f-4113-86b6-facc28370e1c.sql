-- =============================================
-- Phase 5 Sprint 3-4: Multi-Session Memory
-- =============================================

-- 1. Phoenix Memory Fragments Table
-- Stores specific, retrievable memories from past conversations
CREATE TABLE IF NOT EXISTS public.phoenix_memory_fragments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  conversation_id UUID REFERENCES public.phoenix_conversations(id) ON DELETE CASCADE,
  memory_type TEXT NOT NULL CHECK (memory_type IN (
    'commitment',           -- User promised to practice/study something
    'confusion',           -- User was confused about a topic
    'breakthrough',        -- User had an "aha!" moment
    'question',           -- Unresolved question from user
    'preference',         -- User expressed a learning preference
    'goal',              -- User stated a learning goal
    'connection'         -- User made an interesting conceptual connection
  )),
  content TEXT NOT NULL,
  context JSONB DEFAULT '{}'::jsonb, -- Additional metadata about the memory
  relevance_score NUMERIC(3,2) DEFAULT 1.0 CHECK (relevance_score >= 0 AND relevance_score <= 1),
  last_referenced_at TIMESTAMPTZ,
  reference_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expires_at TIMESTAMPTZ -- Optional expiration for time-sensitive memories
);

CREATE INDEX idx_phoenix_memory_user_id ON public.phoenix_memory_fragments(user_id);
CREATE INDEX idx_phoenix_memory_type ON public.phoenix_memory_fragments(memory_type);
CREATE INDEX idx_phoenix_memory_relevance ON public.phoenix_memory_fragments(relevance_score DESC);
CREATE INDEX idx_phoenix_memory_created ON public.phoenix_memory_fragments(created_at DESC);

-- 2. RLS Policies for phoenix_memory_fragments
ALTER TABLE public.phoenix_memory_fragments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own memories"
  ON public.phoenix_memory_fragments
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "System can insert memories"
  ON public.phoenix_memory_fragments
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "System can update memories"
  ON public.phoenix_memory_fragments
  FOR UPDATE
  USING (true);

CREATE POLICY "Admins can view all memories"
  ON public.phoenix_memory_fragments
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- 3. Function to retrieve relevant memories for a user
CREATE OR REPLACE FUNCTION public.get_relevant_memories(
  p_user_id UUID,
  p_limit INTEGER DEFAULT 5,
  p_days_back INTEGER DEFAULT 30
)
RETURNS TABLE(
  id UUID,
  memory_type TEXT,
  content TEXT,
  context JSONB,
  relevance_score NUMERIC,
  created_at TIMESTAMPTZ,
  days_ago INTEGER
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    pmf.id,
    pmf.memory_type,
    pmf.content,
    pmf.context,
    pmf.relevance_score,
    pmf.created_at,
    EXTRACT(DAY FROM (NOW() - pmf.created_at))::INTEGER as days_ago
  FROM phoenix_memory_fragments pmf
  WHERE pmf.user_id = p_user_id
    AND pmf.created_at >= NOW() - (p_days_back || ' days')::INTERVAL
    AND (pmf.expires_at IS NULL OR pmf.expires_at > NOW())
  ORDER BY 
    pmf.relevance_score DESC,
    pmf.created_at DESC
  LIMIT p_limit;
END;
$$;

GRANT EXECUTE ON FUNCTION public.get_relevant_memories(UUID, INTEGER, INTEGER) TO authenticated;

-- 4. Function to update memory reference tracking
CREATE OR REPLACE FUNCTION public.mark_memory_referenced(p_memory_id UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE phoenix_memory_fragments
  SET 
    last_referenced_at = NOW(),
    reference_count = reference_count + 1,
    relevance_score = LEAST(1.0, relevance_score + 0.1) -- Boost relevance when referenced
  WHERE id = p_memory_id;
END;
$$;

GRANT EXECUTE ON FUNCTION public.mark_memory_referenced(UUID) TO authenticated;