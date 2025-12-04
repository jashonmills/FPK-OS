-- Phase 1A: Create b2b_portal_active feature flag
INSERT INTO public.feature_flags (
  flag_key,
  flag_name,
  description,
  is_enabled,
  rollout_percentage,
  metadata
) VALUES (
  'b2b_portal_active',
  'B2B Organization Portal',
  'Enables the B2B organization portal for schools and districts. When disabled, only the B2C parent-facing application is accessible.',
  false,
  0,
  '{"phase": "development", "target_release": "2025-Q2"}'::jsonb
) ON CONFLICT (flag_key) DO NOTHING;

-- Phase 1B: Organization Database Schema

-- Organizations table (schools, districts, clinics)
CREATE TABLE IF NOT EXISTS public.organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_name TEXT NOT NULL,
  org_type TEXT NOT NULL CHECK (org_type IN ('school', 'district', 'clinic', 'therapy_center')),
  subscription_tier TEXT NOT NULL DEFAULT 'free' CHECK (subscription_tier IN ('free', 'team', 'pro', 'enterprise')),
  max_students INTEGER,
  max_staff INTEGER,
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  billing_email TEXT,
  address_line1 TEXT,
  address_line2 TEXT,
  city TEXT,
  state TEXT,
  postal_code TEXT,
  country TEXT DEFAULT 'US',
  phone TEXT,
  website TEXT,
  logo_url TEXT,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  is_active BOOLEAN NOT NULL DEFAULT true
);

-- Organization members (staff with role-based access)
CREATE TABLE IF NOT EXISTS public.organization_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('org_owner', 'district_admin', 'school_admin', 'teacher', 'therapist', 'specialist', 'support_staff')),
  caseload_student_ids UUID[] DEFAULT '{}',
  permissions JSONB DEFAULT '{"can_invite": false, "can_manage_students": false, "can_view_analytics": true}'::jsonb,
  department TEXT,
  job_title TEXT,
  joined_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  invited_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  UNIQUE(organization_id, user_id)
);

-- Organization invites
CREATE TABLE IF NOT EXISTS public.organization_invites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  inviter_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  invitee_email TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('org_owner', 'district_admin', 'school_admin', 'teacher', 'therapist', 'specialist', 'support_staff')),
  token TEXT NOT NULL UNIQUE DEFAULT gen_random_uuid()::text,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'expired', 'revoked')),
  expires_at TIMESTAMPTZ NOT NULL DEFAULT (NOW() + INTERVAL '7 days'),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  accepted_at TIMESTAMPTZ
);

-- Add organization_id to students table
ALTER TABLE public.students 
  ADD COLUMN IF NOT EXISTS organization_id UUID REFERENCES public.organizations(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS added_by_org_member_id UUID REFERENCES public.organization_members(id) ON DELETE SET NULL;

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_organizations_created_by ON public.organizations(created_by);
CREATE INDEX IF NOT EXISTS idx_organizations_active ON public.organizations(is_active) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_org_members_org_id ON public.organization_members(organization_id);
CREATE INDEX IF NOT EXISTS idx_org_members_user_id ON public.organization_members(user_id);
CREATE INDEX IF NOT EXISTS idx_org_members_active ON public.organization_members(is_active) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_org_invites_token ON public.organization_invites(token);
CREATE INDEX IF NOT EXISTS idx_org_invites_email ON public.organization_invites(invitee_email);
CREATE INDEX IF NOT EXISTS idx_students_org_id ON public.students(organization_id);

-- RLS Policies for Organizations

ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "org_members_view_own_org"
  ON public.organizations FOR SELECT
  USING (
    id IN (
      SELECT organization_id FROM public.organization_members 
      WHERE user_id = auth.uid() AND is_active = true
    )
  );

CREATE POLICY "org_owners_manage_own_org"
  ON public.organizations FOR ALL
  USING (
    id IN (
      SELECT organization_id FROM public.organization_members 
      WHERE user_id = auth.uid() AND role = 'org_owner' AND is_active = true
    )
  );

CREATE POLICY "users_create_new_org"
  ON public.organizations FOR INSERT
  WITH CHECK (created_by = auth.uid());

-- RLS Policies for Organization Members

ALTER TABLE public.organization_members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "org_members_view_peers"
  ON public.organization_members FOR SELECT
  USING (
    organization_id IN (
      SELECT organization_id FROM public.organization_members 
      WHERE user_id = auth.uid() AND is_active = true
    )
  );

CREATE POLICY "org_owners_manage_members"
  ON public.organization_members FOR ALL
  USING (
    organization_id IN (
      SELECT organization_id FROM public.organization_members 
      WHERE user_id = auth.uid() AND role IN ('org_owner', 'district_admin', 'school_admin') AND is_active = true
    )
  );

CREATE POLICY "users_insert_self_as_org_owner"
  ON public.organization_members FOR INSERT
  WITH CHECK (
    user_id = auth.uid() AND 
    role = 'org_owner' AND
    EXISTS (
      SELECT 1 FROM public.organizations 
      WHERE id = organization_members.organization_id AND created_by = auth.uid()
    )
  );

-- RLS Policies for Organization Invites

ALTER TABLE public.organization_invites ENABLE ROW LEVEL SECURITY;

CREATE POLICY "org_admins_view_invites"
  ON public.organization_invites FOR SELECT
  USING (
    organization_id IN (
      SELECT organization_id FROM public.organization_members 
      WHERE user_id = auth.uid() AND role IN ('org_owner', 'district_admin', 'school_admin') AND is_active = true
    )
  );

CREATE POLICY "org_admins_create_invites"
  ON public.organization_invites FOR INSERT
  WITH CHECK (
    organization_id IN (
      SELECT organization_id FROM public.organization_members 
      WHERE user_id = auth.uid() AND role IN ('org_owner', 'district_admin', 'school_admin') AND is_active = true
    )
    AND inviter_id = auth.uid()
  );

CREATE POLICY "org_admins_manage_invites"
  ON public.organization_invites FOR UPDATE
  USING (
    organization_id IN (
      SELECT organization_id FROM public.organization_members 
      WHERE user_id = auth.uid() AND role IN ('org_owner', 'district_admin', 'school_admin') AND is_active = true
    )
  );

CREATE POLICY "anyone_view_invite_by_token"
  ON public.organization_invites FOR SELECT
  USING (true);

-- Update Students RLS to include organization access

CREATE POLICY "org_members_view_org_students"
  ON public.students FOR SELECT
  USING (
    organization_id IN (
      SELECT organization_id FROM public.organization_members 
      WHERE user_id = auth.uid() AND is_active = true
    )
  );

CREATE POLICY "org_admins_manage_org_students"
  ON public.students FOR ALL
  USING (
    organization_id IN (
      SELECT organization_id FROM public.organization_members 
      WHERE user_id = auth.uid() AND role IN ('org_owner', 'district_admin', 'school_admin') AND is_active = true
    )
  );

CREATE POLICY "teachers_view_caseload_students"
  ON public.students FOR SELECT
  USING (
    id = ANY(
      SELECT unnest(caseload_student_ids) 
      FROM public.organization_members 
      WHERE user_id = auth.uid() AND is_active = true
    )
  );

-- Helper function to check if user is organization member
CREATE OR REPLACE FUNCTION public.is_organization_member(_user_id UUID, _org_id UUID)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.organization_members
    WHERE user_id = _user_id 
      AND organization_id = _org_id 
      AND is_active = true
  )
$$;

-- Helper function to check if user is organization owner/admin
CREATE OR REPLACE FUNCTION public.is_organization_admin(_user_id UUID, _org_id UUID)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.organization_members
    WHERE user_id = _user_id 
      AND organization_id = _org_id 
      AND role IN ('org_owner', 'district_admin', 'school_admin')
      AND is_active = true
  )
$$;

-- Helper function to get user's organization role
CREATE OR REPLACE FUNCTION public.get_user_org_role(_org_id UUID)
RETURNS TEXT
LANGUAGE SQL
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT role
  FROM public.organization_members
  WHERE user_id = auth.uid() 
    AND organization_id = _org_id 
    AND is_active = true
  LIMIT 1
$$;