-- Add email column to profiles table for contact purposes
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS email text;

-- Add a comment to clarify this is the contact email (different from auth email)
COMMENT ON COLUMN public.profiles.email IS 'Contact email address visible to organization members';