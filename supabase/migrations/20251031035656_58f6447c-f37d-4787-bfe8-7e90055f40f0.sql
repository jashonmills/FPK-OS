-- Add support for message mentions in notifications table
-- Update the notifications table to allow task_id to be nullable for message notifications
ALTER TABLE public.notifications ALTER COLUMN task_id DROP NOT NULL;

-- Add metadata column for storing additional notification data like message_id and conversation_id
ALTER TABLE public.notifications ADD COLUMN IF NOT EXISTS metadata jsonb DEFAULT '{}'::jsonb;