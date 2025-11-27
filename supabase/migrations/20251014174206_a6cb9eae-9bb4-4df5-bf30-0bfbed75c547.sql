
-- Create database function to fetch Phoenix Lab analytics
CREATE OR REPLACE FUNCTION public.get_phoenix_analytics(p_user_id uuid DEFAULT NULL)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  v_result jsonb;
  v_total_sessions bigint;
  v_total_interactions bigint;
  v_avg_turns numeric;
BEGIN
  -- If user_id provided, filter by that user, otherwise get all data (for admins)
  
  -- Total sessions
  SELECT COUNT(*)
  INTO v_total_sessions
  FROM phoenix_conversations
  WHERE p_user_id IS NULL OR user_id = p_user_id;
  
  -- Total interactions (messages)
  SELECT COUNT(*)
  INTO v_total_interactions
  FROM phoenix_messages pm
  JOIN phoenix_conversations pc ON pc.id = pm.conversation_id
  WHERE p_user_id IS NULL OR pc.user_id = p_user_id;
  
  -- Average turns per session
  v_avg_turns := CASE 
    WHEN v_total_sessions > 0 THEN 
      ROUND((v_total_interactions::numeric / v_total_sessions), 1)
    ELSE 0
  END;
  
  -- Build result object
  v_result := jsonb_build_object(
    'totalSessions', v_total_sessions,
    'totalInteractions', v_total_interactions,
    'avgTurnsPerSession', v_avg_turns,
    
    -- Intent distribution
    'intentDistribution', (
      SELECT jsonb_agg(
        jsonb_build_object(
          'intent', intent::text,
          'count', count
        )
      )
      FROM (
        SELECT 
          pm.intent,
          COUNT(*) as count
        FROM phoenix_messages pm
        JOIN phoenix_conversations pc ON pc.id = pm.conversation_id
        WHERE (p_user_id IS NULL OR pc.user_id = p_user_id)
        AND pm.intent IS NOT NULL
        GROUP BY pm.intent
        ORDER BY count DESC
      ) intent_counts
    ),
    
    -- Persona usage
    'personaUsage', (
      SELECT jsonb_agg(
        jsonb_build_object(
          'persona', persona::text,
          'count', count
        )
      )
      FROM (
        SELECT 
          pm.persona,
          COUNT(*) as count
        FROM phoenix_messages pm
        JOIN phoenix_conversations pc ON pc.id = pm.conversation_id
        WHERE (p_user_id IS NULL OR pc.user_id = p_user_id)
        AND pm.persona IN ('BETTY', 'AL', 'NITE_OWL')
        GROUP BY pm.persona
        ORDER BY count DESC
      ) persona_counts
    ),
    
    -- Engagement over time (last 30 days)
    'engagementOverTime', (
      SELECT jsonb_agg(
        jsonb_build_object(
          'date', date::text,
          'sessions', count
        ) ORDER BY date
      )
      FROM (
        SELECT 
          DATE(created_at) as date,
          COUNT(*) as count
        FROM phoenix_conversations
        WHERE (p_user_id IS NULL OR user_id = p_user_id)
        AND created_at >= CURRENT_DATE - INTERVAL '30 days'
        GROUP BY DATE(created_at)
        ORDER BY date
      ) daily_counts
    ),
    
    -- Governor activity (recent flags)
    'governorActivity', (
      SELECT jsonb_agg(
        jsonb_build_object(
          'id', id,
          'persona', persona::text,
          'reason', reason,
          'severity', severity,
          'is_safe', is_safe,
          'is_on_topic', is_on_topic,
          'persona_adherence', persona_adherence,
          'blocked', blocked,
          'created_at', created_at
        ) ORDER BY created_at DESC
      )
      FROM (
        SELECT *
        FROM phoenix_governor_logs pgl
        JOIN phoenix_conversations pc ON pc.id = pgl.conversation_id
        WHERE (p_user_id IS NULL OR pc.user_id = p_user_id)
        AND blocked = true
        ORDER BY pgl.created_at DESC
        LIMIT 50
      ) recent_logs
    )
  );
  
  RETURN v_result;
END;
$$;

-- Grant execute to authenticated users
GRANT EXECUTE ON FUNCTION public.get_phoenix_analytics(uuid) TO authenticated;
