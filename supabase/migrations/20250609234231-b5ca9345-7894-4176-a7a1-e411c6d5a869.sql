
-- First, ensure the profiles table has the required XP tracking columns
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS total_xp integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS current_streak integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS last_activity_date date DEFAULT CURRENT_DATE;

-- Create achievements table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.achievements (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users NOT NULL,
  achievement_type text NOT NULL,
  achievement_name text NOT NULL,
  xp_reward integer NOT NULL DEFAULT 0,
  unlocked_at timestamp with time zone NOT NULL DEFAULT now(),
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Create goals table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.goals (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL DEFAULT 'learning',
  priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
  target_date DATE,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'completed', 'paused', 'cancelled')),
  progress INTEGER NOT NULL DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  milestones JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE
);

-- Add Row Level Security (RLS) policies for achievements table
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist and recreate them
DROP POLICY IF EXISTS "Users can view their own achievements" ON public.achievements;
CREATE POLICY "Users can view their own achievements" 
  ON public.achievements 
  FOR SELECT 
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can create their own achievements" ON public.achievements;
CREATE POLICY "Users can create their own achievements" 
  ON public.achievements 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Add Row Level Security (RLS) policies for goals table
ALTER TABLE public.goals ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own goals" ON public.goals;
CREATE POLICY "Users can view their own goals" 
  ON public.goals 
  FOR SELECT 
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can create their own goals" ON public.goals;
CREATE POLICY "Users can create their own goals" 
  ON public.goals 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own goals" ON public.goals;
CREATE POLICY "Users can update their own goals" 
  ON public.goals 
  FOR UPDATE 
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own goals" ON public.goals;
CREATE POLICY "Users can delete their own goals" 
  ON public.goals 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_achievements_user_id ON public.achievements(user_id);
CREATE INDEX IF NOT EXISTS idx_achievements_type ON public.achievements(achievement_type);
CREATE INDEX IF NOT EXISTS idx_goals_user_id_status ON public.goals(user_id, status);
CREATE INDEX IF NOT EXISTS idx_goals_target_date ON public.goals(target_date) WHERE target_date IS NOT NULL;

-- Create trigger for goals updated_at (only if function doesn't exist)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'update_updated_at_column') THEN
        CREATE OR REPLACE FUNCTION update_updated_at_column()
        RETURNS TRIGGER AS $func$
        BEGIN
            NEW.updated_at = now();
            RETURN NEW;
        END;
        $func$ language 'plpgsql';
    END IF;
END
$$;

DROP TRIGGER IF EXISTS update_goals_updated_at ON public.goals;
CREATE TRIGGER update_goals_updated_at 
    BEFORE UPDATE ON public.goals 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();
