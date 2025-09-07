-- Add missing updated_at column to organizations table (if it doesn't exist)
ALTER TABLE public.organizations 
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT now();