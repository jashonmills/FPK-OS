-- Add caption field to messages table for image descriptions
ALTER TABLE public.messages 
ADD COLUMN image_caption text;