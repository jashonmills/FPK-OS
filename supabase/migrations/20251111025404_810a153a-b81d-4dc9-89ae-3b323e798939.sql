-- Add caption_style column to messages table to store formatting preferences
ALTER TABLE public.messages 
ADD COLUMN caption_style JSONB DEFAULT NULL;