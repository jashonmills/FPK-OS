-- Create system_config table for storing system-wide configuration
CREATE TABLE IF NOT EXISTS public.system_config (
  config_key TEXT PRIMARY KEY,
  config_value JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.system_config ENABLE ROW LEVEL SECURITY;

-- Super admins can read configuration
CREATE POLICY "Super admins can view system config"
  ON public.system_config
  FOR SELECT
  USING (has_super_admin_role(auth.uid()));

-- Service role can manage (for edge functions)
CREATE POLICY "Service role can manage system config"
  ON public.system_config
  FOR ALL
  USING (auth.jwt() ->> 'role' = 'service_role')
  WITH CHECK (auth.jwt() ->> 'role' = 'service_role');

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_system_config_key ON public.system_config(config_key);

-- Insert initial config for error notifications
INSERT INTO public.system_config (config_key, config_value)
VALUES ('last_error_notifications', '{}'::jsonb)
ON CONFLICT (config_key) DO NOTHING;