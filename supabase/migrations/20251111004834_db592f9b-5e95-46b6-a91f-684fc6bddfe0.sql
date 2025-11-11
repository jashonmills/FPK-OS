-- Add soft delete columns to messages table
ALTER TABLE public.messages 
ADD COLUMN is_deleted BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN deleted_at TIMESTAMP WITH TIME ZONE;

-- Create index for faster queries on deleted messages
CREATE INDEX idx_messages_is_deleted ON public.messages(is_deleted);