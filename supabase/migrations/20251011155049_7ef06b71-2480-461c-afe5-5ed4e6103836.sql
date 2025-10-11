-- Fix foreign key constraints to allow user deletion
-- This enables CASCADE delete for user-owned data so deleting a user
-- from auth.users automatically cleans up related records

-- profiles: The profile should be deleted when user is deleted
ALTER TABLE public.profiles
  DROP CONSTRAINT IF EXISTS profiles_id_fkey;

ALTER TABLE public.profiles
  ADD CONSTRAINT profiles_id_fkey 
  FOREIGN KEY (id) 
  REFERENCES auth.users(id) 
  ON DELETE CASCADE;

-- org_members: Remove member records when user is deleted
ALTER TABLE public.org_members
  DROP CONSTRAINT IF EXISTS org_members_user_id_fkey;

ALTER TABLE public.org_members
  ADD CONSTRAINT org_members_user_id_fkey 
  FOREIGN KEY (user_id) 
  REFERENCES auth.users(id) 
  ON DELETE CASCADE;

-- user_roles: Remove role assignments when user is deleted
ALTER TABLE public.user_roles
  DROP CONSTRAINT IF EXISTS user_roles_user_id_fkey;

ALTER TABLE public.user_roles
  ADD CONSTRAINT user_roles_user_id_fkey 
  FOREIGN KEY (user_id) 
  REFERENCES auth.users(id) 
  ON DELETE CASCADE;

-- enrollments: Remove enrollments when user is deleted
ALTER TABLE public.enrollments
  DROP CONSTRAINT IF EXISTS enrollments_user_id_fkey;

ALTER TABLE public.enrollments
  ADD CONSTRAINT enrollments_user_id_fkey 
  FOREIGN KEY (user_id) 
  REFERENCES auth.users(id) 
  ON DELETE CASCADE;

-- notes: Remove notes when user is deleted
ALTER TABLE public.notes
  DROP CONSTRAINT IF EXISTS notes_user_id_fkey;

ALTER TABLE public.notes
  ADD CONSTRAINT notes_user_id_fkey 
  FOREIGN KEY (user_id) 
  REFERENCES auth.users(id) 
  ON DELETE CASCADE;

-- goals: Remove goals when user is deleted
ALTER TABLE public.goals
  DROP CONSTRAINT IF EXISTS goals_user_id_fkey;

ALTER TABLE public.goals
  ADD CONSTRAINT goals_user_id_fkey 
  FOREIGN KEY (user_id) 
  REFERENCES auth.users(id) 
  ON DELETE CASCADE;

-- flashcards: Remove flashcards when user is deleted
ALTER TABLE public.flashcards
  DROP CONSTRAINT IF EXISTS flashcards_user_id_fkey;

ALTER TABLE public.flashcards
  ADD CONSTRAINT flashcards_user_id_fkey 
  FOREIGN KEY (user_id) 
  REFERENCES auth.users(id) 
  ON DELETE CASCADE;

-- chat_sessions: Remove chat sessions when user is deleted
ALTER TABLE public.chat_sessions
  DROP CONSTRAINT IF EXISTS chat_sessions_user_id_fkey;

ALTER TABLE public.chat_sessions
  ADD CONSTRAINT chat_sessions_user_id_fkey 
  FOREIGN KEY (user_id) 
  REFERENCES auth.users(id) 
  ON DELETE CASCADE;

-- reading_sessions: Remove reading sessions when user is deleted
ALTER TABLE public.reading_sessions
  DROP CONSTRAINT IF EXISTS reading_sessions_user_id_fkey;

ALTER TABLE public.reading_sessions
  ADD CONSTRAINT reading_sessions_user_id_fkey 
  FOREIGN KEY (user_id) 
  REFERENCES auth.users(id) 
  ON DELETE CASCADE;

-- study_sessions: Remove study sessions when user is deleted
ALTER TABLE public.study_sessions
  DROP CONSTRAINT IF EXISTS study_sessions_user_id_fkey;

ALTER TABLE public.study_sessions
  ADD CONSTRAINT study_sessions_user_id_fkey 
  FOREIGN KEY (user_id) 
  REFERENCES auth.users(id) 
  ON DELETE CASCADE;

-- user_xp: Remove XP records when user is deleted
ALTER TABLE public.user_xp
  DROP CONSTRAINT IF EXISTS user_xp_user_id_fkey;

ALTER TABLE public.user_xp
  ADD CONSTRAINT user_xp_user_id_fkey 
  FOREIGN KEY (user_id) 
  REFERENCES auth.users(id) 
  ON DELETE CASCADE;

-- user_badges: Remove badges when user is deleted
ALTER TABLE public.user_badges
  DROP CONSTRAINT IF EXISTS user_badges_user_id_fkey;

ALTER TABLE public.user_badges
  ADD CONSTRAINT user_badges_user_id_fkey 
  FOREIGN KEY (user_id) 
  REFERENCES auth.users(id) 
  ON DELETE CASCADE;

-- For audit logs, use SET NULL to preserve records but remove user reference
ALTER TABLE public.audit_log
  DROP CONSTRAINT IF EXISTS audit_log_user_id_fkey;

ALTER TABLE public.audit_log
  ADD CONSTRAINT audit_log_user_id_fkey 
  FOREIGN KEY (user_id) 
  REFERENCES auth.users(id) 
  ON DELETE SET NULL;

ALTER TABLE public.audit_logs
  DROP CONSTRAINT IF EXISTS audit_logs_user_id_fkey;

ALTER TABLE public.audit_logs
  ADD CONSTRAINT audit_logs_user_id_fkey 
  FOREIGN KEY (user_id) 
  REFERENCES auth.users(id) 
  ON DELETE SET NULL;

ALTER TABLE public.audit_logs
  DROP CONSTRAINT IF EXISTS audit_logs_target_user_id_fkey;

ALTER TABLE public.audit_logs
  ADD CONSTRAINT audit_logs_target_user_id_fkey 
  FOREIGN KEY (target_user_id) 
  REFERENCES auth.users(id) 
  ON DELETE SET NULL;