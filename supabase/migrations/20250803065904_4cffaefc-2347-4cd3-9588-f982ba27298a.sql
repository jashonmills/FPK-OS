-- Fix the leaderboard database relationships and ensure all users have XP records

-- First, ensure the user_xp table exists and has proper structure
CREATE TABLE IF NOT EXISTS public.user_xp (
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  total_xp INTEGER NOT NULL DEFAULT 0,
  current_level INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id)
);

-- Enable RLS on user_xp table
ALTER TABLE public.user_xp ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for user_xp
CREATE POLICY "Users can view all user XP for leaderboard" 
ON public.user_xp 
FOR SELECT 
USING (true);

CREATE POLICY "Users can insert their own XP" 
ON public.user_xp 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own XP" 
ON public.user_xp 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Create indexes for better leaderboard performance
CREATE INDEX IF NOT EXISTS idx_user_xp_total_xp ON public.user_xp(total_xp DESC);
CREATE INDEX IF NOT EXISTS idx_user_xp_level ON public.user_xp(current_level DESC);

-- Initialize user_xp records for all existing users who don't have them
INSERT INTO public.user_xp (user_id, total_xp, current_level)
SELECT 
  p.id,
  0,
  1
FROM public.profiles p
LEFT JOIN public.user_xp ux ON p.id = ux.user_id
WHERE ux.user_id IS NULL;

-- Create a function to calculate level from XP (reusing existing function)
-- This ensures consistency with the existing XP system

-- Create a trigger to automatically create user_xp records for new users
CREATE OR REPLACE FUNCTION public.handle_new_user_xp()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_xp (user_id, total_xp, current_level)
  VALUES (NEW.id, 0, 1);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user profiles
DROP TRIGGER IF EXISTS on_new_user_xp ON public.profiles;
CREATE TRIGGER on_new_user_xp
  AFTER INSERT ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_xp();