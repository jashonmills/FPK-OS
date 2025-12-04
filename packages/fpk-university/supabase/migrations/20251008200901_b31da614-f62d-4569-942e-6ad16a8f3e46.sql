-- Create org_educators table for Educator Portal-Only system
CREATE TABLE IF NOT EXISTS public.org_educators (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  pin_hash TEXT,
  activation_token TEXT,
  activation_expires_at TIMESTAMP WITH TIME ZONE,
  activation_status TEXT NOT NULL DEFAULT 'pending' CHECK (activation_status IN ('pending', 'activated', 'expired')),
  linked_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  role member_role NOT NULL DEFAULT 'instructor',
  status member_status NOT NULL DEFAULT 'active',
  invited_by UUID REFERENCES auth.users(id),
  invited_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  UNIQUE(org_id, email)
);

-- Create indexes for performance
CREATE INDEX idx_org_educators_org_id ON public.org_educators(org_id);
CREATE INDEX idx_org_educators_email ON public.org_educators(email);
CREATE INDEX idx_org_educators_linked_user_id ON public.org_educators(linked_user_id);
CREATE INDEX idx_org_educators_activation_token ON public.org_educators(activation_token);

-- Enable RLS
ALTER TABLE public.org_educators ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Org owners and instructors can view educators in their org
CREATE POLICY "Org members can view educators in their org"
ON public.org_educators
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.org_members om
    WHERE om.org_id = org_educators.org_id
    AND om.user_id = auth.uid()
    AND om.status = 'active'
  )
);

-- RLS Policy: Org owners can insert educators
CREATE POLICY "Org owners can invite educators"
ON public.org_educators
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.org_members om
    WHERE om.org_id = org_educators.org_id
    AND om.user_id = auth.uid()
    AND om.role = 'owner'
    AND om.status = 'active'
  )
);

-- RLS Policy: Org owners can update educators
CREATE POLICY "Org owners can update educators"
ON public.org_educators
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM public.org_members om
    WHERE om.org_id = org_educators.org_id
    AND om.user_id = auth.uid()
    AND om.role = 'owner'
    AND om.status = 'active'
  )
);

-- RLS Policy: Org owners can delete educators
CREATE POLICY "Org owners can delete educators"
ON public.org_educators
FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM public.org_members om
    WHERE om.org_id = org_educators.org_id
    AND om.user_id = auth.uid()
    AND om.role = 'owner'
    AND om.status = 'active'
  )
);

-- RLS Policy: Educators can view and update their own record
CREATE POLICY "Educators can view their own record"
ON public.org_educators
FOR SELECT
USING (linked_user_id = auth.uid());

CREATE POLICY "Educators can update their own record"
ON public.org_educators
FOR UPDATE
USING (linked_user_id = auth.uid());

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_org_educators_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_org_educators_updated_at
BEFORE UPDATE ON public.org_educators
FOR EACH ROW
EXECUTE FUNCTION update_org_educators_updated_at();