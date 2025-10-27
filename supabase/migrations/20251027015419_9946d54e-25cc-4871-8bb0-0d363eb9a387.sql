
-- Add has_completed_tour column to profiles table
ALTER TABLE public.profiles 
ADD COLUMN has_completed_tour boolean NOT NULL DEFAULT false;

-- Add comment for documentation
COMMENT ON COLUMN public.profiles.has_completed_tour IS 'Tracks whether the user has completed the interactive product tour';
