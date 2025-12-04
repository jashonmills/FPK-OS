-- =====================================================
-- PHASE 1A: Universal User Architecture Foundation
-- Creates the clients and client_access tables
-- This is ADDITIVE - does not modify existing tables
-- =====================================================

-- =====================================================
-- TABLE: clients (The "Golden Record")
-- =====================================================
-- This is the central, neutral record for every person receiving services.
-- It is NOT owned by a family or organization - it represents the individual.
-- All data tables will eventually reference client_id instead of student_id.

CREATE TABLE IF NOT EXISTS public.clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_name TEXT NOT NULL,
  date_of_birth DATE NOT NULL,
  primary_diagnosis TEXT[],
  grade_level TEXT,
  school_name TEXT,
  avatar_url TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Add helpful comment
COMMENT ON TABLE public.clients IS 'Central golden record for all individuals receiving services. This table is neutral - not owned by any family or organization.';

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_clients_dob ON public.clients(date_of_birth);
CREATE INDEX IF NOT EXISTS idx_clients_created_at ON public.clients(created_at);

-- =====================================================
-- TABLE: client_access (The Access Control Junction)
-- =====================================================
-- This table defines "who can see what" - the most critical piece of the architecture.
-- Each row represents one accessor's permission to view/manage a client's data.

CREATE TABLE IF NOT EXISTS public.client_access (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  family_id UUID REFERENCES public.families(id) ON DELETE CASCADE,
  organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE,
  access_level TEXT NOT NULL CHECK (access_level IN ('owner', 'admin', 'contributor', 'viewer')),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'pending_invite', 'revoked', 'expired')),
  granted_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  granted_by UUID,
  revoked_at TIMESTAMPTZ,
  revoked_by UUID,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  
  -- Ensure either family_id OR organization_id is set, not both
  CONSTRAINT check_one_accessor CHECK (
    (family_id IS NOT NULL AND organization_id IS NULL) OR
    (family_id IS NULL AND organization_id IS NOT NULL)
  ),
  
  -- Prevent duplicate active access grants
  CONSTRAINT unique_active_access UNIQUE (client_id, family_id, organization_id, status)
);

-- Add helpful comment
COMMENT ON TABLE public.client_access IS 'Junction table defining access permissions. Each row represents one accessor (family or org) with permission to view/manage a client.';

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_client_access_client_id ON public.client_access(client_id);
CREATE INDEX IF NOT EXISTS idx_client_access_family_id ON public.client_access(family_id) WHERE family_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_client_access_org_id ON public.client_access(organization_id) WHERE organization_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_client_access_status ON public.client_access(status) WHERE status = 'active';

-- =====================================================
-- TRIGGERS: Auto-update timestamps
-- =====================================================

CREATE OR REPLACE FUNCTION public.update_clients_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_clients_updated_at
  BEFORE UPDATE ON public.clients
  FOR EACH ROW
  EXECUTE FUNCTION public.update_clients_updated_at();

CREATE OR REPLACE FUNCTION public.update_client_access_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_client_access_updated_at
  BEFORE UPDATE ON public.client_access
  FOR EACH ROW
  EXECUTE FUNCTION public.update_client_access_updated_at();

-- =====================================================
-- RLS: Enable Row Level Security
-- =====================================================

ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.client_access ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- RLS POLICIES: clients table
-- =====================================================
-- Users can view clients they have access to (via client_access)

CREATE POLICY "Users can view clients they have access to"
  ON public.clients
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.client_access ca
      WHERE ca.client_id = clients.id
        AND ca.status = 'active'
        AND (
          ca.family_id IN (
            SELECT family_id FROM public.family_members 
            WHERE user_id = auth.uid()
          )
          OR ca.organization_id IN (
            SELECT organization_id FROM public.organization_members 
            WHERE user_id = auth.uid() AND is_active = true
          )
        )
    )
  );

-- Family owners and org admins can create clients
CREATE POLICY "Authorized users can create clients"
  ON public.clients
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.family_members fm
      WHERE fm.user_id = auth.uid() AND fm.role = 'owner'
    )
    OR EXISTS (
      SELECT 1 FROM public.organization_members om
      WHERE om.user_id = auth.uid() 
        AND om.is_active = true
        AND om.role IN ('org_owner', 'district_admin', 'school_admin')
    )
  );

-- Users with 'owner' or 'admin' access can update clients
CREATE POLICY "Users with admin access can update clients"
  ON public.clients
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.client_access ca
      WHERE ca.client_id = clients.id
        AND ca.status = 'active'
        AND ca.access_level IN ('owner', 'admin')
        AND (
          ca.family_id IN (
            SELECT family_id FROM public.family_members 
            WHERE user_id = auth.uid()
          )
          OR ca.organization_id IN (
            SELECT organization_id FROM public.organization_members 
            WHERE user_id = auth.uid() AND is_active = true
          )
        )
    )
  );

-- Only owners can delete clients
CREATE POLICY "Only owners can delete clients"
  ON public.clients
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.client_access ca
      WHERE ca.client_id = clients.id
        AND ca.status = 'active'
        AND ca.access_level = 'owner'
        AND ca.family_id IN (
          SELECT family_id FROM public.family_members 
          WHERE user_id = auth.uid() AND role = 'owner'
        )
    )
  );

-- =====================================================
-- RLS POLICIES: client_access table
-- =====================================================

-- Users can view access records for their families/organizations
CREATE POLICY "Users can view access records they're part of"
  ON public.client_access
  FOR SELECT
  USING (
    family_id IN (
      SELECT family_id FROM public.family_members 
      WHERE user_id = auth.uid()
    )
    OR organization_id IN (
      SELECT organization_id FROM public.organization_members 
      WHERE user_id = auth.uid() AND is_active = true
    )
  );

-- Family owners and org admins can grant access
CREATE POLICY "Authorized users can grant access"
  ON public.client_access
  FOR INSERT
  WITH CHECK (
    (family_id IN (
      SELECT family_id FROM public.family_members 
      WHERE user_id = auth.uid() AND role = 'owner'
    ))
    OR (organization_id IN (
      SELECT organization_id FROM public.organization_members 
      WHERE user_id = auth.uid() 
        AND is_active = true
        AND role IN ('org_owner', 'district_admin', 'school_admin')
    ))
  );

-- Family owners and org admins can update access (e.g., revoke)
CREATE POLICY "Authorized users can update access"
  ON public.client_access
  FOR UPDATE
  USING (
    (family_id IN (
      SELECT family_id FROM public.family_members 
      WHERE user_id = auth.uid() AND role = 'owner'
    ))
    OR (organization_id IN (
      SELECT organization_id FROM public.organization_members 
      WHERE user_id = auth.uid() 
        AND is_active = true
        AND role IN ('org_owner', 'district_admin', 'school_admin')
    ))
  );

-- =====================================================
-- HELPER FUNCTIONS: For use in future RLS policies
-- =====================================================

-- Check if a user has access to a specific client
CREATE OR REPLACE FUNCTION public.user_can_access_client(
  p_user_id UUID,
  p_client_id UUID
)
RETURNS BOOLEAN
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.client_access ca
    WHERE ca.client_id = p_client_id
      AND ca.status = 'active'
      AND (
        ca.family_id IN (
          SELECT family_id FROM public.family_members 
          WHERE user_id = p_user_id
        )
        OR ca.organization_id IN (
          SELECT organization_id FROM public.organization_members 
          WHERE user_id = p_user_id AND is_active = true
        )
      )
  );
$$;

-- Get all client IDs a user has access to
CREATE OR REPLACE FUNCTION public.get_user_accessible_client_ids(
  p_user_id UUID
)
RETURNS TABLE(client_id UUID)
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT DISTINCT ca.client_id
  FROM public.client_access ca
  WHERE ca.status = 'active'
    AND (
      ca.family_id IN (
        SELECT family_id FROM public.family_members 
        WHERE user_id = p_user_id
      )
      OR ca.organization_id IN (
        SELECT organization_id FROM public.organization_members 
        WHERE user_id = p_user_id AND is_active = true
      )
    );
$$;

-- =====================================================
-- PHASE 1A COMPLETE
-- =====================================================
-- The foundation is now in place:
-- ✅ clients table created (the golden record)
-- ✅ client_access table created (access control junction)
-- ✅ RLS policies established
-- ✅ Helper functions created
-- 
-- Next Phase: Data Migration (Phase 1C)
-- =====================================================