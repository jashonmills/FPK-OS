-- Fix UUID comparison in get_phoenix_analytics function
DROP FUNCTION IF EXISTS public.get_phoenix_analytics(uuid);

CREATE OR REPLACE FUNCTION public.get_phoenix_analytics(p_user_id text DEFAULT NULL)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  result jsonb;
  user_uuid uuid;
BEGIN
  -- Convert text to uuid if provided
  IF p_user_id IS NOT NULL THEN
    user_uuid := p_user_id::uuid;
  END IF;

  SELECT jsonb_build_object(
    'totalSessions', (
      SELECT COUNT(DISTINCT conversation_id)
      FROM phoenix_conversations
      WHERE (p_user_id IS NULL OR user_id = user_uuid)
    ),
    'totalInteractions', (
      SELECT COUNT(*)
      FROM phoenix_messages
      WHERE (p_user_id IS NULL OR conversation_id IN (
        SELECT conversation_id FROM phoenix_conversations WHERE user_id = user_uuid
      ))
    ),
    'avgTurnsPerSession', (
      SELECT COALESCE(AVG(turn_count), 0)
      FROM (
        SELECT COUNT(*) as turn_count
        FROM phoenix_messages pm
        JOIN phoenix_conversations pc ON pm.conversation_id = pc.conversation_id
        WHERE (p_user_id IS NULL OR pc.user_id = user_uuid)
        GROUP BY pm.conversation_id
      ) subq
    ),
    'intentDistribution', (
      SELECT jsonb_agg(jsonb_build_object('intent', intent, 'count', count))
      FROM (
        SELECT intent, COUNT(*) as count
        FROM phoenix_messages pm
        JOIN phoenix_conversations pc ON pm.conversation_id = pc.conversation_id
        WHERE intent IS NOT NULL
          AND (p_user_id IS NULL OR pc.user_id = user_uuid)
        GROUP BY intent
        ORDER BY count DESC
      ) intents
    ),
    'personaUsage', (
      SELECT jsonb_agg(jsonb_build_object('persona', persona, 'count', count))
      FROM (
        SELECT persona, COUNT(*) as count
        FROM phoenix_messages pm
        JOIN phoenix_conversations pc ON pm.conversation_id = pc.conversation_id
        WHERE persona IN ('BETTY', 'AL', 'NITE_OWL')
          AND (p_user_id IS NULL OR pc.user_id = user_uuid)
        GROUP BY persona
        ORDER BY count DESC
      ) personas
    ),
    'engagementOverTime', (
      SELECT jsonb_agg(jsonb_build_object('date', date, 'sessions', sessions))
      FROM (
        SELECT DATE(created_at) as date, COUNT(DISTINCT conversation_id) as sessions
        FROM phoenix_conversations
        WHERE created_at >= NOW() - INTERVAL '30 days'
          AND (p_user_id IS NULL OR user_id = user_uuid)
        GROUP BY DATE(created_at)
        ORDER BY date DESC
      ) engagement
    ),
    'governorActivity', (
      SELECT jsonb_agg(jsonb_build_object(
        'timestamp', timestamp,
        'reason', reason,
        'conversation_id', conversation_id
      ))
      FROM (
        SELECT timestamp, reason, conversation_id
        FROM phoenix_governor_logs pgl
        JOIN phoenix_conversations pc ON pgl.conversation_id = pc.conversation_id
        WHERE (p_user_id IS NULL OR pc.user_id = user_uuid)
        ORDER BY timestamp DESC
        LIMIT 50
      ) governor
    )
  ) INTO result;

  RETURN COALESCE(result, '{}'::jsonb);
END;
$$;