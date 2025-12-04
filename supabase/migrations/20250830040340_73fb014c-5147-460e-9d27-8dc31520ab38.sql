-- Simple recreation without RLS (views inherit from underlying tables)
DROP VIEW IF EXISTS scorm_learner_progress CASCADE;
DROP VIEW IF EXISTS scorm_package_metrics CASCADE;
DROP VIEW IF EXISTS scorm_latest_attempt CASCADE;

-- Recreate views without RLS (they inherit from underlying tables)
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