-- Phase 2A: Add Task Types to tasks table
CREATE TYPE task_type AS ENUM ('story', 'bug', 'epic', 'chore');

ALTER TABLE tasks 
ADD COLUMN type task_type NOT NULL DEFAULT 'story';

CREATE INDEX idx_tasks_type ON tasks(type);

-- Phase 2B: Create notifications table
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  recipient_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  task_id UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  content TEXT NOT NULL,
  comment_id UUID REFERENCES task_comments(id) ON DELETE CASCADE,
  read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_notifications_recipient ON notifications(recipient_id, read);
CREATE INDEX idx_notifications_task ON notifications(task_id);

-- Enable Row Level Security
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- RLS Policies for notifications
CREATE POLICY "Users can view their own notifications"
  ON notifications FOR SELECT
  USING (auth.uid() = recipient_id);

CREATE POLICY "System can create notifications"
  ON notifications FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can update their own notifications"
  ON notifications FOR UPDATE
  USING (auth.uid() = recipient_id);

-- Add avatar_url to profiles for better mention UX
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS avatar_url TEXT;