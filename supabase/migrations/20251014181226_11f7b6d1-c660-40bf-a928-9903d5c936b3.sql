-- Add settings column to profiles table for Phoenix Lab preferences
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS phoenix_settings JSONB DEFAULT jsonb_build_object(
  'showWelcomeMessage', true,
  'audioEnabled', true
);

-- Create index for faster access
CREATE INDEX IF NOT EXISTS idx_profiles_phoenix_settings ON profiles USING gin(phoenix_settings);

-- Add helpful comment
COMMENT ON COLUMN profiles.phoenix_settings IS 'User preferences for Phoenix Lab (showWelcomeMessage, audioEnabled)';