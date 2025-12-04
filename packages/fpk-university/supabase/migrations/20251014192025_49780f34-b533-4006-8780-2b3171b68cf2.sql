-- =============================================
-- Phase 5 Sprint 1-2: Context Persistence + Advanced Metrics
-- =============================================

-- 1. Phoenix User Context Table
-- Stores extracted user preferences, learning patterns, and context
CREATE TABLE IF NOT EXISTS public.phoenix_user_context (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  context_type TEXT NOT NULL CHECK (context_type IN (
    'learning_style',
    'preferred_persona',
    'preferred_topics',
    'learning_pace',
    'interaction_patterns',
    'accessibility_needs'
  )),
  context_data JSONB NOT NULL DEFAULT '{}'::jsonb,
  confidence_score NUMERIC(3,2) DEFAULT 0.5 CHECK (confidence_score >= 0 AND confidence_score <= 1),
  extracted_from_sessions INTEGER DEFAULT 1,
  last_observed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, context_type)
);

CREATE INDEX idx_phoenix_user_context_user_id ON public.phoenix_user_context(user_id);
CREATE INDEX idx_phoenix_user_context_type ON public.phoenix_user_context(context_type);

-- 2. Phoenix Learning Outcomes Table
-- Tracks significant learning milestones and achievements
CREATE TABLE IF NOT EXISTS public.phoenix_learning_outcomes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  conversation_id UUID REFERENCES public.phoenix_conversations(id) ON DELETE CASCADE,
  outcome_type TEXT NOT NULL CHECK (outcome_type IN (
    'concept_mastered',
    'breakthrough_moment',
    'struggle_identified',
    'goal_set',
    'goal_achieved',
    'skill_demonstrated'
  )),
  topic TEXT NOT NULL,
  description TEXT,
  evidence JSONB DEFAULT '{}'::jsonb,
  mastery_level NUMERIC(3,2) DEFAULT 0.5 CHECK (mastery_level >= 0 AND mastery_level <= 1),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_phoenix_learning_outcomes_user_id ON public.phoenix_learning_outcomes(user_id);
CREATE INDEX idx_phoenix_learning_outcomes_topic ON public.phoenix_learning_outcomes(topic);
CREATE INDEX idx_phoenix_learning_outcomes_type ON public.phoenix_learning_outcomes(outcome_type);

-- 3. RLS Policies for phoenix_user_context
ALTER TABLE public.phoenix_user_context ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own context"
  ON public.phoenix_user_context
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "System can insert context"
  ON public.phoenix_user_context
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "System can update context"
  ON public.phoenix_user_context
  FOR UPDATE
  USING (true);

CREATE POLICY "Admins can view all context"
  ON public.phoenix_user_context
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- 4. RLS Policies for phoenix_learning_outcomes
ALTER TABLE public.phoenix_learning_outcomes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own outcomes"
  ON public.phoenix_learning_outcomes
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "System can insert outcomes"
  ON public.phoenix_learning_outcomes
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Admins can view all outcomes"
  ON public.phoenix_learning_outcomes
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- 5. Trigger for updated_at on phoenix_user_context
CREATE OR REPLACE FUNCTION update_phoenix_context_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_phoenix_context_updated_at
  BEFORE UPDATE ON public.phoenix_user_context
  FOR EACH ROW
  EXECUTE FUNCTION update_phoenix_context_updated_at();

-- 6. Enhanced Phoenix Analytics Function
DROP FUNCTION IF EXISTS public.get_phoenix_analytics(text);

CREATE OR REPLACE FUNCTION public.get_phoenix_analytics(p_user_id text DEFAULT NULL)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  result jsonb;
  user_uuid uuid;
BEGIN
  IF p_user_id IS NOT NULL THEN
    user_uuid := p_user_id::uuid;
  END IF;

  SELECT jsonb_build_object(
    'totalSessions', (
      SELECT COUNT(DISTINCT pc.id)
      FROM phoenix_conversations pc
      WHERE (p_user_id IS NULL OR pc.user_id = user_uuid)
    ),
    'totalInteractions', (
      SELECT COUNT(*)
      FROM phoenix_messages pm
      JOIN phoenix_conversations pc ON pc.id = pm.conversation_id
      WHERE (p_user_id IS NULL OR pc.user_id = user_uuid)
    ),
    'avgTurnsPerSession', (
      SELECT COALESCE(AVG(turn_count), 0)
      FROM (
        SELECT COUNT(*) as turn_count
        FROM phoenix_messages pm
        JOIN phoenix_conversations pc ON pm.conversation_id = pc.id
        WHERE (p_user_id IS NULL OR pc.user_id = user_uuid)
        GROUP BY pm.conversation_id
      ) subq
    ),
    'intentDistribution', (
      SELECT jsonb_agg(jsonb_build_object('intent', intent, 'count', count))
      FROM (
        SELECT pm.intent::text as intent, COUNT(*) as count
        FROM phoenix_messages pm
        JOIN phoenix_conversations pc ON pm.conversation_id = pc.id
        WHERE pm.intent IS NOT NULL
          AND (p_user_id IS NULL OR pc.user_id = user_uuid)
        GROUP BY pm.intent
        ORDER BY count DESC
      ) intents
    ),
    'personaUsage', (
      SELECT jsonb_agg(jsonb_build_object('persona', persona, 'count', count))
      FROM (
        SELECT pm.persona::text as persona, COUNT(*) as count
        FROM phoenix_messages pm
        JOIN phoenix_conversations pc ON pm.conversation_id = pc.id
        WHERE pm.persona IN ('BETTY', 'AL', 'NITE_OWL')
          AND (p_user_id IS NULL OR pc.user_id = user_uuid)
        GROUP BY pm.persona
        ORDER BY count DESC
      ) personas
    ),
    'engagementOverTime', (
      SELECT jsonb_agg(jsonb_build_object('date', date, 'sessions', sessions))
      FROM (
        SELECT DATE(pc.created_at) as date, COUNT(DISTINCT pc.id) as sessions
        FROM phoenix_conversations pc
        WHERE pc.created_at >= NOW() - INTERVAL '30 days'
          AND (p_user_id IS NULL OR pc.user_id = user_uuid)
        GROUP BY DATE(pc.created_at)
        ORDER BY date DESC
      ) engagement
    ),
    'governorActivity', (
      SELECT jsonb_agg(jsonb_build_object(
        'timestamp', pgl.created_at,
        'reason', pgl.reason,
        'conversation_id', pgl.conversation_id
      ))
      FROM (
        SELECT pgl.created_at, pgl.reason, pgl.conversation_id
        FROM phoenix_governor_logs pgl
        JOIN phoenix_conversations pc ON pgl.conversation_id = pc.session_id
        WHERE (p_user_id IS NULL OR pc.user_id = user_uuid)
        ORDER BY pgl.created_at DESC
        LIMIT 50
      ) pgl
    ),
    -- NEW: Advanced Metrics
    'learningVelocity', (
      SELECT jsonb_build_object(
        'topicsPerWeek', COALESCE(COUNT(DISTINCT topic) / NULLIF(EXTRACT(EPOCH FROM (MAX(created_at) - MIN(created_at))) / 604800, 0), 0),
        'totalTopics', COUNT(DISTINCT topic),
        'timeSpan', EXTRACT(EPOCH FROM (MAX(created_at) - MIN(created_at))) / 86400
      )
      FROM phoenix_learning_outcomes plo
      WHERE (p_user_id IS NULL OR plo.user_id = user_uuid)
        AND plo.created_at >= NOW() - INTERVAL '30 days'
    ),
    'engagementQuality', (
      SELECT jsonb_build_object(
        'avgTurnsPerSession', COALESCE(AVG(turn_count), 0),
        'avgSessionDuration', COALESCE(AVG(duration_minutes), 0),
        'completionRate', COALESCE(AVG(CASE WHEN turn_count >= 5 THEN 1.0 ELSE 0.0 END) * 100, 0)
      )
      FROM (
        SELECT 
          pm.conversation_id,
          COUNT(*) as turn_count,
          EXTRACT(EPOCH FROM (MAX(pm.created_at) - MIN(pm.created_at))) / 60 as duration_minutes
        FROM phoenix_messages pm
        JOIN phoenix_conversations pc ON pm.conversation_id = pc.id
        WHERE (p_user_id IS NULL OR pc.user_id = user_uuid)
          AND pc.created_at >= NOW() - INTERVAL '30 days'
        GROUP BY pm.conversation_id
      ) session_stats
    ),
    'personaEffectiveness', (
      SELECT jsonb_agg(jsonb_build_object(
        'persona', persona,
        'avgTurns', avg_turns,
        'engagementScore', engagement_score
      ))
      FROM (
        SELECT 
          pm.persona::text as persona,
          AVG(turn_count) as avg_turns,
          ROUND((AVG(turn_count) / 10.0 * 100)::numeric, 1) as engagement_score
        FROM phoenix_messages pm
        JOIN (
          SELECT conversation_id, COUNT(*) as turn_count
          FROM phoenix_messages
          GROUP BY conversation_id
        ) conv_stats ON pm.conversation_id = conv_stats.conversation_id
        JOIN phoenix_conversations pc ON pm.conversation_id = pc.id
        WHERE pm.persona IN ('BETTY', 'AL', 'NITE_OWL')
          AND (p_user_id IS NULL OR pc.user_id = user_uuid)
        GROUP BY pm.persona
      ) persona_stats
    ),
    'topicMastery', (
      SELECT jsonb_agg(jsonb_build_object(
        'topic', topic,
        'masteryLevel', mastery_level,
        'outcomesCount', outcomes_count
      ))
      FROM (
        SELECT 
          topic,
          ROUND(AVG(mastery_level)::numeric, 2) as mastery_level,
          COUNT(*) as outcomes_count
        FROM phoenix_learning_outcomes plo
        WHERE (p_user_id IS NULL OR plo.user_id = user_uuid)
        GROUP BY topic
        ORDER BY mastery_level DESC, outcomes_count DESC
        LIMIT 10
      ) topic_stats
    ),
    'contextAwareness', (
      SELECT jsonb_agg(jsonb_build_object(
        'contextType', context_type,
        'confidence', confidence_score,
        'lastUpdated', last_observed_at
      ))
      FROM phoenix_user_context puc
      WHERE (p_user_id IS NULL OR puc.user_id = user_uuid)
      ORDER BY confidence_score DESC
    )
  ) INTO result;

  RETURN COALESCE(result, '{}'::jsonb);
END;
$$;

GRANT EXECUTE ON FUNCTION public.get_phoenix_analytics(text) TO authenticated;