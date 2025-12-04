-- Fix the get_student_knowledge_pack function - GROUP BY error with plo.topic
DROP FUNCTION IF EXISTS public.get_student_knowledge_pack(uuid);

CREATE OR REPLACE FUNCTION public.get_student_knowledge_pack(p_user_id uuid)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  v_result JSONB;
  v_active_courses JSONB;
  v_recent_activity JSONB;
  v_active_goals JSONB;
  v_strengths_weaknesses JSONB;
  v_instructor_notes JSONB;
  v_learning_patterns JSONB;
  v_gamification JSONB;
  v_recent_struggles JSONB;
  v_ai_coach_insights JSONB;
  v_org_context JSONB;
BEGIN
  -- 1. ACTIVE COURSES
  SELECT jsonb_agg(
    jsonb_build_object(
      'course_id', ice.course_id,
      'course_title', ice.course_title,
      'progress', ice.completion_percentage,
      'time_spent_minutes', ice.total_time_spent_minutes,
      'last_accessed', ice.last_accessed_at,
      'status', CASE 
        WHEN ice.completion_percentage >= 100 THEN 'completed'
        WHEN ice.completion_percentage > 0 THEN 'in_progress'
        ELSE 'not_started'
      END
    ) ORDER BY ice.last_accessed_at DESC NULLS LAST
  )
  INTO v_active_courses
  FROM interactive_course_enrollments ice
  WHERE ice.user_id = p_user_id
  AND ice.completion_percentage < 100
  LIMIT 5;

  -- 2. RECENT ACTIVITY
  SELECT jsonb_build_object(
    'recent_socratic_sessions', (
      SELECT jsonb_agg(
        jsonb_build_object(
          'topic', ss.topic,
          'objective', ss.objective,
          'turns', (SELECT COUNT(*) FROM socratic_turns WHERE session_id = ss.id),
          'created_at', ss.created_at
        ) ORDER BY ss.created_at DESC
      )
      FROM socratic_sessions ss
      WHERE ss.user_id = p_user_id
      AND ss.created_at >= NOW() - INTERVAL '7 days'
      LIMIT 3
    ),
    'study_time_last_7_days', (
      SELECT COALESCE(SUM(ice.total_time_spent_minutes), 0)
      FROM interactive_course_enrollments ice
      WHERE ice.user_id = p_user_id
      AND ice.last_accessed_at >= NOW() - INTERVAL '7 days'
    )
  )
  INTO v_recent_activity;

  -- 3. ACTIVE GOALS
  SELECT jsonb_agg(
    jsonb_build_object(
      'title', g.title,
      'category', g.category,
      'progress', g.progress,
      'target_date', g.target_date,
      'status', g.status
    ) ORDER BY g.target_date ASC NULLS LAST
  )
  INTO v_active_goals
  FROM goals g
  WHERE g.user_id = p_user_id
  AND g.status = 'active'
  LIMIT 5;

  -- 4. STRENGTHS & WEAKNESSES - FIX: Properly aggregate topics
  SELECT jsonb_build_object(
    'strengths', (
      SELECT jsonb_agg(topic)
      FROM (
        SELECT DISTINCT plo.topic
        FROM phoenix_learning_outcomes plo
        WHERE plo.user_id = p_user_id
        AND plo.mastery_level >= 0.8
        AND plo.topic IS NOT NULL
        ORDER BY plo.topic
        LIMIT 5
      ) strengths_topics
    ),
    'weaknesses', (
      SELECT jsonb_agg(topic)
      FROM (
        SELECT DISTINCT plo.topic
        FROM phoenix_learning_outcomes plo
        WHERE plo.user_id = p_user_id
        AND plo.mastery_level < 0.5
        AND plo.topic IS NOT NULL
        ORDER BY plo.topic
        LIMIT 5
      ) weaknesses_topics
    ),
    'average_mastery', (
      SELECT ROUND(AVG(plo.mastery_level)::numeric, 2)
      FROM phoenix_learning_outcomes plo
      WHERE plo.user_id = p_user_id
    )
  )
  INTO v_strengths_weaknesses;

  -- 5. INSTRUCTOR NOTES
  SELECT jsonb_agg(
    jsonb_build_object(
      'note', sn.note_text,
      'created_by', sn.created_by,
      'created_at', sn.created_at,
      'category', sn.category
    ) ORDER BY sn.created_at DESC
  )
  INTO v_instructor_notes
  FROM student_notes sn
  WHERE sn.student_id IN (
    SELECT os.id FROM org_students os WHERE os.linked_user_id = p_user_id
  )
  AND sn.created_at >= NOW() - INTERVAL '30 days'
  LIMIT 3;

  -- 6. LEARNING PATTERNS
  SELECT jsonb_build_object(
    'current_streak', get_coach_streak(p_user_id),
    'preferred_study_times', (
      SELECT jsonb_agg(DISTINCT hour_of_day ORDER BY hour_of_day)
      FROM (
        SELECT EXTRACT(HOUR FROM created_at)::int as hour_of_day
        FROM socratic_turns st
        JOIN socratic_sessions ss ON ss.id = st.session_id
        WHERE ss.user_id = p_user_id
        AND st.created_at >= NOW() - INTERVAL '30 days'
        LIMIT 3
      ) hours
    ),
    'avg_session_length_minutes', (
      SELECT ROUND(AVG(
        CASE 
          WHEN array_length(score_history, 1) > 0 THEN array_length(score_history, 1) * 5
          ELSE 0
        END
      )::numeric, 0)
      FROM socratic_sessions
      WHERE user_id = p_user_id
      AND created_at >= NOW() - INTERVAL '30 days'
    ),
    'learning_velocity', (
      SELECT COUNT(DISTINCT topic)::numeric / NULLIF(EXTRACT(EPOCH FROM (MAX(created_at) - MIN(created_at))) / 604800, 0)
      FROM phoenix_learning_outcomes
      WHERE user_id = p_user_id
      AND created_at >= NOW() - INTERVAL '30 days'
    )
  )
  INTO v_learning_patterns;

  -- 7. GAMIFICATION STATUS
  SELECT jsonb_build_object(
    'total_xp', COALESCE(p.total_xp, 0),
    'current_level', COALESCE(p.current_level, 1),
    'recent_achievements', (
      SELECT jsonb_agg(
        jsonb_build_object(
          'name', a.achievement_name,
          'type', a.achievement_type,
          'xp_reward', a.xp_reward,
          'unlocked_at', a.unlocked_at
        ) ORDER BY a.unlocked_at DESC
      )
      FROM achievements a
      WHERE a.user_id = p_user_id
      AND a.unlocked_at >= NOW() - INTERVAL '7 days'
      LIMIT 3
    ),
    'badges_earned', (
      SELECT COUNT(*) FROM achievements WHERE user_id = p_user_id
    )
  )
  INTO v_gamification
  FROM profiles p
  WHERE p.id = p_user_id;

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

  -- 9. AI COACH INSIGHTS
  SELECT jsonb_build_object(
    'total_socratic_sessions', (
      SELECT COUNT(*) FROM socratic_sessions WHERE user_id = p_user_id
    ),
    'favorite_topics', (
      SELECT jsonb_agg(topic ORDER BY cnt DESC)
      FROM (
        SELECT topic, COUNT(*) as cnt
        FROM socratic_sessions
        WHERE user_id = p_user_id
        GROUP BY topic
        ORDER BY cnt DESC
        LIMIT 3
      ) topics
    ),
    'recent_learning_outcomes', (
      SELECT jsonb_agg(
        jsonb_build_object(
          'outcome', plo.outcome_text,
          'topic', plo.topic,
          'mastery_level', plo.mastery_level,
          'created_at', plo.created_at
        ) ORDER BY plo.created_at DESC
      )
      FROM phoenix_learning_outcomes plo
      WHERE plo.user_id = p_user_id
      AND plo.created_at >= NOW() - INTERVAL '7 days'
      LIMIT 3
    ),
    'memory_fragments', (
      SELECT jsonb_agg(
        jsonb_build_object(
          'content', pmf.content,
          'memory_type', pmf.memory_type,
          'relevance_score', pmf.relevance_score
        ) ORDER BY pmf.relevance_score DESC
      )
      FROM phoenix_memory_fragments pmf
      WHERE pmf.user_id = p_user_id
      AND (pmf.expires_at IS NULL OR pmf.expires_at > NOW())
      ORDER BY pmf.relevance_score DESC
      LIMIT 5
    )
  )
  INTO v_ai_coach_insights;

  -- 10. ORGANIZATION CONTEXT
  SELECT jsonb_build_object(
    'is_org_student', EXISTS(SELECT 1 FROM org_students WHERE linked_user_id = p_user_id),
    'org_memberships', (
      SELECT jsonb_agg(
        jsonb_build_object(
          'org_id', om.org_id,
          'org_name', o.name,
          'role', om.role,
          'status', om.status
        )
      )
      FROM org_members om
      JOIN organizations o ON o.id = om.org_id
      WHERE om.user_id = p_user_id
      AND om.status = 'active'
    ),
    'assigned_courses', (
      SELECT COUNT(*) 
      FROM student_course_assignments sca
      WHERE sca.student_id IN (
        SELECT os.id FROM org_students os WHERE os.linked_user_id = p_user_id
      )
    ),
    'group_memberships', (
      SELECT jsonb_agg(
        jsonb_build_object(
          'group_id', ogm.group_id,
          'group_name', og.name
        )
      )
      FROM org_group_members ogm
      JOIN org_groups og ON og.id = ogm.group_id
      WHERE ogm.user_id IN (
        SELECT os.id FROM org_students os WHERE os.linked_user_id = p_user_id
      )
    )
  )
  INTO v_org_context;

  v_result := jsonb_build_object(
    'user_id', p_user_id,
    'generated_at', NOW(),
    'active_courses', COALESCE(v_active_courses, '[]'::jsonb),
    'recent_activity', COALESCE(v_recent_activity, '{}'::jsonb),
    'active_goals', COALESCE(v_active_goals, '[]'::jsonb),
    'strengths_weaknesses', COALESCE(v_strengths_weaknesses, '{}'::jsonb),
    'instructor_notes', COALESCE(v_instructor_notes, '[]'::jsonb),
    'learning_patterns', COALESCE(v_learning_patterns, '{}'::jsonb),
    'gamification', COALESCE(v_gamification, '{}'::jsonb),
    'recent_struggles', COALESCE(v_recent_struggles, '[]'::jsonb),
    'ai_coach_insights', COALESCE(v_ai_coach_insights, '{}'::jsonb),
    'organization_context', COALESCE(v_org_context, '{}'::jsonb)
  );

  RETURN v_result;
END;
$function$;