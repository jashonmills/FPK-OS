-- Fix GROUP BY error in get_student_knowledge_pack
DROP FUNCTION IF EXISTS public.get_student_knowledge_pack(uuid);

CREATE OR REPLACE FUNCTION public.get_student_knowledge_pack(p_user_id uuid)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  v_learning_style jsonb;
  v_preferred_subjects text[];
  v_learning_goals jsonb;
  v_recent_progress jsonb;
  v_common_misconceptions jsonb;
  v_interaction_patterns jsonb;
  v_persona_preferences jsonb;
  v_recent_struggles jsonb;
  v_knowledge_gaps jsonb;
  v_successful_strategies jsonb;
BEGIN
  -- 1. LEARNING STYLE & PREFERENCES
  SELECT jsonb_build_object(
    'learning_styles', COALESCE(learning_styles, ARRAY[]::text[]),
    'ai_interaction_style', ai_interaction_style,
    'ai_voice_enabled', ai_voice_enabled
  )
  INTO v_learning_style
  FROM profiles
  WHERE id = p_user_id;

  -- 2. PREFERRED SUBJECTS
  SELECT array_agg(DISTINCT topic)
  INTO v_preferred_subjects
  FROM (
    SELECT metadata->>'topic' as topic
    FROM phoenix_conversations
    WHERE user_id = p_user_id
    AND metadata->>'topic' IS NOT NULL
    ORDER BY created_at DESC
    LIMIT 10
  ) recent_topics;

  -- 3. LEARNING GOALS - Fixed: use subquery for ORDER BY
  SELECT jsonb_agg(goal_obj)
  INTO v_learning_goals
  FROM (
    SELECT jsonb_build_object(
      'goal', title,
      'progress', progress,
      'deadline', target_date
    ) as goal_obj
    FROM goals
    WHERE user_id = p_user_id
    AND status = 'active'
    ORDER BY created_at DESC
    LIMIT 5
  ) ordered_goals;

  -- 4. RECENT PROGRESS
  SELECT jsonb_build_object(
    'conversations_count', COUNT(*),
    'avg_satisfaction', AVG(COALESCE((feedback->>'rating')::int, 0)),
    'topics_covered', COUNT(DISTINCT metadata->>'topic')
  )
  INTO v_recent_progress
  FROM phoenix_conversations
  WHERE user_id = p_user_id
  AND created_at >= NOW() - INTERVAL '7 days';

  -- 5. COMMON MISCONCEPTIONS
  SELECT jsonb_agg(
    jsonb_build_object(
      'topic', metadata->>'topic',
      'misconception', reason,
      'frequency', COUNT(*)
    )
  )
  INTO v_common_misconceptions
  FROM phoenix_governor_logs
  JOIN phoenix_conversations ON phoenix_conversations.session_id = phoenix_governor_logs.conversation_id
  WHERE phoenix_conversations.user_id = p_user_id
  AND blocked = true
  AND reason LIKE '%misconception%'
  GROUP BY metadata->>'topic', reason
  ORDER BY COUNT(*) DESC
  LIMIT 5;

  -- 6. INTERACTION PATTERNS
  SELECT jsonb_build_object(
    'avg_session_length', AVG(EXTRACT(EPOCH FROM (updated_at - created_at))),
    'preferred_time_of_day', MODE() WITHIN GROUP (ORDER BY EXTRACT(HOUR FROM created_at)),
    'total_messages', SUM((metadata->>'message_count')::int)
  )
  INTO v_interaction_patterns
  FROM phoenix_conversations
  WHERE user_id = p_user_id;

  -- 7. PERSONA PREFERENCES
  SELECT jsonb_build_object(
    'betty_interactions', COUNT(*) FILTER (WHERE active_persona = 'betty'),
    'al_interactions', COUNT(*) FILTER (WHERE active_persona = 'al'),
    'nite_owl_interactions', COUNT(*) FILTER (WHERE active_persona = 'nite_owl')
  )
  INTO v_persona_preferences
  FROM phoenix_conversations
  WHERE user_id = p_user_id;

  -- 8. RECENT STRUGGLES
  SELECT jsonb_agg(
    jsonb_build_object(
      'topic', pgl.metadata->>'topic',
      'reason', pgl.reason,
      'severity', pgl.severity,
      'occurred_at', pgl.created_at
    ) ORDER BY pgl.created_at DESC
  )
  INTO v_recent_struggles
  FROM phoenix_governor_logs pgl
  JOIN phoenix_conversations pc ON pc.session_id = pgl.conversation_id
  WHERE pc.user_id = p_user_id
  AND pgl.blocked = true
  AND pgl.created_at >= NOW() - INTERVAL '7 days'
  LIMIT 3;

  -- 9. KNOWLEDGE GAPS
  SELECT jsonb_agg(
    jsonb_build_object(
      'topic', topic,
      'struggle_count', struggle_count
    )
  )
  INTO v_knowledge_gaps
  FROM (
    SELECT 
      metadata->>'topic' as topic,
      COUNT(*) as struggle_count
    FROM phoenix_governor_logs
    JOIN phoenix_conversations ON phoenix_conversations.session_id = phoenix_governor_logs.conversation_id
    WHERE phoenix_conversations.user_id = p_user_id
    AND blocked = true
    GROUP BY metadata->>'topic'
    ORDER BY COUNT(*) DESC
    LIMIT 5
  ) gaps;

  -- 10. SUCCESSFUL STRATEGIES
  SELECT jsonb_agg(
    jsonb_build_object(
      'strategy', metadata->>'teaching_approach',
      'success_rate', AVG(COALESCE((feedback->>'rating')::int, 0))
    )
  )
  INTO v_successful_strategies
  FROM phoenix_conversations
  WHERE user_id = p_user_id
  AND metadata->>'teaching_approach' IS NOT NULL
  GROUP BY metadata->>'teaching_approach'
  ORDER BY AVG(COALESCE((feedback->>'rating')::int, 0)) DESC
  LIMIT 3;

  RETURN jsonb_build_object(
    'user_id', p_user_id,
    'generated_at', NOW(),
    'learning_style', COALESCE(v_learning_style, '{}'::jsonb),
    'preferred_subjects', COALESCE(v_preferred_subjects, ARRAY[]::text[]),
    'learning_goals', COALESCE(v_learning_goals, '[]'::jsonb),
    'recent_progress', COALESCE(v_recent_progress, '{}'::jsonb),
    'common_misconceptions', COALESCE(v_common_misconceptions, '[]'::jsonb),
    'interaction_patterns', COALESCE(v_interaction_patterns, '{}'::jsonb),
    'persona_preferences', COALESCE(v_persona_preferences, '{}'::jsonb),
    'recent_struggles', COALESCE(v_recent_struggles, '[]'::jsonb),
    'knowledge_gaps', COALESCE(v_knowledge_gaps, '[]'::jsonb),
    'successful_strategies', COALESCE(v_successful_strategies, '[]'::jsonb)
  );
END;
$function$;