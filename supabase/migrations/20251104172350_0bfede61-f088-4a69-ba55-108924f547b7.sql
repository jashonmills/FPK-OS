-- Fix foreign key relationships for time tracking tables
-- Change user_id to reference profiles instead of auth.users

-- Drop existing foreign keys on time_entries
ALTER TABLE public.time_entries 
  DROP CONSTRAINT IF EXISTS time_entries_user_id_fkey;

-- Add new foreign key to profiles
ALTER TABLE public.time_entries
  ADD CONSTRAINT time_entries_user_id_fkey 
  FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

-- Drop existing foreign keys on active_time_sessions
ALTER TABLE public.active_time_sessions 
  DROP CONSTRAINT IF EXISTS active_time_sessions_user_id_fkey;

-- Add new foreign key to profiles
ALTER TABLE public.active_time_sessions
  ADD CONSTRAINT active_time_sessions_user_id_fkey 
  FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;