-- Add column to track AI moderation deletions
ALTER TABLE messages 
ADD COLUMN IF NOT EXISTS deleted_by_ai BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS moderation_reason TEXT;

-- Allow content to be nullable for deleted messages
ALTER TABLE messages ALTER COLUMN content DROP NOT NULL;