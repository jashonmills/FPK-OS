-- Add new columns to profiles table
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS full_name TEXT,
ADD COLUMN IF NOT EXISTS professional_title TEXT,
ADD COLUMN IF NOT EXISTS organization_name TEXT,
ADD COLUMN IF NOT EXISTS bio TEXT,
ADD COLUMN IF NOT EXISTS has_completed_profile_setup BOOLEAN DEFAULT false;

-- Update existing profiles to mark them as having completed setup
UPDATE public.profiles
SET has_completed_profile_setup = true
WHERE display_name IS NOT NULL;