-- Phase 6: Analytics SQL Functions

-- Function 1: Get Phoenix Performance Summary
CREATE OR REPLACE FUNCTION public.get_phoenix_performance_summary(
  p_user_id UUID DEFAULT NULL,
  p_days_back INT DEFAULT 7
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_result JSONB;
BEGIN
  SELECT jsonb_build_object(
    'totalRequests', COUNT(*),
    'avgLatency', ROUND(AVG(total_duration), 0),
    'medianLatency', PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY total_duration),
    'p90Latency', PERCENTILE_CONT(0.9) WITHIN GROUP (ORDER BY total_duration),
    'p99Latency', PERCENTILE_CONT(0.99) WITHIN GROUP (ORDER BY total_duration),
    'avgTTFT', ROUND(AVG(time_to_first_token), 0),
    'stepBreakdown', jsonb_build_object(
      'contextLoading', ROUND(AVG(context_loading_duration), 0),
      'intentDetection', ROUND(AVG(intent_detection_duration), 0),
      'llmResponse', ROUND(AVG(llm_response_duration), 0),
      'governorCheck', ROUND(AVG(governor_check_duration), 0),
      'ttsGeneration', ROUND(AVG(tts_generation_duration), 0)
    ),
    'errorRate', ROUND((COUNT(*) FILTER (WHERE error_occurred) * 100.0 / NULLIF(COUNT(*), 0)), 2),
    'byPersona', (
      SELECT jsonb_object_agg(persona, stats)
      FROM (
        SELECT 
          persona,
          jsonb_build_object(
            'count', COUNT(*),
            'avgLatency', ROUND(AVG(total_duration), 0),
            'errorRate', ROUND((COUNT(*) FILTER (WHERE error_occurred) * 100.0 / COUNT(*)), 2)
          ) as stats
        FROM phoenix_performance_logs
        WHERE created_at >= NOW() - (p_days_back || ' days')::INTERVAL
        AND (p_user_id IS NULL OR user_id = p_user_id)
        GROUP BY persona
      ) persona_stats
    )
  )
  INTO v_result
  FROM phoenix_performance_logs
  WHERE created_at >= NOW() - (p_days_back || ' days')::INTERVAL
  AND (p_user_id IS NULL OR user_id = p_user_id);
  
  RETURN COALESCE(v_result, '{}'::jsonb);
END;
$$;

-- Function 2: Get Nite Owl Effectiveness
CREATE OR REPLACE FUNCTION public.get_nite_owl_effectiveness(
  p_days_back INT DEFAULT 7
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_result JSONB;
BEGIN
  SELECT jsonb_build_object(
    'totalTriggers', COUNT(*),
    'avgTurnsBetween', ROUND(AVG(turns_since_last_nite_owl), 1),
    'triggerReasons', (
      SELECT jsonb_object_agg(trigger_reason, count)
      FROM (
        SELECT trigger_reason, COUNT(*) as count
        FROM phoenix_nite_owl_events
        WHERE created_at >= NOW() - (p_days_back || ' days')::INTERVAL
        GROUP BY trigger_reason
      ) reasons
    ),
    'engagementRate', ROUND((COUNT(*) FILTER (WHERE user_continued_after = true) * 100.0 / NULLIF(COUNT(*), 0)), 2),
    'sessionEndRate', ROUND((COUNT(*) FILTER (WHERE session_ended_after = true) * 100.0 / NULLIF(COUNT(*), 0)), 2),
    'avgResponseTime', ROUND(AVG(time_to_next_message_ms) / 1000.0, 1),
    'helpfulRate', ROUND((COUNT(*) FILTER (WHERE was_helpful = true) * 100.0 / NULLIF(COUNT(*) FILTER (WHERE was_helpful IS NOT NULL), 0)), 2)
  )
  INTO v_result
  FROM phoenix_nite_owl_events
  WHERE created_at >= NOW() - (p_days_back || ' days')::INTERVAL;
  
  RETURN COALESCE(v_result, '{}'::jsonb);
END;
$$;

-- Function 3: Get Intent Accuracy Report
CREATE OR REPLACE FUNCTION public.get_intent_accuracy_report(
  p_days_back INT DEFAULT 7
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_result JSONB;
BEGIN
  SELECT jsonb_build_object(
    'totalIntents', COUNT(*),
    'misinterpretationRate', ROUND((COUNT(*) FILTER (WHERE intent_was_misinterpreted = true) * 100.0 / NULLIF(COUNT(*), 0)), 2),
    'intentDistribution', (
      SELECT jsonb_object_agg(intent, count)
      FROM (
        SELECT intent::TEXT, COUNT(*) as count
        FROM phoenix_performance_logs
        WHERE created_at >= NOW() - (p_days_back || ' days')::INTERVAL
        AND intent IS NOT NULL
        GROUP BY intent
        ORDER BY count DESC
      ) intents
    ),
    'topMisinterpretedIntents', (
      SELECT jsonb_agg(
        jsonb_build_object(
          'intent', intent,
          'count', count,
          'rate', ROUND(rate, 2)
        )
      )
      FROM (
        SELECT 
          intent::TEXT,
          COUNT(*) as count,
          (COUNT(*) FILTER (WHERE intent_was_misinterpreted = true) * 100.0 / COUNT(*)) as rate
        FROM phoenix_performance_logs
        WHERE created_at >= NOW() - (p_days_back || ' days')::INTERVAL
        AND intent IS NOT NULL
        GROUP BY intent
        HAVING COUNT(*) FILTER (WHERE intent_was_misinterpreted = true) > 0
        ORDER BY rate DESC
        LIMIT 5
      ) top_misinterpreted
    )
  )
  INTO v_result
  FROM phoenix_performance_logs
  WHERE created_at >= NOW() - (p_days_back || ' days')::INTERVAL;
  
  RETURN COALESCE(v_result, '{}'::jsonb);
END;
$$;

-- Function 4: Get Feature Usage Stats
CREATE OR REPLACE FUNCTION public.get_feature_usage_stats(
  p_days_back INT DEFAULT 7
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_result JSONB;
BEGIN
  SELECT jsonb_object_agg(feature_name, stats)
  INTO v_result
  FROM (
    SELECT 
      feature_name,
      jsonb_build_object(
        'totalTriggers', COUNT(*) FILTER (WHERE was_triggered = true),
        'totalExecutions', COUNT(*) FILTER (WHERE was_executed = true),
        'successRate', ROUND((COUNT(*) FILTER (WHERE was_successful = true) * 100.0 / NULLIF(COUNT(*) FILTER (WHERE was_executed = true), 0)), 2),
        'errorRate', ROUND((COUNT(*) FILTER (WHERE was_successful = false) * 100.0 / NULLIF(COUNT(*) FILTER (WHERE was_executed = true), 0)), 2),
        'avgExecutionTime', ROUND(AVG(execution_duration_ms) FILTER (WHERE was_executed = true), 0),
        'recentErrors', (
          SELECT jsonb_agg(
            jsonb_build_object(
              'timestamp', created_at,
              'error', error_message
            )
          )
          FROM (
            SELECT created_at, error_message
            FROM phoenix_feature_usage pfu_inner
            WHERE pfu_inner.feature_name = pfu_outer.feature_name
            AND pfu_inner.was_successful = false
            AND pfu_inner.error_message IS NOT NULL
            ORDER BY pfu_inner.created_at DESC
            LIMIT 5
          ) recent_errors_inner
        )
      ) as stats
    FROM phoenix_feature_usage pfu_outer
    WHERE created_at >= NOW() - (p_days_back || ' days')::INTERVAL
    GROUP BY feature_name
  ) feature_stats;
  
  RETURN COALESCE(v_result, '{}'::jsonb);
END;
$$;

-- Function 5: Get User Frustration Report
CREATE OR REPLACE FUNCTION public.get_user_frustration_report(
  p_days_back INT DEFAULT 7
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_result JSONB;
BEGIN
  SELECT jsonb_build_object(
    'totalEvents', COUNT(*),
    'feedbackDistribution', (
      SELECT jsonb_object_agg(feedback_type, count)
      FROM (
        SELECT feedback_type, COUNT(*) as count
        FROM phoenix_user_feedback
        WHERE created_at >= NOW() - (p_days_back || ' days')::INTERVAL
        GROUP BY feedback_type
      ) feedback
    ),
    'byPersona', (
      SELECT jsonb_object_agg(persona_before_feedback, stats)
      FROM (
        SELECT 
          persona_before_feedback::TEXT,
          jsonb_build_object(
            'count', COUNT(*),
            'avgTurns', ROUND(AVG(session_turn_count), 1)
          ) as stats
        FROM phoenix_user_feedback
        WHERE created_at >= NOW() - (p_days_back || ' days')::INTERVAL
        AND persona_before_feedback IS NOT NULL
        GROUP BY persona_before_feedback
      ) persona_stats
    ),
    'escapeHatchRate', ROUND((COUNT(*) FILTER (WHERE feedback_type = 'escape_hatch') * 100.0 / NULLIF(COUNT(*), 0)), 2),
    'avgTurnsBeforeFrustration', ROUND(AVG(session_turn_count), 1),
    'recentFeedback', (
      SELECT jsonb_agg(
        jsonb_build_object(
          'type', feedback_type,
          'message', user_message,
          'turns', session_turn_count,
          'timestamp', created_at
        )
      )
      FROM (
        SELECT feedback_type, user_message, session_turn_count, created_at
        FROM phoenix_user_feedback
        WHERE created_at >= NOW() - (p_days_back || ' days')::INTERVAL
        ORDER BY created_at DESC
        LIMIT 10
      ) recent
    )
  )
  INTO v_result
  FROM phoenix_user_feedback
  WHERE created_at >= NOW() - (p_days_back || ' days')::INTERVAL;
  
  RETURN COALESCE(v_result, '{}'::jsonb);
END;
$$;