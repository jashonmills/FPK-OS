-- Create org_api_keys table for BYOK (Bring Your Own Key)
CREATE TABLE public.org_api_keys (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  org_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  provider TEXT NOT NULL CHECK (provider IN ('openai', 'anthropic', 'google')),
  encrypted_key TEXT NOT NULL, -- Store encrypted, decrypt at runtime
  is_active BOOLEAN NOT NULL DEFAULT true,
  last_verified_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by UUID REFERENCES auth.users(id),
  
  -- One key per provider per org
  UNIQUE (org_id, provider)
);

-- Enable RLS
ALTER TABLE public.org_api_keys ENABLE ROW LEVEL SECURITY;

-- Only org admins can manage API keys
CREATE POLICY "Org admins can view their org API keys"
  ON public.org_api_keys FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.org_members om
      WHERE om.org_id = org_api_keys.org_id
      AND om.user_id = auth.uid()
      AND om.role IN ('owner', 'admin')
    )
  );

CREATE POLICY "Org admins can insert API keys"
  ON public.org_api_keys FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.org_members om
      WHERE om.org_id = org_api_keys.org_id
      AND om.user_id = auth.uid()
      AND om.role IN ('owner', 'admin')
    )
  );

CREATE POLICY "Org admins can update API keys"
  ON public.org_api_keys FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.org_members om
      WHERE om.org_id = org_api_keys.org_id
      AND om.user_id = auth.uid()
      AND om.role IN ('owner', 'admin')
    )
  );

CREATE POLICY "Org admins can delete API keys"
  ON public.org_api_keys FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.org_members om
      WHERE om.org_id = org_api_keys.org_id
      AND om.user_id = auth.uid()
      AND om.role IN ('owner', 'admin')
    )
  );

-- Trigger for updated_at
CREATE TRIGGER update_org_api_keys_updated_at
  BEFORE UPDATE ON public.org_api_keys
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Add index for lookups
CREATE INDEX idx_org_api_keys_org_provider ON public.org_api_keys(org_id, provider) WHERE is_active = true;