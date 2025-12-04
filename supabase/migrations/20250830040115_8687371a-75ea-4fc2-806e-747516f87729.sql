-- Fix the SECURITY DEFINER views by recreating them without SECURITY DEFINER
-- Drop all views with CASCADE to handle dependencies
DROP VIEW IF EXISTS scorm_learner_progress CASCADE;
DROP VIEW IF EXISTS scorm_package_metrics CASCADE;
DROP VIEW IF EXISTS scorm_latest_attempt CASCADE;

-- Recreate views without SECURITY DEFINER
CREATE VIEW scorm_latest_attempt AS
SELECT DISTINCT ON (enrollment_id, sco_id)
  enrollment_id,
  sco_id,
  lesson_status,
  completion_status,
  score_raw,
  score_scaled,
  last_commit_at
FROM scorm_runtime 
ORDER BY enrollment_id, sco_id, last_commit_at DESC;

-- Enable RLS on the view
ALTER VIEW scorm_latest_attempt ENABLE ROW LEVEL SECURITY;

-- Create RLS policy for the view
CREATE POLICY "Users can view their own attempts" ON scorm_latest_attempt
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM scorm_enrollments se 
    WHERE se.id = scorm_latest_attempt.enrollment_id 
    AND se.user_id = auth.uid()
  )
);

CREATE VIEW scorm_package_metrics AS
SELECT 
  sp.id,
  sp.title,
  sp.description,
  sp.status,
  sp.created_at,
  COUNT(se.id) as enrollment_count,
  COUNT(CASE WHEN sla.completion_status = 'completed' OR sla.lesson_status IN ('completed', 'passed') THEN 1 END) as completions,
  COALESCE(AVG(CASE WHEN sla.score_raw IS NOT NULL THEN sla.score_raw ELSE sla.score_scaled * 100 END), 0) as avg_score,
  CASE 
    WHEN COUNT(se.id) > 0 THEN 
      (COUNT(CASE WHEN sla.completion_status = 'completed' OR sla.lesson_status IN ('completed', 'passed') THEN 1 END)::float / COUNT(se.id) * 100)
    ELSE 0 
  END as completion_rate
FROM scorm_packages sp
LEFT JOIN scorm_enrollments se ON sp.id = se.package_id
LEFT JOIN scorm_latest_attempt sla ON se.id = sla.enrollment_id
GROUP BY sp.id, sp.title, sp.description, sp.status, sp.created_at;

-- Enable RLS on the view
ALTER VIEW scorm_package_metrics ENABLE ROW LEVEL SECURITY;

-- Create RLS policy for the view
CREATE POLICY "Anyone can view package metrics" ON scorm_package_metrics
FOR SELECT USING (true);

CREATE VIEW scorm_learner_progress AS
SELECT 
  se.user_id,
  p.full_name as learner_name,
  sp.title as package_title,
  sp.id as package_id,
  se.id as enrollment_id,
  se.enrolled_at,
  sla.last_commit_at,
  COUNT(ss.id) as total_scos,
  COUNT(CASE WHEN sla.completion_status = 'completed' OR sla.lesson_status IN ('completed', 'passed') THEN 1 END) as completed_scos,
  CASE 
    WHEN COUNT(ss.id) > 0 THEN 
      (COUNT(CASE WHEN sla.completion_status = 'completed' OR sla.lesson_status IN ('completed', 'passed') THEN 1 END)::float / COUNT(ss.id) * 100)
    ELSE 0 
  END as progress_percentage,
  COALESCE(AVG(CASE WHEN sla.score_raw IS NOT NULL THEN sla.score_raw ELSE sla.score_scaled * 100 END), 0) as avg_score
FROM scorm_enrollments se
JOIN scorm_packages sp ON se.package_id = sp.id
LEFT JOIN profiles p ON se.user_id = p.id
LEFT JOIN scorm_scos ss ON sp.id = ss.package_id
LEFT JOIN scorm_latest_attempt sla ON se.id = sla.enrollment_id AND ss.id = sla.sco_id
GROUP BY se.user_id, p.full_name, sp.title, sp.id, se.id, se.enrolled_at, sla.last_commit_at;

-- Enable RLS on the view
ALTER VIEW scorm_learner_progress ENABLE ROW LEVEL SECURITY;

-- Create RLS policy for the view - users can only see their own progress unless they're admin
CREATE POLICY "Users can view their own progress" ON scorm_learner_progress
FOR SELECT USING (user_id = auth.uid() OR has_role(auth.uid(), 'admin'::app_role));