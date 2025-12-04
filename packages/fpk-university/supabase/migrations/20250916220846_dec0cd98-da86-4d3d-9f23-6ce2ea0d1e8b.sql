-- Update RLS policies for analytics tables to support role-based access

-- Drop existing policies to recreate with proper role support
DROP POLICY IF EXISTS "Users can manage their own slide analytics" ON slide_analytics;
DROP POLICY IF EXISTS "Users can manage their own behavioral analytics" ON behavioral_analytics;
DROP POLICY IF EXISTS "Users can view their own learning paths" ON adaptive_learning_paths;
DROP POLICY IF EXISTS "Users can view their own recommendations" ON ai_recommendations;
DROP POLICY IF EXISTS "Users can manage their detailed progress" ON lesson_progress_detailed;

DROP POLICY IF EXISTS "Admins can view all analytics" ON slide_analytics;
DROP POLICY IF EXISTS "Admins can view all behavioral data" ON behavioral_analytics;
DROP POLICY IF EXISTS "Admins can view all learning paths" ON adaptive_learning_paths;
DROP POLICY IF EXISTS "Admins can manage all recommendations" ON ai_recommendations;
DROP POLICY IF EXISTS "Admins can view all detailed progress" ON lesson_progress_detailed;

-- Enhanced policies for slide_analytics
CREATE POLICY "Users can manage their own slide analytics" ON slide_analytics
FOR ALL USING (user_id = auth.uid());

CREATE POLICY "Admins can view all slide analytics" ON slide_analytics
FOR SELECT USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Organization members can view org slide analytics" ON slide_analytics
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM org_members om
    JOIN enrollments e ON e.user_id = slide_analytics.user_id
    JOIN courses c ON c.id = e.course_id
    WHERE om.user_id = auth.uid()
    AND om.status = 'active'
    AND (om.role IN ('owner', 'instructor') OR c.organization_id = om.org_id)
  )
);

-- Enhanced policies for behavioral_analytics
CREATE POLICY "Users can manage their own behavioral analytics" ON behavioral_analytics
FOR ALL USING (user_id = auth.uid());

CREATE POLICY "Admins can view all behavioral analytics" ON behavioral_analytics
FOR SELECT USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Organization members can view org behavioral analytics" ON behavioral_analytics
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM org_members om
    JOIN profiles p ON p.id = behavioral_analytics.user_id
    WHERE om.user_id = auth.uid()
    AND om.status = 'active'
    AND om.role IN ('owner', 'instructor')
    -- Additional context-based filtering could be added here
  )
);

-- Enhanced policies for lesson_progress_detailed
CREATE POLICY "Users can manage their detailed progress" ON lesson_progress_detailed
FOR ALL USING (user_id = auth.uid());

CREATE POLICY "Admins can view all detailed progress" ON lesson_progress_detailed
FOR SELECT USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Organization members can view org detailed progress" ON lesson_progress_detailed
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM org_members om
    JOIN enrollments e ON e.user_id = lesson_progress_detailed.user_id
    JOIN courses c ON c.id = e.course_id
    WHERE om.user_id = auth.uid()
    AND om.status = 'active'
    AND (om.role IN ('owner', 'instructor') OR c.organization_id = om.org_id)
  )
);

-- Enhanced policies for adaptive_learning_paths
CREATE POLICY "Users can manage their learning paths" ON adaptive_learning_paths
FOR ALL USING (user_id = auth.uid());

CREATE POLICY "Admins can view all learning paths" ON adaptive_learning_paths
FOR SELECT USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Organization leaders can view org learning paths" ON adaptive_learning_paths
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM org_members om
    WHERE om.user_id = auth.uid()
    AND om.status = 'active'
    AND om.role IN ('owner', 'instructor')
    -- Could add org-specific filtering based on user's org membership
  )
);

-- Enhanced policies for ai_recommendations
CREATE POLICY "Users can view their own recommendations" ON ai_recommendations
FOR ALL USING (user_id = auth.uid());

CREATE POLICY "Admins can manage all recommendations" ON ai_recommendations
FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Organization leaders can view org recommendations" ON ai_recommendations
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM org_members om
    WHERE om.user_id = auth.uid()
    AND om.status = 'active'
    AND om.role IN ('owner', 'instructor')
  )
);

-- Create analytics aggregation views for different user roles
CREATE OR REPLACE VIEW public.org_analytics_summary AS
SELECT 
  om.org_id,
  COUNT(DISTINCT sa.user_id) as active_learners,
  AVG(sa.attention_score) as avg_attention_score,
  AVG(sa.cognitive_load_indicator) as avg_cognitive_load,
  COUNT(sa.id) as total_slide_interactions,
  AVG(sa.duration_seconds) as avg_slide_duration
FROM slide_analytics sa
JOIN org_members om ON om.user_id = sa.user_id
WHERE om.status = 'active'
  AND sa.timestamp >= NOW() - INTERVAL '30 days'
GROUP BY om.org_id;

-- RLS for the org analytics summary view
ALTER VIEW public.org_analytics_summary SET (security_invoker = true);

CREATE POLICY "Organization members can view their org summary" ON org_analytics_summary
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM org_members om
    WHERE om.user_id = auth.uid()
    AND om.org_id = org_analytics_summary.org_id
    AND om.status = 'active'
    AND om.role IN ('owner', 'instructor')
  )
);

-- Create learner analytics summary for instructors
CREATE OR REPLACE VIEW public.learner_analytics_overview AS
SELECT 
  sa.user_id,
  p.id as profile_id,
  COUNT(DISTINCT sa.slide_id) as slides_viewed,
  AVG(sa.attention_score) as avg_attention,
  AVG(sa.cognitive_load_indicator) as avg_cognitive_load,
  SUM(sa.duration_seconds) as total_study_time,
  MAX(sa.timestamp) as last_activity,
  COUNT(CASE WHEN sa.completion_status = 'completed' THEN 1 END) as slides_completed
FROM slide_analytics sa
JOIN profiles p ON p.id = sa.user_id
WHERE sa.timestamp >= NOW() - INTERVAL '7 days'
GROUP BY sa.user_id, p.id;

ALTER VIEW public.learner_analytics_overview SET (security_invoker = true);

CREATE POLICY "Users can view their own learner overview" ON learner_analytics_overview
FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Admins can view all learner overviews" ON learner_analytics_overview
FOR SELECT USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Instructors can view org learner overviews" ON learner_analytics_overview
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM org_members om
    JOIN org_members learner_om ON learner_om.user_id = learner_analytics_overview.user_id
    WHERE om.user_id = auth.uid()
    AND om.org_id = learner_om.org_id
    AND om.status = 'active'
    AND learner_om.status = 'active'
    AND om.role IN ('owner', 'instructor')
  )
);

-- Function to get analytics based on user role
CREATE OR REPLACE FUNCTION public.get_analytics_for_user(
  p_user_id UUID DEFAULT auth.uid(),
  p_scope TEXT DEFAULT 'personal', -- 'personal', 'organization', 'admin'
  p_org_id UUID DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  result JSONB := '{}';
  user_role TEXT;
  is_admin BOOLEAN := false;
  is_org_leader BOOLEAN := false;
BEGIN
  -- Check user permissions
  SELECT has_role(p_user_id, 'admin'::app_role) INTO is_admin;
  
  SELECT EXISTS (
    SELECT 1 FROM org_members 
    WHERE user_id = p_user_id 
    AND status = 'active' 
    AND role IN ('owner', 'instructor')
    AND (p_org_id IS NULL OR org_id = p_org_id)
  ) INTO is_org_leader;

  IF p_scope = 'admin' AND is_admin THEN
    -- Admin gets global analytics
    SELECT jsonb_build_object(
      'total_users', COUNT(DISTINCT user_id),
      'total_slides_viewed', COUNT(*),
      'avg_attention_score', AVG(attention_score),
      'avg_cognitive_load', AVG(cognitive_load_indicator),
      'completion_rate', 
        COUNT(CASE WHEN completion_status = 'completed' THEN 1 END)::float / 
        NULLIF(COUNT(*), 0) * 100
    )
    FROM slide_analytics 
    WHERE timestamp >= NOW() - INTERVAL '30 days'
    INTO result;
    
  ELSIF p_scope = 'organization' AND (is_admin OR is_org_leader) THEN
    -- Organization leaders get org-specific analytics
    SELECT jsonb_build_object(
      'org_learners', COUNT(DISTINCT sa.user_id),
      'total_slides', COUNT(sa.*),
      'avg_attention', AVG(sa.attention_score),
      'avg_cognitive_load', AVG(sa.cognitive_load_indicator),
      'study_time_hours', SUM(sa.duration_seconds) / 3600.0,
      'completion_rate',
        COUNT(CASE WHEN sa.completion_status = 'completed' THEN 1 END)::float / 
        NULLIF(COUNT(sa.*), 0) * 100
    )
    FROM slide_analytics sa
    JOIN org_members om ON om.user_id = sa.user_id
    WHERE (p_org_id IS NULL OR om.org_id = p_org_id)
    AND om.status = 'active'
    AND sa.timestamp >= NOW() - INTERVAL '30 days'
    INTO result;
    
  ELSE
    -- Personal analytics for the user
    SELECT jsonb_build_object(
      'slides_viewed', COUNT(*),
      'slides_completed', COUNT(CASE WHEN completion_status = 'completed' THEN 1 END),
      'avg_attention_score', AVG(attention_score),
      'avg_cognitive_load', AVG(cognitive_load_indicator),
      'total_study_time', SUM(duration_seconds),
      'learning_sessions', COUNT(DISTINCT DATE(timestamp)),
      'improvement_trend', 
        (AVG(CASE WHEN timestamp >= NOW() - INTERVAL '7 days' THEN attention_score END) - 
         AVG(CASE WHEN timestamp < NOW() - INTERVAL '7 days' THEN attention_score END))
    )
    FROM slide_analytics
    WHERE user_id = p_user_id
    AND timestamp >= NOW() - INTERVAL '30 days'
    INTO result;
  END IF;

  RETURN COALESCE(result, '{}');
END;
$$;