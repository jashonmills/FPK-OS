-- Fix remaining 24 functions with SET search_path for security hardening

-- Fix get_user_id_by_email
CREATE OR REPLACE FUNCTION public.get_user_id_by_email(user_email text)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
DECLARE
  found_user_id UUID;
BEGIN
  SELECT id INTO found_user_id
  FROM auth.users
  WHERE email = LOWER(user_email)
  LIMIT 1;
  RETURN found_user_id;
END;
$function$;

-- Fix user_has_org_role
CREATE OR REPLACE FUNCTION public.user_has_org_role(_user_id uuid, _org_id uuid, _roles text[])
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = 'public'
AS $function$
  SELECT EXISTS (
    SELECT 1
    FROM public.org_members
    WHERE user_id = _user_id
      AND org_id = _org_id
      AND role::text = ANY(_roles)
      AND status = 'active'::member_status
  );
$function$;

-- Fix get_related_posts
CREATE OR REPLACE FUNCTION public.get_related_posts(p_post_id uuid, p_limit integer DEFAULT 3)
RETURNS TABLE(id uuid, title text, slug text, excerpt text, featured_image_url text, published_at timestamp with time zone)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
BEGIN
  RETURN QUERY
  SELECT DISTINCT bp.id, bp.title, bp.slug, bp.excerpt, bp.featured_image_url, bp.published_at
  FROM public.blog_posts bp
  INNER JOIN public.blog_post_tags bpt1 ON bp.id = bpt1.post_id
  WHERE bp.status = 'published'
    AND bp.id != p_post_id
    AND EXISTS (
      SELECT 1 FROM public.blog_post_tags bpt2
      WHERE bpt2.post_id = p_post_id AND bpt2.tag_id = bpt1.tag_id
    )
  ORDER BY bp.published_at DESC
  LIMIT p_limit;
END;
$function$;

-- Fix get_coach_mastery_score
CREATE OR REPLACE FUNCTION public.get_coach_mastery_score(p_user_id uuid, p_source text DEFAULT NULL::text)
RETURNS numeric
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
DECLARE
  v_avg_score NUMERIC;
BEGIN
  SELECT COALESCE(AVG(
    CASE 
      WHEN array_length(score_history, 1) > 0 THEN
        (SELECT AVG(s::NUMERIC) FROM unnest(score_history) s)
      ELSE 0
    END
  ), 0)
  INTO v_avg_score
  FROM socratic_sessions
  WHERE user_id = p_user_id
  AND (p_source IS NULL OR source = p_source);
  
  RETURN ROUND(v_avg_score, 1);
END;
$function$;

-- Fix get_coach_learning_time
CREATE OR REPLACE FUNCTION public.get_coach_learning_time(p_user_id uuid, p_source text DEFAULT NULL::text)
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
DECLARE
  v_total_minutes INTEGER;
BEGIN
  SELECT COALESCE(
    (SELECT COUNT(*) * 5 FROM socratic_turns st
     JOIN socratic_sessions ss ON ss.id = st.session_id
     WHERE ss.user_id = p_user_id
     AND (p_source IS NULL OR ss.source = p_source)),
    0
  )
  INTO v_total_minutes;
  
  RETURN v_total_minutes;
END;
$function$;

-- Fix get_coach_topics
CREATE OR REPLACE FUNCTION public.get_coach_topics(p_user_id uuid, p_source text DEFAULT NULL::text)
RETURNS text[]
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
DECLARE
  v_topics TEXT[];
BEGIN
  SELECT ARRAY_AGG(DISTINCT topic)
  INTO v_topics
  FROM socratic_sessions
  WHERE user_id = p_user_id
  AND topic IS NOT NULL
  AND (p_source IS NULL OR source = p_source);
  
  RETURN COALESCE(v_topics, ARRAY[]::TEXT[]);
END;
$function$;

-- Fix get_coach_streak
CREATE OR REPLACE FUNCTION public.get_coach_streak(p_user_id uuid, p_source text DEFAULT NULL::text)
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
DECLARE
  v_streak INTEGER := 0;
  v_check_date DATE := CURRENT_DATE;
  v_has_activity BOOLEAN;
BEGIN
  LOOP
    SELECT EXISTS(
      SELECT 1 FROM socratic_sessions
      WHERE user_id = p_user_id
      AND DATE(created_at) = v_check_date
      AND (p_source IS NULL OR source = p_source)
    ) INTO v_has_activity;
    
    EXIT WHEN NOT v_has_activity;
    
    v_streak := v_streak + 1;
    v_check_date := v_check_date - INTERVAL '1 day';
    
    EXIT WHEN v_streak > 365;
  END LOOP;
  
  RETURN v_streak;
END;
$function$;

-- Fix get_coach_mode_ratio
CREATE OR REPLACE FUNCTION public.get_coach_mode_ratio(p_user_id uuid, p_source text DEFAULT NULL::text)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
DECLARE
  v_socratic_count INTEGER;
  v_total_sessions INTEGER;
  v_ratio JSONB;
BEGIN
  SELECT COUNT(*) INTO v_socratic_count
  FROM socratic_sessions
  WHERE user_id = p_user_id
  AND (p_source IS NULL OR source = p_source);
  
  SELECT COUNT(*) INTO v_total_sessions
  FROM coach_sessions
  WHERE user_id = p_user_id
  AND (p_source IS NULL OR source = p_source);
  
  v_total_sessions := v_total_sessions + v_socratic_count;
  
  v_ratio := jsonb_build_object(
    'socratic', v_socratic_count,
    'freeChat', v_total_sessions - v_socratic_count,
    'socraticPercent', CASE 
      WHEN v_total_sessions > 0 THEN ROUND((v_socratic_count::NUMERIC / v_total_sessions) * 100)
      ELSE 0
    END,
    'total', v_total_sessions
  );
  
  RETURN v_ratio;
END;
$function$;

-- Fix deduct_ai_credits
CREATE OR REPLACE FUNCTION public.deduct_ai_credits(p_user_id uuid, p_amount integer, p_transaction_type text, p_session_id text DEFAULT NULL::text, p_metadata jsonb DEFAULT '{}'::jsonb)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
DECLARE
  v_current_balance INTEGER;
  v_new_balance INTEGER;
  v_transaction_id UUID;
BEGIN
  SELECT ai_credits INTO v_current_balance
  FROM public.profiles
  WHERE id = p_user_id
  FOR UPDATE;
  
  IF v_current_balance < p_amount THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'insufficient_credits',
      'current_balance', v_current_balance,
      'required', p_amount
    );
  END IF;
  
  v_new_balance := v_current_balance - p_amount;
  
  UPDATE public.profiles
  SET ai_credits = v_new_balance,
      updated_at = NOW()
  WHERE id = p_user_id;
  
  INSERT INTO public.ai_credit_transactions (
    user_id, amount, balance_before, balance_after,
    transaction_type, session_id, metadata
  ) VALUES (
    p_user_id, -p_amount, v_current_balance, v_new_balance,
    p_transaction_type, p_session_id, p_metadata
  ) RETURNING id INTO v_transaction_id;
  
  RETURN jsonb_build_object(
    'success', true,
    'transaction_id', v_transaction_id,
    'balance_before', v_current_balance,
    'balance_after', v_new_balance
  );
END;
$function$;

-- Fix add_ai_credits
CREATE OR REPLACE FUNCTION public.add_ai_credits(p_user_id uuid, p_amount integer, p_transaction_type text, p_metadata jsonb DEFAULT '{}'::jsonb)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
DECLARE
  v_current_balance INTEGER;
  v_new_balance INTEGER;
  v_transaction_id UUID;
BEGIN
  SELECT ai_credits INTO v_current_balance
  FROM public.profiles
  WHERE id = p_user_id
  FOR UPDATE;
  
  v_new_balance := v_current_balance + p_amount;
  
  UPDATE public.profiles
  SET ai_credits = v_new_balance,
      updated_at = NOW()
  WHERE id = p_user_id;
  
  INSERT INTO public.ai_credit_transactions (
    user_id, amount, balance_before, balance_after,
    transaction_type, metadata
  ) VALUES (
    p_user_id, p_amount, v_current_balance, v_new_balance,
    p_transaction_type, p_metadata
  ) RETURNING id INTO v_transaction_id;
  
  RETURN jsonb_build_object(
    'success', true,
    'transaction_id', v_transaction_id,
    'balance_before', v_current_balance,
    'balance_after', v_new_balance
  );
END;
$function$;

-- Fix get_ai_credits
CREATE OR REPLACE FUNCTION public.get_ai_credits(p_user_id uuid)
RETURNS integer
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = 'public'
AS $function$
  SELECT COALESCE(ai_credits, 0)
  FROM public.profiles
  WHERE id = p_user_id;
$function$;

-- Fix is_admin_or_coach_user
CREATE OR REPLACE FUNCTION public.is_admin_or_coach_user(check_user_id uuid)
RETURNS boolean
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = 'public'
AS $function$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = check_user_id
    AND role IN ('admin', 'ai_coach_user')
  );
END;
$function$;

-- Fix has_permission
CREATE OR REPLACE FUNCTION public.has_permission(_user_id uuid, _permission app_permission)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = 'public'
AS $function$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_permissions
    WHERE user_id = _user_id
      AND permission = _permission
  );
$function$;

-- Fix calculate_level_from_xp
CREATE OR REPLACE FUNCTION public.calculate_level_from_xp(total_xp integer)
RETURNS TABLE(level integer, next_level_xp integer)
LANGUAGE plpgsql
SET search_path = 'public'
AS $function$
DECLARE
  current_level integer := 1;
  xp_needed integer := 100;
  cumulative_xp integer := 0;
BEGIN
  WHILE cumulative_xp + xp_needed <= total_xp LOOP
    cumulative_xp := cumulative_xp + xp_needed;
    current_level := current_level + 1;
    xp_needed := 100 + (current_level - 1) * 50;
  END LOOP;
  
  RETURN QUERY SELECT current_level, xp_needed - (total_xp - cumulative_xp);
END;
$function$;

-- Fix get_coach_dashboard_kpis
CREATE OR REPLACE FUNCTION public.get_coach_dashboard_kpis(p_user_id uuid, p_date_range text DEFAULT 'all_time'::text)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
DECLARE
  v_start_date TIMESTAMP WITH TIME ZONE;
  v_total_study_time INTEGER := 0;
  v_total_sessions INTEGER := 0;
  v_current_streak INTEGER := 0;
  v_average_mastery NUMERIC := 0;
BEGIN
  v_start_date := CASE p_date_range
    WHEN 'last_7_days' THEN NOW() - INTERVAL '7 days'
    WHEN 'last_30_days' THEN NOW() - INTERVAL '30 days'
    ELSE '1970-01-01'::TIMESTAMP WITH TIME ZONE
  END;
  
  SELECT COALESCE(COUNT(*) * 5, 0)
  INTO v_total_study_time
  FROM socratic_turns st
  JOIN socratic_sessions ss ON ss.id = st.session_id
  WHERE ss.user_id = p_user_id
  AND ss.source = 'coach_portal'
  AND st.created_at >= v_start_date;
  
  SELECT COUNT(*)
  INTO v_total_sessions
  FROM socratic_sessions
  WHERE user_id = p_user_id
  AND source = 'coach_portal'
  AND created_at >= v_start_date;
  
  SELECT get_coach_streak(p_user_id, 'coach_portal')
  INTO v_current_streak;
  
  SELECT COALESCE(AVG(
    CASE 
      WHEN array_length(score_history, 1) > 0 THEN
        (SELECT AVG(s::NUMERIC) FROM unnest(score_history) s)
      ELSE 0
    END
  ), 0)
  INTO v_average_mastery
  FROM socratic_sessions
  WHERE user_id = p_user_id
  AND source = 'coach_portal'
  AND created_at >= v_start_date;
  
  RETURN jsonb_build_object(
    'total_study_time', v_total_study_time,
    'total_sessions', v_total_sessions,
    'current_streak', v_current_streak,
    'average_mastery', ROUND(v_average_mastery, 1)
  );
END;
$function$;

-- Fix get_coach_activity_heatmap
CREATE OR REPLACE FUNCTION public.get_coach_activity_heatmap(p_user_id uuid, p_date_range text DEFAULT 'all_time'::text)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
DECLARE
  v_start_date TIMESTAMP WITH TIME ZONE;
  v_result JSONB;
BEGIN
  v_start_date := CASE p_date_range
    WHEN 'last_7_days' THEN NOW() - INTERVAL '7 days'
    WHEN 'last_30_days' THEN NOW() - INTERVAL '30 days'
    ELSE NOW() - INTERVAL '365 days'
  END;
  
  SELECT jsonb_agg(
    jsonb_build_object(
      'date', day_date::TEXT,
      'study_time', COALESCE(study_minutes, 0)
    ) ORDER BY day_date
  )
  INTO v_result
  FROM (
    SELECT 
      DATE(st.created_at) as day_date,
      COUNT(*) * 5 as study_minutes
    FROM socratic_turns st
    JOIN socratic_sessions ss ON ss.id = st.session_id
    WHERE ss.user_id = p_user_id
    AND ss.source = 'coach_portal'
    AND st.created_at >= v_start_date
    GROUP BY DATE(st.created_at)
  ) daily_data;
  
  RETURN COALESCE(v_result, '[]'::JSONB);
END;
$function$;

-- Fix get_coach_time_by_day
CREATE OR REPLACE FUNCTION public.get_coach_time_by_day(p_user_id uuid, p_date_range text DEFAULT 'all_time'::text)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
DECLARE
  v_start_date TIMESTAMP WITH TIME ZONE;
  v_result JSONB;
BEGIN
  v_start_date := CASE p_date_range
    WHEN 'last_7_days' THEN NOW() - INTERVAL '7 days'
    WHEN 'last_30_days' THEN NOW() - INTERVAL '30 days'
    ELSE '1970-01-01'::TIMESTAMP WITH TIME ZONE
  END;
  
  SELECT jsonb_agg(
    jsonb_build_object(
      'day', day_name,
      'study_time', COALESCE(study_minutes, 0)
    ) ORDER BY day_num
  )
  INTO v_result
  FROM (
    SELECT 
      EXTRACT(DOW FROM st.created_at)::INTEGER as day_num,
      TO_CHAR(st.created_at, 'Day') as day_name,
      COUNT(*) * 5 as study_minutes
    FROM socratic_turns st
    JOIN socratic_sessions ss ON ss.id = st.session_id
    WHERE ss.user_id = p_user_id
    AND ss.source = 'coach_portal'
    AND st.created_at >= v_start_date
    GROUP BY EXTRACT(DOW FROM st.created_at), TO_CHAR(st.created_at, 'Day')
  ) day_data;
  
  RETURN COALESCE(v_result, '[]'::JSONB);
END;
$function$;

-- Fix get_coach_time_by_hour
CREATE OR REPLACE FUNCTION public.get_coach_time_by_hour(p_user_id uuid, p_date_range text DEFAULT 'all_time'::text)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
DECLARE
  v_start_date TIMESTAMP WITH TIME ZONE;
  v_result JSONB;
BEGIN
  v_start_date := CASE p_date_range
    WHEN 'last_7_days' THEN NOW() - INTERVAL '7 days'
    WHEN 'last_30_days' THEN NOW() - INTERVAL '30 days'
    ELSE '1970-01-01'::TIMESTAMP WITH TIME ZONE
  END;
  
  SELECT jsonb_agg(
    jsonb_build_object(
      'hour', hour_of_day,
      'study_time', COALESCE(study_minutes, 0)
    ) ORDER BY hour_of_day
  )
  INTO v_result
  FROM (
    SELECT 
      EXTRACT(HOUR FROM st.created_at)::INTEGER as hour_of_day,
      COUNT(*) * 5 as study_minutes
    FROM socratic_turns st
    JOIN socratic_sessions ss ON ss.id = st.session_id
    WHERE ss.user_id = p_user_id
    AND ss.source = 'coach_portal'
    AND st.created_at >= v_start_date
    GROUP BY EXTRACT(HOUR FROM st.created_at)
  ) hour_data;
  
  RETURN COALESCE(v_result, '[]'::JSONB);
END;
$function$;

-- Fix get_coach_mastery_over_time
CREATE OR REPLACE FUNCTION public.get_coach_mastery_over_time(p_user_id uuid, p_date_range text DEFAULT 'all_time'::text)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
DECLARE
  v_start_date TIMESTAMP WITH TIME ZONE;
  v_result JSONB;
BEGIN
  v_start_date := CASE p_date_range
    WHEN 'last_7_days' THEN NOW() - INTERVAL '7 days'
    WHEN 'last_30_days' THEN NOW() - INTERVAL '30 days'
    ELSE NOW() - INTERVAL '90 days'
  END;
  
  SELECT jsonb_agg(
    jsonb_build_object(
      'date', week_start::TEXT,
      'avg_mastery', ROUND(avg_mastery, 2)
    ) ORDER BY week_start
  )
  INTO v_result
  FROM (
    SELECT 
      DATE_TRUNC('week', ss.created_at)::DATE as week_start,
      AVG(
        CASE 
          WHEN array_length(ss.score_history, 1) > 0 THEN
            (SELECT AVG(s::NUMERIC) FROM unnest(ss.score_history) s)
          ELSE 0
        END
      ) as avg_mastery
    FROM socratic_sessions ss
    WHERE ss.user_id = p_user_id
    AND ss.source = 'coach_portal'
    AND ss.created_at >= v_start_date
    GROUP BY DATE_TRUNC('week', ss.created_at)
  ) weekly_data;
  
  RETURN COALESCE(v_result, '[]'::JSONB);
END;
$function$;

-- Fix get_coach_topic_breakdown
CREATE OR REPLACE FUNCTION public.get_coach_topic_breakdown(p_user_id uuid, p_date_range text DEFAULT 'all_time'::text)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
DECLARE
  v_start_date TIMESTAMP WITH TIME ZONE;
  v_result JSONB;
BEGIN
  v_start_date := CASE p_date_range
    WHEN 'last_7_days' THEN NOW() - INTERVAL '7 days'
    WHEN 'last_30_days' THEN NOW() - INTERVAL '30 days'
    ELSE '1970-01-01'::TIMESTAMP WITH TIME ZONE
  END;
  
  SELECT jsonb_agg(
    jsonb_build_object(
      'topic', COALESCE(topic, 'General Study'),
      'study_time', study_minutes,
      'mastery_score', ROUND(avg_mastery, 1),
      'session_count', session_count
    )
  )
  INTO v_result
  FROM (
    SELECT 
      ss.topic,
      COUNT(DISTINCT ss.id) as session_count,
      COUNT(st.id) * 5 as study_minutes,
      AVG(
        CASE 
          WHEN array_length(ss.score_history, 1) > 0 THEN
            (SELECT AVG(s::NUMERIC) FROM unnest(ss.score_history) s)
          ELSE 0
        END
      ) as avg_mastery
    FROM socratic_sessions ss
    LEFT JOIN socratic_turns st ON st.session_id = ss.id
    WHERE ss.user_id = p_user_id
    AND ss.source = 'coach_portal'
    AND ss.created_at >= v_start_date
    GROUP BY ss.topic
  ) topic_data
  ORDER BY topic_data.study_minutes DESC;
  
  RETURN COALESCE(v_result, '[]'::JSONB);
END;
$function$;

-- Fix get_relevant_memories
CREATE OR REPLACE FUNCTION public.get_relevant_memories(p_user_id uuid, p_limit integer DEFAULT 5, p_days_back integer DEFAULT 30)
RETURNS TABLE(id uuid, memory_type text, content text, context jsonb, relevance_score numeric, created_at timestamp with time zone, days_ago integer)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
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
$function$;

-- Fix mark_memory_referenced
CREATE OR REPLACE FUNCTION public.mark_memory_referenced(p_memory_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
BEGIN
  UPDATE phoenix_memory_fragments
  SET 
    last_referenced_at = NOW(),
    reference_count = reference_count + 1,
    relevance_score = LEAST(1.0, relevance_score + 0.1)
  WHERE id = p_memory_id;
END;
$function$;

-- Fix get_user_learning_path
CREATE OR REPLACE FUNCTION public.get_user_learning_path(p_user_id uuid, p_domain text DEFAULT NULL::text)
RETURNS TABLE(concept_id uuid, concept_name text, concept_slug text, domain text, difficulty_level integer, mastery_level numeric, status text, prerequisites jsonb, related_concepts jsonb, last_interaction timestamp with time zone)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
BEGIN
  RETURN QUERY
  WITH user_mastery AS (
    SELECT 
      plo.concept_id,
      AVG(plo.mastery_level) as avg_mastery,
      MAX(plo.created_at) as last_interaction
    FROM phoenix_learning_outcomes plo
    WHERE plo.user_id = p_user_id
    AND plo.concept_id IS NOT NULL
    GROUP BY plo.concept_id
  ),
  concept_prereqs AS (
    SELECT 
      pcp.concept_id,
      jsonb_agg(
        jsonb_build_object(
          'id', plc.id,
          'name', plc.concept_name,
          'slug', plc.concept_slug,
          'type', pcp.relationship_type,
          'strength', pcp.strength
        )
      ) as prereqs
    FROM phoenix_concept_prerequisites pcp
    JOIN phoenix_learning_concepts plc ON plc.id = pcp.prerequisite_id
    GROUP BY pcp.concept_id
  ),
  related_concepts AS (
    SELECT 
      pcp.prerequisite_id as concept_id,
      jsonb_agg(
        jsonb_build_object(
          'id', plc.id,
          'name', plc.concept_name,
          'slug', plc.concept_slug
        )
      ) as related
    FROM phoenix_concept_prerequisites pcp
    JOIN phoenix_learning_concepts plc ON plc.id = pcp.concept_id
    WHERE pcp.relationship_type = 'related'
    GROUP BY pcp.prerequisite_id
  )
  SELECT 
    plc.id as concept_id,
    plc.concept_name,
    plc.concept_slug,
    plc.domain,
    plc.difficulty_level,
    COALESCE(um.avg_mastery, 0) as mastery_level,
    CASE 
      WHEN um.avg_mastery IS NULL THEN 'not_started'
      WHEN um.avg_mastery >= 0.8 THEN 'mastered'
      WHEN um.avg_mastery >= 0.5 THEN 'in_progress'
      ELSE 'learning'
    END as status,
    COALESCE(cp.prereqs, '[]'::jsonb) as prerequisites,
    COALESCE(rc.related, '[]'::jsonb) as related_concepts,
    um.last_interaction
  FROM phoenix_learning_concepts plc
  LEFT JOIN user_mastery um ON um.concept_id = plc.id
  LEFT JOIN concept_prereqs cp ON cp.concept_id = plc.id
  LEFT JOIN related_concepts rc ON rc.concept_id = plc.id
  WHERE plc.is_active = true
  AND (p_domain IS NULL OR plc.domain = p_domain)
  ORDER BY 
    CASE 
      WHEN um.avg_mastery IS NOT NULL THEN 1
      ELSE 2
    END,
    plc.difficulty_level,
    plc.concept_name;
END;
$function$;

-- Fix get_recommended_concepts
CREATE OR REPLACE FUNCTION public.get_recommended_concepts(p_user_id uuid, p_limit integer DEFAULT 5)
RETURNS TABLE(concept_id uuid, concept_name text, concept_slug text, domain text, difficulty_level integer, recommendation_score numeric, reason text)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
BEGIN
  RETURN QUERY
  WITH user_mastery AS (
    SELECT 
      plo.concept_id,
      AVG(plo.mastery_level) as mastery_level
    FROM phoenix_learning_outcomes plo
    WHERE plo.user_id = p_user_id
    AND plo.concept_id IS NOT NULL
    GROUP BY plo.concept_id
    HAVING AVG(plo.mastery_level) >= 0.7
  ),
  available_concepts AS (
    SELECT 
      plc.id,
      plc.concept_name,
      plc.concept_slug,
      plc.domain,
      plc.difficulty_level,
      COUNT(pcp.prerequisite_id) FILTER (WHERE um.concept_id IS NOT NULL) as met_prereqs,
      COUNT(pcp.prerequisite_id) as total_prereqs
    FROM phoenix_learning_concepts plc
    LEFT JOIN phoenix_concept_prerequisites pcp 
      ON pcp.concept_id = plc.id 
      AND pcp.relationship_type = 'required'
    LEFT JOIN user_mastery um ON um.concept_id = pcp.prerequisite_id
    WHERE plc.is_active = true
    AND NOT EXISTS (
      SELECT 1 FROM user_mastery um2 WHERE um2.concept_id = plc.id
    )
    GROUP BY plc.id, plc.concept_name, plc.concept_slug, plc.domain, plc.difficulty_level
  )
  SELECT 
    ac.id as concept_id,
    ac.concept_name,
    ac.concept_slug,
    ac.domain,
    ac.difficulty_level,
    CASE 
      WHEN ac.total_prereqs = 0 THEN 1.0
      ELSE (ac.met_prereqs::NUMERIC / ac.total_prereqs::NUMERIC)
    END as recommendation_score,
    CASE 
      WHEN ac.total_prereqs = 0 THEN 'New topic to explore'
      WHEN ac.met_prereqs = ac.total_prereqs THEN 'Ready to learn - all prerequisites met'
      ELSE format('Prerequisites: %s of %s completed', ac.met_prereqs, ac.total_prereqs)
    END as reason
  FROM available_concepts ac
  WHERE ac.met_prereqs = ac.total_prereqs OR ac.total_prereqs = 0
  ORDER BY recommendation_score DESC, ac.difficulty_level
  LIMIT p_limit;
END;
$function$;