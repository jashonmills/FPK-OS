-- Create SQL views for SCORM analytics and metrics (fixed)

-- Latest attempt per enrollment + sco for accurate completion tracking
CREATE OR REPLACE VIEW scorm_latest_attempt AS
SELECT DISTINCT ON (enrollment_id, sco_id)
  rt.enrollment_id, 
  rt.sco_id, 
  e.user_id,
  rt.package_id,
  COALESCE(rt.lesson_status::text, rt.completion_status::text) as status,
  COALESCE(rt.score_raw, rt.score_scaled * 100) as score,
  rt.created_at as session_start_time, 
  rt.last_commit_at,
  EXTRACT(epoch FROM (COALESCE(rt.last_commit_at, now()) - rt.created_at)) as seconds
FROM scorm_runtime rt
JOIN scorm_enrollments e ON e.id = rt.enrollment_id
ORDER BY rt.enrollment_id, rt.sco_id, rt.created_at DESC;

-- Package-level rollups for analytics dashboard
CREATE OR REPLACE VIEW scorm_package_metrics AS
SELECT
  p.id as package_id,
  p.title,
  p.status as package_status,
  p.created_at,
  COUNT(DISTINCT e.id) as enrollments,
  COUNT(DISTINCT CASE WHEN la.status IN ('completed','passed') THEN la.enrollment_id END) as completions,
  ROUND(100.0 * COUNT(DISTINCT CASE WHEN la.status IN ('completed','passed') THEN la.enrollment_id END) / NULLIF(COUNT(DISTINCT e.id),0)) as completion_rate,
  ROUND(AVG(NULLIF(la.score,0))) as avg_score,
  COALESCE(ROUND(AVG(la.seconds) / 60.0),0) as avg_minutes
FROM scorm_packages p
LEFT JOIN scorm_enrollments e ON e.package_id = p.id
LEFT JOIN scorm_latest_attempt la ON la.enrollment_id = e.id
GROUP BY p.id, p.title, p.status, p.created_at;

-- Learner progress view for detailed progress tracking
CREATE OR REPLACE VIEW scorm_learner_progress AS
SELECT
  e.id as enrollment_id,
  e.user_id,
  e.package_id,
  p.title as package_title,
  COALESCE(prof.full_name, prof.display_name, 'Unknown User') as learner_name,
  COUNT(s.id) as sco_count,
  COUNT(DISTINCT CASE WHEN la.status IN ('completed','passed') THEN la.sco_id END) as sco_completed,
  ROUND(100.0 * COUNT(DISTINCT CASE WHEN la.status IN ('completed','passed') THEN la.sco_id END) / NULLIF(COUNT(s.id),0)) as progress_pct,
  MAX(la.last_commit_at) as last_activity,
  e.created_at as enrolled_at
FROM scorm_enrollments e
JOIN scorm_packages p ON p.id = e.package_id
LEFT JOIN profiles prof ON prof.id = e.user_id
LEFT JOIN scorm_scos s ON s.package_id = p.id AND s.is_launchable = true
LEFT JOIN scorm_latest_attempt la ON la.enrollment_id = e.id AND la.sco_id = s.id
GROUP BY e.id, e.user_id, e.package_id, p.title, prof.full_name, prof.display_name, e.created_at;