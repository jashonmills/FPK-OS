-- Add title, phone_number, and timezone fields to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS title TEXT,
ADD COLUMN IF NOT EXISTS phone_number TEXT,
ADD COLUMN IF NOT EXISTS timezone TEXT DEFAULT 'America/New_York';