-- Create phoenix_feature_flags table for runtime AI capability control
CREATE TABLE IF NOT EXISTS public.phoenix_feature_flags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  feature_name TEXT UNIQUE NOT NULL,
  is_enabled BOOLEAN NOT NULL DEFAULT true,
  configuration JSONB DEFAULT '{}'::jsonb,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.phoenix_feature_flags ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Anyone can view feature flags"
  ON public.phoenix_feature_flags
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can manage feature flags"
  ON public.phoenix_feature_flags
  FOR ALL
  TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Insert default feature flags
INSERT INTO public.phoenix_feature_flags (feature_name, is_enabled, configuration, description) VALUES
  ('nite_owl_interjections', true, '{"min_turns": 5, "max_turns": 8, "cooldown_turns": 5}'::jsonb, 'Enable Nite Owl fun fact interjections during Betty sessions'),
  ('socratic_sandwich', true, '{"enabled": true}'::jsonb, 'Enable Al + Betty co-response (Socratic Sandwich) for partially correct answers'),
  ('welcome_back_detection', true, '{"enabled": true}'::jsonb, 'Detect and handle session resumption with welcome back messages'),
  ('governor_quality_checks', true, '{"blocking": false, "log_only": true}'::jsonb, 'Enable Governor quality checks for AI responses'),
  ('podcast_generation', true, '{"enabled": true}'::jsonb, 'Enable experimental podcast generation from conversations'),
  ('memory_extraction', true, '{"min_messages": 4}'::jsonb, 'Enable automatic memory extraction and storage from conversations'),
  ('tts_audio', true, '{"elevenlabs_primary": true, "openai_fallback": true}'::jsonb, 'Enable text-to-speech audio generation')
ON CONFLICT (feature_name) DO NOTHING;

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_phoenix_feature_flags_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_phoenix_feature_flags_timestamp
  BEFORE UPDATE ON public.phoenix_feature_flags
  FOR EACH ROW
  EXECUTE FUNCTION update_phoenix_feature_flags_updated_at();

-- Add helpful comment
COMMENT ON TABLE public.phoenix_feature_flags IS 'Runtime configuration flags for Phoenix AI capabilities - enables plug-and-play feature management';