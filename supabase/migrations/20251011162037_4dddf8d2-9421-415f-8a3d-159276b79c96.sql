
-- Comprehensive User Deletion Cascade Strategy
-- STEP 1: Clean up orphaned records before adding constraints

-- Clean up orphaned records in analytics_metrics
DELETE FROM public.analytics_metrics
WHERE user_id NOT IN (SELECT id FROM auth.users);

-- Clean up orphaned records in other tables
DELETE FROM public.achievements
WHERE user_id NOT IN (SELECT id FROM auth.users);

DELETE FROM public.activity_log
WHERE user_id NOT IN (SELECT id FROM auth.users);

DELETE FROM public.adaptive_learning_paths
WHERE user_id NOT IN (SELECT id FROM auth.users);

DELETE FROM public.ai_inbox
WHERE user_id IS NOT NULL 
AND user_id NOT IN (SELECT id FROM auth.users);

DELETE FROM public.ai_outputs
WHERE user_id NOT IN (SELECT id FROM auth.users);

DELETE FROM public.ai_recommendations
WHERE user_id NOT IN (SELECT id FROM auth.users);

DELETE FROM public.anomaly_alerts
WHERE user_id NOT IN (SELECT id FROM auth.users);

DELETE FROM public.audit_log
WHERE user_id IS NOT NULL 
AND user_id NOT IN (SELECT id FROM auth.users);

DELETE FROM public.audit_logs
WHERE user_id IS NOT NULL 
AND user_id NOT IN (SELECT id FROM auth.users);

DELETE FROM public.behavioral_analytics
WHERE user_id NOT IN (SELECT id FROM auth.users);

DELETE FROM public.beta_feedback
WHERE user_id IS NOT NULL 
AND user_id NOT IN (SELECT id FROM auth.users);

DELETE FROM public.book_quiz_sessions
WHERE user_id NOT IN (SELECT id FROM auth.users);

DELETE FROM public.chat_sessions
WHERE user_id NOT IN (SELECT id FROM auth.users);

DELETE FROM public.conversation_memory
WHERE user_id NOT IN (SELECT id FROM auth.users);

DELETE FROM public.course_progress
WHERE user_id NOT IN (SELECT id FROM auth.users);

DELETE FROM public.org_members
WHERE user_id NOT IN (SELECT id FROM auth.users);

-- STEP 2: Now add CASCADE constraints for user personal data

ALTER TABLE public.achievements
DROP CONSTRAINT IF EXISTS achievements_user_id_fkey CASCADE;
ALTER TABLE public.achievements
ADD CONSTRAINT achievements_user_id_fkey
FOREIGN KEY (user_id) REFERENCES auth.users (id) ON DELETE CASCADE;

ALTER TABLE public.activity_log
DROP CONSTRAINT IF EXISTS activity_log_user_id_fkey CASCADE;
ALTER TABLE public.activity_log
ADD CONSTRAINT activity_log_user_id_fkey
FOREIGN KEY (user_id) REFERENCES auth.users (id) ON DELETE CASCADE;

ALTER TABLE public.adaptive_learning_paths
DROP CONSTRAINT IF EXISTS adaptive_learning_paths_user_id_fkey CASCADE;
ALTER TABLE public.adaptive_learning_paths
ADD CONSTRAINT adaptive_learning_paths_user_id_fkey
FOREIGN KEY (user_id) REFERENCES auth.users (id) ON DELETE CASCADE;

ALTER TABLE public.ai_inbox
DROP CONSTRAINT IF EXISTS ai_inbox_user_id_fkey CASCADE;
ALTER TABLE public.ai_inbox
ADD CONSTRAINT ai_inbox_user_id_fkey
FOREIGN KEY (user_id) REFERENCES auth.users (id) ON DELETE CASCADE;

ALTER TABLE public.ai_outputs
DROP CONSTRAINT IF EXISTS ai_outputs_user_id_fkey CASCADE;
ALTER TABLE public.ai_outputs
ADD CONSTRAINT ai_outputs_user_id_fkey
FOREIGN KEY (user_id) REFERENCES auth.users (id) ON DELETE CASCADE;

ALTER TABLE public.ai_recommendations
DROP CONSTRAINT IF EXISTS ai_recommendations_user_id_fkey CASCADE;
ALTER TABLE public.ai_recommendations
ADD CONSTRAINT ai_recommendations_user_id_fkey
FOREIGN KEY (user_id) REFERENCES auth.users (id) ON DELETE CASCADE;

ALTER TABLE public.analytics_metrics
DROP CONSTRAINT IF EXISTS analytics_metrics_user_id_fkey CASCADE;
ALTER TABLE public.analytics_metrics
ADD CONSTRAINT analytics_metrics_user_id_fkey
FOREIGN KEY (user_id) REFERENCES auth.users (id) ON DELETE CASCADE;

ALTER TABLE public.anomaly_alerts
DROP CONSTRAINT IF EXISTS anomaly_alerts_user_id_fkey CASCADE;
ALTER TABLE public.anomaly_alerts
ADD CONSTRAINT anomaly_alerts_user_id_fkey
FOREIGN KEY (user_id) REFERENCES auth.users (id) ON DELETE CASCADE;

ALTER TABLE public.audit_log
DROP CONSTRAINT IF EXISTS audit_log_user_id_fkey CASCADE;
ALTER TABLE public.audit_log
ADD CONSTRAINT audit_log_user_id_fkey
FOREIGN KEY (user_id) REFERENCES auth.users (id) ON DELETE CASCADE;

ALTER TABLE public.audit_logs
DROP CONSTRAINT IF EXISTS audit_logs_user_id_fkey CASCADE;
ALTER TABLE public.audit_logs
ADD CONSTRAINT audit_logs_user_id_fkey
FOREIGN KEY (user_id) REFERENCES auth.users (id) ON DELETE CASCADE;

ALTER TABLE public.audit_logs
DROP CONSTRAINT IF EXISTS audit_logs_target_user_id_fkey CASCADE;
ALTER TABLE public.audit_logs
ADD CONSTRAINT audit_logs_target_user_id_fkey
FOREIGN KEY (target_user_id) REFERENCES auth.users (id) ON DELETE SET NULL;

ALTER TABLE public.behavioral_analytics
DROP CONSTRAINT IF EXISTS behavioral_analytics_user_id_fkey CASCADE;
ALTER TABLE public.behavioral_analytics
ADD CONSTRAINT behavioral_analytics_user_id_fkey
FOREIGN KEY (user_id) REFERENCES auth.users (id) ON DELETE CASCADE;

ALTER TABLE public.beta_feedback
DROP CONSTRAINT IF EXISTS beta_feedback_user_id_fkey CASCADE;
ALTER TABLE public.beta_feedback
ADD CONSTRAINT beta_feedback_user_id_fkey
FOREIGN KEY (user_id) REFERENCES auth.users (id) ON DELETE CASCADE;

ALTER TABLE public.book_quiz_sessions
DROP CONSTRAINT IF EXISTS book_quiz_sessions_user_id_fkey CASCADE;
ALTER TABLE public.book_quiz_sessions
ADD CONSTRAINT book_quiz_sessions_user_id_fkey
FOREIGN KEY (user_id) REFERENCES auth.users (id) ON DELETE CASCADE;

ALTER TABLE public.chat_sessions
DROP CONSTRAINT IF EXISTS chat_sessions_user_id_fkey CASCADE;
ALTER TABLE public.chat_sessions
ADD CONSTRAINT chat_sessions_user_id_fkey
FOREIGN KEY (user_id) REFERENCES auth.users (id) ON DELETE CASCADE;

ALTER TABLE public.conversation_memory
DROP CONSTRAINT IF EXISTS conversation_memory_user_id_fkey CASCADE;
ALTER TABLE public.conversation_memory
ADD CONSTRAINT conversation_memory_user_id_fkey
FOREIGN KEY (user_id) REFERENCES auth.users (id) ON DELETE CASCADE;

ALTER TABLE public.course_progress
DROP CONSTRAINT IF EXISTS course_progress_user_id_fkey CASCADE;
ALTER TABLE public.course_progress
ADD CONSTRAINT course_progress_user_id_fkey
FOREIGN KEY (user_id) REFERENCES auth.users (id) ON DELETE CASCADE;

ALTER TABLE public.org_members
DROP CONSTRAINT IF EXISTS org_members_user_id_fkey CASCADE;
ALTER TABLE public.org_members
ADD CONSTRAINT org_members_user_id_fkey
FOREIGN KEY (user_id) REFERENCES auth.users (id) ON DELETE CASCADE;

-- STEP 3: SET NULL for organizational references (already done in previous migration for some)

ALTER TABLE public.organizations
DROP CONSTRAINT IF EXISTS organizations_owner_id_fkey CASCADE;
ALTER TABLE public.organizations
ADD CONSTRAINT organizations_owner_id_fkey
FOREIGN KEY (owner_id) REFERENCES auth.users (id) ON DELETE SET NULL;

ALTER TABLE public.organizations
DROP CONSTRAINT IF EXISTS organizations_created_by_fkey CASCADE;
ALTER TABLE public.organizations
ADD CONSTRAINT organizations_created_by_fkey
FOREIGN KEY (created_by) REFERENCES auth.users (id) ON DELETE SET NULL;

ALTER TABLE public.contact_submissions
DROP CONSTRAINT IF EXISTS contact_submissions_user_id_fkey CASCADE;
ALTER TABLE public.contact_submissions
ADD CONSTRAINT contact_submissions_user_id_fkey
FOREIGN KEY (user_id) REFERENCES auth.users (id) ON DELETE SET NULL;

ALTER TABLE public.coupon_codes
DROP CONSTRAINT IF EXISTS coupon_codes_created_by_fkey CASCADE;
ALTER TABLE public.coupon_codes
ADD CONSTRAINT coupon_codes_created_by_fkey
FOREIGN KEY (created_by) REFERENCES auth.users (id) ON DELETE SET NULL;
