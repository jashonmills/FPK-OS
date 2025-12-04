-- Create Interactive IEP module tables

-- Table for storing parent invite codes
CREATE TABLE public.iep_invites (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  org_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  code TEXT NOT NULL UNIQUE,
  created_by UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT (now() + interval '7 days'),
  max_uses INTEGER NOT NULL DEFAULT 1,
  current_uses INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'used', 'expired', 'disabled')),
  metadata JSONB DEFAULT '{}'::jsonb
);

-- Table for temporary parent sessions
CREATE TABLE public.parent_iep_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  invite_code TEXT NOT NULL REFERENCES public.iep_invites(code) ON DELETE CASCADE,
  session_id TEXT NOT NULL UNIQUE,
  org_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT (now() + interval '4 hours'),
  last_activity TIMESTAMP WITH TIME ZONE DEFAULT now(),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'expired', 'completed'))
);

-- Table for storing parent-submitted IEP data
CREATE TABLE public.parent_iep_data (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id UUID NOT NULL REFERENCES public.parent_iep_sessions(id) ON DELETE CASCADE,
  org_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  form_section TEXT NOT NULL,
  form_data JSONB NOT NULL DEFAULT '{}'::jsonb,
  submitted_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Table for IEP form templates
CREATE TABLE public.iep_forms (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  org_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  form_name TEXT NOT NULL,
  form_sections JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_by UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  is_active BOOLEAN NOT NULL DEFAULT true
);

-- Enable RLS on all tables
ALTER TABLE public.iep_invites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.parent_iep_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.parent_iep_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.iep_forms ENABLE ROW LEVEL SECURITY;

-- RLS Policies for iep_invites
CREATE POLICY "Org owners/instructors can manage their org's invites"
ON public.iep_invites
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.org_members om
    WHERE om.org_id = iep_invites.org_id
    AND om.user_id = auth.uid()
    AND om.status = 'active'
    AND om.role IN ('owner', 'instructor')
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.org_members om
    WHERE om.org_id = iep_invites.org_id
    AND om.user_id = auth.uid()
    AND om.status = 'active'
    AND om.role IN ('owner', 'instructor')
  )
);

-- RLS Policies for parent_iep_sessions
CREATE POLICY "System can manage parent sessions"
ON public.parent_iep_sessions
FOR ALL
USING (true)
WITH CHECK (true);

CREATE POLICY "Org owners/instructors can view their org's sessions"
ON public.parent_iep_sessions
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.org_members om
    WHERE om.org_id = parent_iep_sessions.org_id
    AND om.user_id = auth.uid()
    AND om.status = 'active'
    AND om.role IN ('owner', 'instructor')
  )
);

-- RLS Policies for parent_iep_data
CREATE POLICY "System can manage parent IEP data"
ON public.parent_iep_data
FOR ALL
USING (true)
WITH CHECK (true);

CREATE POLICY "Org owners/instructors can view their org's IEP data"
ON public.parent_iep_data
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.org_members om
    WHERE om.org_id = parent_iep_data.org_id
    AND om.user_id = auth.uid()
    AND om.status = 'active'
    AND om.role IN ('owner', 'instructor')
  )
);

-- RLS Policies for iep_forms
CREATE POLICY "Org owners/instructors can manage their org's forms"
ON public.iep_forms
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.org_members om
    WHERE om.org_id = iep_forms.org_id
    AND om.user_id = auth.uid()
    AND om.status = 'active'
    AND om.role IN ('owner', 'instructor')
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.org_members om
    WHERE om.org_id = iep_forms.org_id
    AND om.user_id = auth.uid()
    AND om.status = 'active'
    AND om.role IN ('owner', 'instructor')
  )
);

-- Function to generate unique IEP invite codes
CREATE OR REPLACE FUNCTION public.generate_iep_invite_code()
RETURNS TEXT
LANGUAGE plpgsql
AS $$
DECLARE
  code TEXT;
BEGIN
  LOOP
    code := 'IEP' || UPPER(substring(md5(random()::text) from 1 for 6));
    EXIT WHEN NOT EXISTS (SELECT 1 FROM public.iep_invites WHERE code = code);
  END LOOP;
  RETURN code;
END;
$$;

-- Function to clean up expired sessions
CREATE OR REPLACE FUNCTION public.cleanup_expired_iep_sessions()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE public.parent_iep_sessions
  SET status = 'expired'
  WHERE expires_at < now() AND status = 'active';
  
  UPDATE public.iep_invites
  SET status = 'expired'
  WHERE expires_at < now() AND status = 'active';
END;
$$;