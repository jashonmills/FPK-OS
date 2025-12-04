-- Step 1 Final: Fix Security Definer Views - Handle Dependencies Correctly

-- Drop all views with CASCADE to handle dependencies
DROP VIEW IF EXISTS public.scorm_learner_progress CASCADE;
DROP VIEW IF EXISTS public.scorm_package_metrics CASCADE;
DROP VIEW IF EXISTS public.scorm_latest_attempt CASCADE;

-- Recreate scorm_latest_attempt first (no dependencies)
CREATE OR REPLACE VIEW public.scorm_latest_attempt
WITH (security_invoker = true) AS
SELECT DISTINCT ON (scorm_runtime.enrollment_id, scorm_runtime.sco_id) 
    scorm_runtime.enrollment_id,
    scorm_runtime.sco_id,
    scorm_runtime.lesson_status,
    scorm_runtime.completion_status,
    scorm_runtime.score_raw,
    scorm_runtime.score_scaled,
    scorm_runtime.last_commit_at
FROM scorm_runtime
ORDER BY scorm_runtime.enrollment_id, scorm_runtime.sco_id, scorm_runtime.last_commit_at DESC;

-- Recreate scorm_learner_progress (depends on scorm_latest_attempt)
CREATE OR REPLACE VIEW public.scorm_learner_progress
WITH (security_invoker = true) AS
SELECT se.user_id,
    p.full_name AS learner_name,
    sp.title AS package_title,
    sp.id AS package_id,
    se.id AS enrollment_id,
    se.enrolled_at,
    sla.last_commit_at,
    count(ss.id) AS total_scos,
    count(
        CASE
            WHEN ((sla.completion_status = 'completed'::completion_status_2004) OR (sla.lesson_status = ANY (ARRAY['completed'::lesson_status_12, 'passed'::lesson_status_12]))) THEN 1
            ELSE NULL::integer
        END) AS completed_scos,
        CASE
            WHEN (count(ss.id) > 0) THEN (((count(
            CASE
                WHEN ((sla.completion_status = 'completed'::completion_status_2004) OR (sla.lesson_status = ANY (ARRAY['completed'::lesson_status_12, 'passed'::lesson_status_12]))) THEN 1
                ELSE NULL::integer
            END))::double precision / (count(ss.id))::double precision) * (100)::double precision)
            ELSE (0)::double precision
        END AS progress_percentage,
    COALESCE(avg(
        CASE
            WHEN (sla.score_raw IS NOT NULL) THEN sla.score_raw
            ELSE (sla.score_scaled * (100)::numeric)
        END), (0)::numeric) AS avg_score
FROM ((((scorm_enrollments se
     JOIN scorm_packages sp ON ((se.package_id = sp.id)))
     LEFT JOIN profiles p ON ((se.user_id = p.id)))
     LEFT JOIN scorm_scos ss ON ((sp.id = ss.package_id)))
     LEFT JOIN scorm_latest_attempt sla ON (((se.id = sla.enrollment_id) AND (ss.id = sla.sco_id))))
GROUP BY se.user_id, p.full_name, sp.title, sp.id, se.id, se.enrolled_at, sla.last_commit_at;

-- Recreate scorm_package_metrics (depends on scorm_latest_attempt)  
CREATE OR REPLACE VIEW public.scorm_package_metrics
WITH (security_invoker = true) AS
SELECT sp.id,
    sp.title,
    sp.description,
    sp.status,
    sp.created_at,
    count(se.id) AS enrollment_count,
    count(
        CASE
            WHEN ((sla.completion_status = 'completed'::completion_status_2004) OR (sla.lesson_status = ANY (ARRAY['completed'::lesson_status_12, 'passed'::lesson_status_12]))) THEN 1
            ELSE NULL::integer
        END) AS completions,
    COALESCE(avg(
        CASE
            WHEN (sla.score_raw IS NOT NULL) THEN sla.score_raw
            ELSE (sla.score_scaled * (100)::numeric)
        END), (0)::numeric) AS avg_score,
        CASE
            WHEN (count(se.id) > 0) THEN (((count(
            CASE
                WHEN ((sla.completion_status = 'completed'::completion_status_2004) OR (sla.lesson_status = ANY (ARRAY['completed'::lesson_status_12, 'passed'::lesson_status_12]))) THEN 1
                ELSE NULL::integer
            END))::double precision / (count(se.id))::double precision) * (100)::double precision)
            ELSE (0)::double precision
        END AS completion_rate
FROM ((scorm_packages sp
     LEFT JOIN scorm_enrollments se ON ((sp.id = se.package_id)))
     LEFT JOIN scorm_latest_attempt sla ON ((se.id = sla.enrollment_id)))
GROUP BY sp.id, sp.title, sp.description, sp.status, sp.created_at;