-- Create table for Governor violation logs
CREATE TABLE IF NOT EXISTS public.phoenix_governor_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id TEXT NOT NULL,
  persona TEXT NOT NULL,
  original_response TEXT NOT NULL,
  user_message TEXT NOT NULL,
  is_safe BOOLEAN NOT NULL,
  is_on_topic BOOLEAN NOT NULL,
  persona_adherence TEXT NOT NULL,
  severity TEXT NOT NULL,
  reason TEXT,
  blocked BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add index for querying blocked responses
CREATE INDEX idx_governor_logs_blocked ON public.phoenix_governor_logs(blocked, created_at DESC);
CREATE INDEX idx_governor_logs_conversation ON public.phoenix_governor_logs(conversation_id);

-- Enable RLS
ALTER TABLE public.phoenix_governor_logs ENABLE ROW LEVEL SECURITY;

-- Admin-only access policy
CREATE POLICY "Admins can view governor logs"
  ON public.phoenix_governor_logs
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_id = auth.uid()
      AND role = 'admin'
    )
  );

COMMENT ON TABLE public.phoenix_governor_logs IS 'Logs of AI response quality checks and violations detected by the Governor module';