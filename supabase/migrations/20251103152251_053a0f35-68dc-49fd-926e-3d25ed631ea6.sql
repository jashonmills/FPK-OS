-- Make task_id nullable in time_entries table to allow project-level time tracking
ALTER TABLE public.time_entries 
ALTER COLUMN task_id DROP NOT NULL;