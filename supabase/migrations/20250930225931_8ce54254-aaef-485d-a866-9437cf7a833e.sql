-- Add restrict_general_chat column to organizations table
ALTER TABLE public.organizations 
ADD COLUMN IF NOT EXISTS restrict_general_chat BOOLEAN DEFAULT false;