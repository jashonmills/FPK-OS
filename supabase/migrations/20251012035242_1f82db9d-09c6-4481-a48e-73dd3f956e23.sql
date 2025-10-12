-- Add student learning and notification preferences to profiles table
ALTER TABLE public.profiles
  -- AI Coach Preferences
  ADD COLUMN IF NOT EXISTS ai_interaction_style TEXT DEFAULT 'encouraging_friendly' NOT NULL
    CHECK (ai_interaction_style IN ('encouraging_friendly', 'direct_concise', 'inquisitive_socratic')),
  ADD COLUMN IF NOT EXISTS ai_voice_enabled BOOLEAN DEFAULT TRUE NOT NULL,
  ADD COLUMN IF NOT EXISTS ai_autoplay_voice BOOLEAN DEFAULT FALSE NOT NULL,
  ADD COLUMN IF NOT EXISTS ai_hint_aggressiveness INTEGER DEFAULT 1 NOT NULL
    CHECK (ai_hint_aggressiveness BETWEEN 0 AND 2),

  -- Content & Display Preferences
  ADD COLUMN IF NOT EXISTS display_theme TEXT DEFAULT 'system' NOT NULL
    CHECK (display_theme IN ('system', 'light', 'dark')),
  ADD COLUMN IF NOT EXISTS display_font_size TEXT DEFAULT 'medium' NOT NULL
    CHECK (display_font_size IN ('small', 'medium', 'large')),
  ADD COLUMN IF NOT EXISTS display_high_contrast BOOLEAN DEFAULT FALSE NOT NULL,
  ADD COLUMN IF NOT EXISTS display_reduce_motion BOOLEAN DEFAULT FALSE NOT NULL,

  -- Gamification & Motivation Settings
  ADD COLUMN IF NOT EXISTS gamification_xp_notify BOOLEAN DEFAULT TRUE NOT NULL,
  ADD COLUMN IF NOT EXISTS gamification_leaderboard_enabled BOOLEAN DEFAULT TRUE NOT NULL,
  ADD COLUMN IF NOT EXISTS gamification_focus_mode BOOLEAN DEFAULT FALSE NOT NULL;

-- Add helpful comments
COMMENT ON COLUMN public.profiles.ai_interaction_style IS 'Student-chosen AI personality: encouraging_friendly, direct_concise, or inquisitive_socratic';
COMMENT ON COLUMN public.profiles.ai_voice_enabled IS 'Enable text-to-speech for AI responses';
COMMENT ON COLUMN public.profiles.ai_autoplay_voice IS 'Automatically play AI voice responses';
COMMENT ON COLUMN public.profiles.ai_hint_aggressiveness IS 'Hint timing preference: 0=slow, 1=normal, 2=fast';
COMMENT ON COLUMN public.profiles.display_theme IS 'UI theme preference: system, light, or dark';
COMMENT ON COLUMN public.profiles.display_font_size IS 'Font size preference: small, medium, or large';
COMMENT ON COLUMN public.profiles.display_high_contrast IS 'Enable high contrast mode for accessibility';
COMMENT ON COLUMN public.profiles.display_reduce_motion IS 'Reduce animations and motion for accessibility';
COMMENT ON COLUMN public.profiles.gamification_xp_notify IS 'Show XP gain and level-up notifications';
COMMENT ON COLUMN public.profiles.gamification_leaderboard_enabled IS 'Show user on public leaderboards';
COMMENT ON COLUMN public.profiles.gamification_focus_mode IS 'Hide gamification UI for distraction-free study';