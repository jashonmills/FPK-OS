-- Create SQL views for SCORM analytics and metrics

-- Latest attempt per enrollment + sco for accurate completion tracking
CREATE OR REPLACE VIEW scorm_latest_attempt AS
SELECT DISTINCT ON (enrollment_id, sco_id)
  enrollment_id, 
  sco_id, 
  user_id, 
  package_id,
  COALESCE(lesson_status::text, completion_status::text) as status,
  COALESCE(score_raw, score_scaled * 100) as score,
  created_at as session_start_time, 
  last_commit_at,
  EXTRACT(epoch FROM (COALESCE(last_commit_at, now()) - created_at)) as seconds
FROM scorm_runtime
ORDER BY enrollment_id, sco_id, created_at DESC;

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
LEFT JOIN scorm_enrollments e ON e.package_id = p.id AND e.status IN ('active','completed')
LEFT JOIN scorm_latest_attempt la ON la.enrollment_id = e.id
GROUP BY p.id, p.title, p.status, p.created_at;

-- Learner progress view for detailed progress tracking
CREATE OR REPLACE VIEW scorm_learner_progress AS
SELECT
  e.id as enrollment_id,
  e.user_id,
  e.package_id,
  p.title as package_title,
  prof.full_name as learner_name,
  prof.display_name,
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

-- Create RLS policies for the views
ALTER VIEW scorm_latest_attempt OWNER TO postgres;
ALTER VIEW scorm_package_metrics OWNER TO postgres;  
ALTER VIEW scorm_learner_progress OWNER TO postgres;