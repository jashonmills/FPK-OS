-- Fix the get_phoenix_analytics function to use correct column names
DROP FUNCTION IF EXISTS public.get_phoenix_analytics(text);

CREATE OR REPLACE FUNCTION public.get_phoenix_analytics(p_user_id text DEFAULT NULL::text)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
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
    )
  ) INTO result;

  RETURN COALESCE(result, '{}'::jsonb);
END;
$function$;