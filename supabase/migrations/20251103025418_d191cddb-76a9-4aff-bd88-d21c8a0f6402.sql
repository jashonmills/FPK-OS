-- Create ai_persona_triggers table for flexible, database-driven intent detection
CREATE TABLE IF NOT EXISTS public.ai_persona_triggers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  persona TEXT NOT NULL CHECK (persona IN ('BETTY', 'AL', 'NITE_OWL', 'CONDUCTOR')),
  intent TEXT NOT NULL,
  category TEXT NOT NULL,
  trigger_phrase TEXT NOT NULL,
  weight FLOAT NOT NULL DEFAULT 1.0,
  priority INTEGER NOT NULL DEFAULT 0,
  is_regex BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create indexes for fast lookups
CREATE INDEX idx_ai_persona_triggers_persona ON public.ai_persona_triggers(persona);
CREATE INDEX idx_ai_persona_triggers_intent ON public.ai_persona_triggers(intent);
CREATE INDEX idx_ai_persona_triggers_category ON public.ai_persona_triggers(category);

-- Add RLS policies (admin-only for now, since this is system configuration)
ALTER TABLE public.ai_persona_triggers ENABLE ROW LEVEL SECURITY;

-- Allow all authenticated users to read triggers (needed for orchestrator)
CREATE POLICY "Anyone can read triggers"
  ON public.ai_persona_triggers
  FOR SELECT
  USING (true);

-- Only admins can modify triggers
CREATE POLICY "Only admins can modify triggers"
  ON public.ai_persona_triggers
  FOR ALL
  USING (auth.jwt() ->> 'role' = 'admin');

-- Create updated_at trigger
CREATE TRIGGER update_ai_persona_triggers_updated_at
  BEFORE UPDATE ON public.ai_persona_triggers
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

COMMENT ON TABLE public.ai_persona_triggers IS 'Database-driven trigger phrases for AI persona intent detection with keyword scoring';
COMMENT ON COLUMN public.ai_persona_triggers.persona IS 'Target persona: BETTY (Socratic), AL (Direct Expert), NITE_OWL (Fun Facts)';
COMMENT ON COLUMN public.ai_persona_triggers.intent IS 'Detected intent: conversation_opener, socratic_guidance, escape_hatch, etc.';
COMMENT ON COLUMN public.ai_persona_triggers.category IS 'Trigger category for organization: greeting, confusion_signal, request_pattern, etc.';
COMMENT ON COLUMN public.ai_persona_triggers.trigger_phrase IS 'Exact phrase or regex pattern to match';
COMMENT ON COLUMN public.ai_persona_triggers.weight IS 'Multiplier for scoring (0.5 = weak signal, 2.0 = strong signal)';
COMMENT ON COLUMN public.ai_persona_triggers.priority IS 'Higher priority = checked first (escape_hatch = 100, greetings = 95)';
COMMENT ON COLUMN public.ai_persona_triggers.is_regex IS 'If true, trigger_phrase is a regex pattern';