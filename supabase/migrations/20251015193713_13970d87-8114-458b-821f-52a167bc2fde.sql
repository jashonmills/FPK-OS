-- Create feature flags table for universal feature flagging
CREATE TABLE IF NOT EXISTS public.feature_flags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  flag_key TEXT NOT NULL UNIQUE,
  flag_name TEXT NOT NULL,
  description TEXT,
  is_enabled BOOLEAN NOT NULL DEFAULT false,
  rollout_percentage INTEGER DEFAULT 0 CHECK (rollout_percentage >= 0 AND rollout_percentage <= 100),
  target_users JSONB DEFAULT '[]'::jsonb,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.feature_flags ENABLE ROW LEVEL SECURITY;

-- Admins can manage all feature flags
CREATE POLICY "Admins can manage feature flags"
ON public.feature_flags
FOR ALL
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- All authenticated users can view feature flags
CREATE POLICY "Users can view feature flags"
ON public.feature_flags
FOR SELECT
TO authenticated
USING (true);

-- Create user feature flag overrides table
CREATE TABLE IF NOT EXISTS public.user_feature_overrides (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  flag_key TEXT NOT NULL,
  is_enabled BOOLEAN NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, flag_key)
);

-- Enable RLS
ALTER TABLE public.user_feature_overrides ENABLE ROW LEVEL SECURITY;

-- Users can view their own overrides
CREATE POLICY "Users can view their overrides"
ON public.user_feature_overrides
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

-- Admins can manage all overrides
CREATE POLICY "Admins can manage overrides"
ON public.user_feature_overrides
FOR ALL
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Insert initial feature flags for AI assistant
INSERT INTO public.feature_flags (flag_key, flag_name, description, is_enabled, rollout_percentage) VALUES
('enable-advanced-ai-assistant', 'Advanced AI Assistant', 'Enable the enhanced AI assistant with multi-source analysis', true, 100),
('enable-ai-speech-to-text', 'AI Speech-to-Text', 'Enable voice input for AI assistant', true, 100),
('enable-ai-text-to-speech', 'AI Text-to-Speech', 'Enable voice output for AI assistant responses', true, 100),
('enable-ai-auto-play', 'AI Auto-Play Responses', 'Automatically read AI responses aloud', false, 0)
ON CONFLICT (flag_key) DO NOTHING;

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_feature_flags_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_feature_flags_updated_at
  BEFORE UPDATE ON public.feature_flags
  FOR EACH ROW
  EXECUTE FUNCTION update_feature_flags_updated_at();