
-- Create XP events table to track all XP-earning activities
CREATE TABLE public.xp_events (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  event_type text NOT NULL,
  event_value integer NOT NULL DEFAULT 0,
  metadata jsonb DEFAULT '{}',
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Create user XP table to track current XP and level
CREATE TABLE public.user_xp (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  total_xp integer NOT NULL DEFAULT 0,
  level integer NOT NULL DEFAULT 1,
  next_level_xp integer NOT NULL DEFAULT 100,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Create badges table to define available badges
CREATE TABLE public.badges (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  badge_id text NOT NULL UNIQUE,
  name text NOT NULL,
  description text,
  criteria jsonb NOT NULL DEFAULT '{}',
  icon text,
  rarity text NOT NULL DEFAULT 'common',
  xp_reward integer NOT NULL DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Create user badges table to track earned badges
CREATE TABLE public.user_badges (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  badge_id uuid NOT NULL REFERENCES public.badges(id) ON DELETE CASCADE,
  awarded_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(user_id, badge_id)
);

-- Create streaks table to track various streak types
CREATE TABLE public.streaks (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  streak_type text NOT NULL,
  start_date date NOT NULL,
  current_count integer NOT NULL DEFAULT 1,
  best_count integer NOT NULL DEFAULT 1,
  last_activity_date date NOT NULL DEFAULT CURRENT_DATE,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(user_id, streak_type)
);

-- Create quests table for time-limited challenges
CREATE TABLE public.quests (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  quest_id text NOT NULL UNIQUE,
  name text NOT NULL,
  description text,
  criteria jsonb NOT NULL DEFAULT '{}',
  xp_multiplier numeric NOT NULL DEFAULT 1.0,
  start_date timestamp with time zone,
  end_date timestamp with time zone,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Create user quest progress table
CREATE TABLE public.user_quest_progress (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  quest_id uuid NOT NULL REFERENCES public.quests(id) ON DELETE CASCADE,
  progress jsonb NOT NULL DEFAULT '{}',
  completed_at timestamp with time zone,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(user_id, quest_id)
);

-- Create shop items table for XP rewards
CREATE TABLE public.shop_items (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  item_id text NOT NULL UNIQUE,
  name text NOT NULL,
  description text,
  xp_cost integer NOT NULL,
  item_type text NOT NULL DEFAULT 'cosmetic',
  metadata jsonb DEFAULT '{}',
  is_available boolean NOT NULL DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Create user purchases table
CREATE TABLE public.user_purchases (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  shop_item_id uuid NOT NULL REFERENCES public.shop_items(id) ON DELETE CASCADE,
  xp_spent integer NOT NULL,
  purchased_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.xp_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_xp ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.streaks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_quest_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shop_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_purchases ENABLE ROW LEVEL SECURITY;

-- RLS Policies for xp_events
CREATE POLICY "Users can view their own XP events" ON public.xp_events
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own XP events" ON public.xp_events
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS Policies for user_xp
CREATE POLICY "Users can view their own XP data" ON public.user_xp
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update their own XP data" ON public.user_xp
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own XP data" ON public.user_xp
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS Policies for badges (public read)
CREATE POLICY "Anyone can view badges" ON public.badges
  FOR SELECT USING (true);

-- RLS Policies for user_badges
CREATE POLICY "Users can view their own badges" ON public.user_badges
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own badges" ON public.user_badges
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS Policies for streaks
CREATE POLICY "Users can view their own streaks" ON public.streaks
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update their own streaks" ON public.streaks
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own streaks" ON public.streaks
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS Policies for quests (public read)
CREATE POLICY "Anyone can view active quests" ON public.quests
  FOR SELECT USING (is_active = true);

-- RLS Policies for user_quest_progress
CREATE POLICY "Users can view their own quest progress" ON public.user_quest_progress
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update their own quest progress" ON public.user_quest_progress
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own quest progress" ON public.user_quest_progress
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS Policies for shop_items (public read)
CREATE POLICY "Anyone can view available shop items" ON public.shop_items
  FOR SELECT USING (is_available = true);

-- RLS Policies for user_purchases
CREATE POLICY "Users can view their own purchases" ON public.user_purchases
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own purchases" ON public.user_purchases
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add updated_at triggers
CREATE TRIGGER update_user_xp_updated_at BEFORE UPDATE ON public.user_xp
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_streaks_updated_at BEFORE UPDATE ON public.streaks
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_quest_progress_updated_at BEFORE UPDATE ON public.user_quest_progress
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert initial badges
INSERT INTO public.badges (badge_id, name, description, criteria, icon, rarity, xp_reward) VALUES
('first_flashcard', 'First Flashcard', 'Created your first flashcard', '{"type": "flashcard_created", "count": 1}', '🎯', 'common', 10),
('flashcard_master', 'Flashcard Master', 'Created 100 flashcards', '{"type": "flashcard_created", "count": 100}', '🏆', 'epic', 100),
('study_streak_7', '7-Day Streak', 'Studied for 7 consecutive days', '{"type": "study_streak", "count": 7}', '🔥', 'rare', 50),
('study_streak_30', '30-Day Streak', 'Studied for 30 consecutive days', '{"type": "study_streak", "count": 30}', '⚡', 'legendary', 200),
('first_module', 'Getting Started', 'Completed your first module', '{"type": "module_completed", "count": 1}', '📚', 'common', 20),
('bookworm', 'Bookworm', 'Read for 10 hours total', '{"type": "reading_time", "hours": 10}', '🐛', 'rare', 75),
('speed_reader', 'Speed Reader', 'Completed a reading session in under 30 minutes', '{"type": "reading_speed", "max_minutes": 30}', '💨', 'rare', 60),
('community_contributor', 'Community Contributor', 'Uploaded a book that was approved', '{"type": "book_upload_approved", "count": 1}', '🤝', 'epic', 150);

-- Insert initial shop items
INSERT INTO public.shop_items (item_id, name, description, xp_cost, item_type, metadata) VALUES
('dark_theme', 'Dark Theme', 'Unlock the premium dark theme', 500, 'theme', '{"theme": "dark"}'),
('rainbow_theme', 'Rainbow Theme', 'Unlock the colorful rainbow theme', 1000, 'theme', '{"theme": "rainbow"}'),
('xp_booster_2x', '2x XP Booster (1 hour)', 'Double your XP gains for 1 hour', 200, 'booster', '{"multiplier": 2, "duration_hours": 1}'),
('xp_booster_3x', '3x XP Booster (30 min)', 'Triple your XP gains for 30 minutes', 300, 'booster', '{"multiplier": 3, "duration_hours": 0.5}'),
('custom_avatar', 'Custom Avatar Frame', 'Unlock premium avatar frames', 750, 'cosmetic', '{"type": "avatar_frame"}'),
('streak_shield', 'Streak Shield', 'Protect your streak for one missed day', 400, 'utility', '{"type": "streak_protection"}');

-- Insert initial quest
INSERT INTO public.quests (quest_id, name, description, criteria, xp_multiplier, start_date, end_date, is_active) VALUES
('winter_reading', 'Winter Reading Challenge', 'Get 2x XP for reading activities this winter', '{"activity_types": ["reading", "flashcard_study"]}', 2.0, now(), now() + interval '30 days', true);

-- Create function to calculate level from XP
CREATE OR REPLACE FUNCTION calculate_level_from_xp(total_xp integer)
RETURNS TABLE(level integer, next_level_xp integer) AS $$
DECLARE
  current_level integer := 1;
  xp_needed integer := 100;
  cumulative_xp integer := 0;
BEGIN
  WHILE cumulative_xp + xp_needed <= total_xp LOOP
    cumulative_xp := cumulative_xp + xp_needed;
    current_level := current_level + 1;
    -- XP needed for next level increases by 50 each level
    xp_needed := 100 + (current_level - 1) * 50;
  END LOOP;
  
  RETURN QUERY SELECT current_level, xp_needed - (total_xp - cumulative_xp);
END;
$$ LANGUAGE plpgsql;
