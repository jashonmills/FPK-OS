-- Complete Organizations System Implementation
-- This migration extends the existing organization tables to support full org portal functionality

-- Drop existing organization tables if they exist to recreate with new schema
DROP TABLE IF EXISTS org_assignment_targets CASCADE;
DROP TABLE IF EXISTS org_assignments CASCADE;
DROP TABLE IF EXISTS org_group_members CASCADE;
DROP TABLE IF EXISTS org_groups CASCADE;
DROP TABLE IF EXISTS org_portal_settings CASCADE;

-- Alter existing organizations table to match requirements
ALTER TABLE public.organizations 
DROP COLUMN IF EXISTS subscription_tier CASCADE,
DROP COLUMN IF EXISTS seat_limit CASCADE,
DROP COLUMN IF EXISTS seats_used CASCADE,
DROP COLUMN IF EXISTS instructor_limit CASCADE,
DROP COLUMN IF EXISTS instructors_used CASCADE,
DROP COLUMN IF EXISTS settings CASCADE,
DROP COLUMN IF EXISTS beta_expiration_date CASCADE,
DROP COLUMN IF EXISTS is_beta_access CASCADE,
DROP COLUMN IF EXISTS suspended_at CASCADE,
DROP COLUMN IF EXISTS suspended_reason CASCADE,
DROP COLUMN IF EXISTS suspended_by CASCADE,
DROP COLUMN IF EXISTS updated_at CASCADE;

-- Add new columns to organizations
ALTER TABLE public.organizations 
ADD COLUMN IF NOT EXISTS slug text UNIQUE,
ADD COLUMN IF NOT EXISTS logo_url text,
ADD COLUMN IF NOT EXISTS brand_primary text,
ADD COLUMN IF NOT EXISTS brand_accent text,
ADD COLUMN IF NOT EXISTS plan text NOT NULL DEFAULT 'beta' CHECK (plan IN ('beta', 'basic', 'standard', 'premium')),
ADD COLUMN IF NOT EXISTS seat_cap int NOT NULL DEFAULT 25,
ADD COLUMN IF NOT EXISTS is_suspended boolean NOT NULL DEFAULT false,
ADD COLUMN IF NOT EXISTS created_by uuid REFERENCES auth.users(id);

-- Update slug constraint
ALTER TABLE public.organizations 
ADD CONSTRAINT organizations_slug_check CHECK (slug ~ '^[a-z0-9-]{3,}$');

-- Create index on slug for fast lookups
CREATE INDEX IF NOT EXISTS idx_organizations_slug ON public.organizations(slug);
CREATE INDEX IF NOT EXISTS idx_organizations_created_by ON public.organizations(created_by);

-- Update org_members table structure
ALTER TABLE public.org_members 
RENAME COLUMN organization_id TO org_id;

ALTER TABLE public.org_members 
DROP COLUMN IF EXISTS invited_by CASCADE,
DROP COLUMN IF EXISTS joined_at CASCADE,
DROP COLUMN IF EXISTS removed_at CASCADE,
DROP COLUMN IF EXISTS updated_at CASCADE,
DROP COLUMN IF EXISTS profiles CASCADE;

-- Add new columns to org_members  
ALTER TABLE public.org_members 
ADD COLUMN IF NOT EXISTS joined_at timestamptz DEFAULT now();

-- Update role check constraint
ALTER TABLE public.org_members 
DROP CONSTRAINT IF EXISTS org_members_role_check CASCADE;

ALTER TABLE public.org_members 
ADD CONSTRAINT org_members_role_check CHECK (role::text IN ('owner', 'instructor', 'student', 'parent'));

-- Update status check constraint  
ALTER TABLE public.org_members 
DROP CONSTRAINT IF EXISTS org_members_status_check CASCADE;

ALTER TABLE public.org_members 
ADD CONSTRAINT org_members_status_check CHECK (status::text IN ('active', 'invited', 'removed'));

-- Add unique constraint to prevent duplicate memberships
ALTER TABLE public.org_members 
DROP CONSTRAINT IF EXISTS unique_org_user_membership CASCADE;

ALTER TABLE public.org_members 
ADD CONSTRAINT unique_org_user_membership UNIQUE(org_id, user_id);

-- Create indexes on org_members
CREATE INDEX IF NOT EXISTS idx_org_members_org_id ON public.org_members(org_id);
CREATE INDEX IF NOT EXISTS idx_org_members_user_id ON public.org_members(user_id);
CREATE INDEX IF NOT EXISTS idx_org_members_role ON public.org_members(role);
CREATE INDEX IF NOT EXISTS idx_org_members_status ON public.org_members(status);

-- Update org_invitations to org_invites structure
ALTER TABLE public.org_invitations 
RENAME TO org_invites;

ALTER TABLE public.org_invites 
RENAME COLUMN organization_id TO org_id;

ALTER TABLE public.org_invites 
RENAME COLUMN invitation_code TO code;

ALTER TABLE public.org_invites 
DROP COLUMN IF EXISTS invitation_link CASCADE,
DROP COLUMN IF EXISTS max_uses CASCADE,
DROP COLUMN IF EXISTS current_uses CASCADE,
DROP COLUMN IF EXISTS is_active CASCADE,
DROP COLUMN IF EXISTS metadata CASCADE,
DROP COLUMN IF EXISTS accepted_by CASCADE,
DROP COLUMN IF EXISTS accepted_at CASCADE,
DROP COLUMN IF EXISTS updated_at CASCADE;

-- Add new columns to org_invites
ALTER TABLE public.org_invites 
ADD COLUMN IF NOT EXISTS role text NOT NULL DEFAULT 'student' CHECK (role IN ('student', 'parent', 'instructor')),
ADD COLUMN IF NOT EXISTS max_uses int NOT NULL DEFAULT 1,
ADD COLUMN IF NOT EXISTS uses_count int NOT NULL DEFAULT 0,
ADD COLUMN IF NOT EXISTS created_by uuid NOT NULL REFERENCES auth.users(id);

-- Rename columns in org_invites
ALTER TABLE public.org_invites 
RENAME COLUMN invited_by TO created_by;

ALTER TABLE public.org_invites 
RENAME COLUMN expires_at TO expires_at;

-- Create indexes on org_invites
CREATE INDEX IF NOT EXISTS idx_org_invites_org_id ON public.org_invites(org_id);
CREATE INDEX IF NOT EXISTS idx_org_invites_code ON public.org_invites(code);
CREATE INDEX IF NOT EXISTS idx_org_invites_email ON public.org_invites(email);
CREATE INDEX IF NOT EXISTS idx_org_invites_created_by ON public.org_invites(created_by);

-- Create org_groups table
CREATE TABLE IF NOT EXISTS public.org_groups (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  name text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create indexes on org_groups
CREATE INDEX IF NOT EXISTS idx_org_groups_org_id ON public.org_groups(org_id);

-- Create org_group_members table
CREATE TABLE IF NOT EXISTS public.org_group_members (
  group_id uuid NOT NULL REFERENCES public.org_groups(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  PRIMARY KEY (group_id, user_id)
);

-- Create indexes on org_group_members
CREATE INDEX IF NOT EXISTS idx_org_group_members_group_id ON public.org_group_members(group_id);
CREATE INDEX IF NOT EXISTS idx_org_group_members_user_id ON public.org_group_members(user_id);

-- Create org_assignments table
CREATE TABLE IF NOT EXISTS public.org_assignments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  type text NOT NULL CHECK (type IN ('course', 'goal', 'note')),
  resource_id text NOT NULL,
  title text,
  created_by uuid NOT NULL REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now()
);

-- Create indexes on org_assignments
CREATE INDEX IF NOT EXISTS idx_org_assignments_org_id ON public.org_assignments(org_id);
CREATE INDEX IF NOT EXISTS idx_org_assignments_type ON public.org_assignments(type);
CREATE INDEX IF NOT EXISTS idx_org_assignments_created_by ON public.org_assignments(created_by);

-- Create org_assignment_targets table
CREATE TABLE IF NOT EXISTS public.org_assignment_targets (
  assignment_id uuid NOT NULL REFERENCES public.org_assignments(id) ON DELETE CASCADE,
  target_type text NOT NULL CHECK (target_type IN ('member', 'group')),
  target_id uuid NOT NULL,
  PRIMARY KEY (assignment_id, target_type, target_id)
);

-- Create indexes on org_assignment_targets
CREATE INDEX IF NOT EXISTS idx_org_assignment_targets_assignment_id ON public.org_assignment_targets(assignment_id);
CREATE INDEX IF NOT EXISTS idx_org_assignment_targets_target_id ON public.org_assignment_targets(target_id);

-- Create org_portal_settings table
CREATE TABLE IF NOT EXISTS public.org_portal_settings (
  org_id uuid PRIMARY KEY REFERENCES public.organizations(id) ON DELETE CASCADE,
  require_invite boolean NOT NULL DEFAULT false,
  allow_self_signup boolean NOT NULL DEFAULT true,
  default_auto_enroll_courses text[] DEFAULT '{}',
  default_auto_goals text[] DEFAULT '{}'
);

-- Enable RLS on all org tables
ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.org_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.org_invites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.org_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.org_group_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.org_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.org_assignment_targets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.org_portal_settings ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Organizations can be read by admins" ON public.organizations;
DROP POLICY IF EXISTS "Organizations can be created by admins" ON public.organizations;
DROP POLICY IF EXISTS "Organizations can be updated by admins" ON public.organizations;
DROP POLICY IF EXISTS "Users can view organizations they belong to" ON public.organizations;

-- Organizations RLS Policies
-- Public can view basic org info by slug for portal landing
CREATE POLICY "Public can view basic org info by slug" ON public.organizations
  FOR SELECT USING (true);

-- Members can read their org details  
CREATE POLICY "Members can read their org" ON public.organizations
  FOR SELECT USING (
    id IN (
      SELECT org_id FROM public.org_members 
      WHERE user_id = auth.uid() AND status = 'active'
    )
  );

-- Owners and admins can update organizations
CREATE POLICY "Owners can update their org" ON public.organizations
  FOR UPDATE USING (
    (created_by = auth.uid()) OR 
    (id IN (
      SELECT org_id FROM public.org_members 
      WHERE user_id = auth.uid() AND role = 'owner' AND status = 'active'
    )) OR
    has_role(auth.uid(), 'admin'::app_role)
  );

-- Admins and authenticated users can create orgs
CREATE POLICY "Authenticated users can create orgs" ON public.organizations
  FOR INSERT WITH CHECK (
    auth.role() = 'authenticated' AND created_by = auth.uid()
  );

-- Org Members RLS Policies
DROP POLICY IF EXISTS "Users can view their own membership" ON public.org_members;
DROP POLICY IF EXISTS "Users can update their own membership" ON public.org_members;
DROP POLICY IF EXISTS "Organization owners can manage members" ON public.org_members;

-- Users can view/update their own membership
CREATE POLICY "Users can view their own membership" ON public.org_members
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can update their own membership" ON public.org_members
  FOR UPDATE USING (user_id = auth.uid());

-- Org owners and instructors can view all members in their org
CREATE POLICY "Org leaders can view org members" ON public.org_members
  FOR SELECT USING (
    org_id IN (
      SELECT org_id FROM public.org_members 
      WHERE user_id = auth.uid() 
      AND role IN ('owner', 'instructor') 
      AND status = 'active'
    )
  );

-- Only owners can add/remove members
CREATE POLICY "Org owners can manage members" ON public.org_members
  FOR ALL USING (
    org_id IN (
      SELECT org_id FROM public.org_members 
      WHERE user_id = auth.uid() 
      AND role = 'owner' 
      AND status = 'active'
    ) OR has_role(auth.uid(), 'admin'::app_role)
  );

-- Users can insert their own membership via invite acceptance
CREATE POLICY "Users can join via invite" ON public.org_members
  FOR INSERT WITH CHECK (user_id = auth.uid());

-- Org Invites RLS Policies
DROP POLICY IF EXISTS "Organization owners can manage invitations" ON public.org_invites;
DROP POLICY IF EXISTS "Users can view invitations for their organizations" ON public.org_invites;

-- Public can select invite by code if not expired
CREATE POLICY "Public can view valid invites by code" ON public.org_invites
  FOR SELECT USING (
    (expires_at IS NULL OR expires_at > now()) AND
    uses_count < max_uses AND
    org_id IN (
      SELECT id FROM public.organizations WHERE NOT is_suspended
    )
  );

-- Org owners and instructors can manage invites
CREATE POLICY "Org leaders can manage invites" ON public.org_invites
  FOR ALL USING (
    org_id IN (
      SELECT org_id FROM public.org_members 
      WHERE user_id = auth.uid() 
      AND role IN ('owner', 'instructor') 
      AND status = 'active'
    ) OR has_role(auth.uid(), 'admin'::app_role)
  );

-- Org Groups RLS Policies  
CREATE POLICY "Org members can view groups" ON public.org_groups
  FOR SELECT USING (
    org_id IN (
      SELECT org_id FROM public.org_members 
      WHERE user_id = auth.uid() AND status = 'active'
    )
  );

CREATE POLICY "Org leaders can manage groups" ON public.org_groups
  FOR ALL USING (
    org_id IN (
      SELECT org_id FROM public.org_members 
      WHERE user_id = auth.uid() 
      AND role IN ('owner', 'instructor') 
      AND status = 'active'
    ) OR has_role(auth.uid(), 'admin'::app_role)
  );

-- Org Group Members RLS Policies
CREATE POLICY "Group members can view membership" ON public.org_group_members
  FOR SELECT USING (
    user_id = auth.uid() OR
    group_id IN (
      SELECT g.id FROM public.org_groups g
      JOIN public.org_members m ON g.org_id = m.org_id
      WHERE m.user_id = auth.uid() 
      AND m.role IN ('owner', 'instructor') 
      AND m.status = 'active'
    )
  );

CREATE POLICY "Org leaders can manage group membership" ON public.org_group_members
  FOR ALL USING (
    group_id IN (
      SELECT g.id FROM public.org_groups g
      JOIN public.org_members m ON g.org_id = m.org_id
      WHERE m.user_id = auth.uid() 
      AND m.role IN ('owner', 'instructor') 
      AND m.status = 'active'
    ) OR has_role(auth.uid(), 'admin'::app_role)
  );

-- Org Assignments RLS Policies
CREATE POLICY "Org members can view assignments" ON public.org_assignments
  FOR SELECT USING (
    org_id IN (
      SELECT org_id FROM public.org_members 
      WHERE user_id = auth.uid() AND status = 'active'
    )
  );

CREATE POLICY "Org leaders can manage assignments" ON public.org_assignments
  FOR ALL USING (
    org_id IN (
      SELECT org_id FROM public.org_members 
      WHERE user_id = auth.uid() 
      AND role IN ('owner', 'instructor') 
      AND status = 'active'
    ) OR has_role(auth.uid(), 'admin'::app_role)
  );

-- Assignment Targets RLS Policies
CREATE POLICY "Assignment targets visible to org members" ON public.org_assignment_targets
  FOR SELECT USING (
    assignment_id IN (
      SELECT a.id FROM public.org_assignments a
      JOIN public.org_members m ON a.org_id = m.org_id
      WHERE m.user_id = auth.uid() AND m.status = 'active'
    )
  );

CREATE POLICY "Org leaders can manage assignment targets" ON public.org_assignment_targets
  FOR ALL USING (
    assignment_id IN (
      SELECT a.id FROM public.org_assignments a
      JOIN public.org_members m ON a.org_id = m.org_id
      WHERE m.user_id = auth.uid() 
      AND m.role IN ('owner', 'instructor') 
      AND m.status = 'active'
    ) OR has_role(auth.uid(), 'admin'::app_role)
  );

-- Portal Settings RLS Policies
CREATE POLICY "Org members can view portal settings" ON public.org_portal_settings
  FOR SELECT USING (
    org_id IN (
      SELECT org_id FROM public.org_members 
      WHERE user_id = auth.uid() AND status = 'active'
    )
  );

CREATE POLICY "Org owners can manage portal settings" ON public.org_portal_settings
  FOR ALL USING (
    org_id IN (
      SELECT org_id FROM public.org_members 
      WHERE user_id = auth.uid() 
      AND role = 'owner' 
      AND status = 'active'
    ) OR has_role(auth.uid(), 'admin'::app_role)
  );

-- Helper functions for org operations
CREATE OR REPLACE FUNCTION public.create_organization(
  p_name text,
  p_slug text,
  p_plan text DEFAULT 'beta'
) RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_org_id uuid;
BEGIN
  -- Create the organization
  INSERT INTO public.organizations (name, slug, plan, created_by)
  VALUES (p_name, p_slug, p_plan, auth.uid())
  RETURNING id INTO v_org_id;
  
  -- Create owner membership
  INSERT INTO public.org_members (org_id, user_id, role, status)
  VALUES (v_org_id, auth.uid(), 'owner', 'active');
  
  -- Create default portal settings
  INSERT INTO public.org_portal_settings (org_id)
  VALUES (v_org_id);
  
  RETURN v_org_id;
END;
$$;

CREATE OR REPLACE FUNCTION public.org_seat_available(p_org_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_seat_cap int;
  v_current_count int;
BEGIN
  -- Get seat cap
  SELECT seat_cap INTO v_seat_cap
  FROM public.organizations
  WHERE id = p_org_id;
  
  -- Count active members
  SELECT COUNT(*) INTO v_current_count
  FROM public.org_members
  WHERE org_id = p_org_id AND status = 'active';
  
  RETURN v_current_count < v_seat_cap;
END;
$$;

CREATE OR REPLACE FUNCTION public.accept_invite(p_code text)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_invite RECORD;
  v_user_id uuid := auth.uid();
  v_result jsonb;
BEGIN
  -- Get invite details
  SELECT * INTO v_invite
  FROM public.org_invites
  WHERE code = p_code
  AND (expires_at IS NULL OR expires_at > now())
  AND uses_count < max_uses;
  
  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'error', 'Invalid or expired invite code');
  END IF;
  
  -- Check if org has available seats
  IF NOT public.org_seat_available(v_invite.org_id) THEN
    RETURN jsonb_build_object('success', false, 'error', 'Organization has reached maximum capacity');
  END IF;
  
  -- Check if user is already a member
  IF EXISTS (
    SELECT 1 FROM public.org_members 
    WHERE org_id = v_invite.org_id AND user_id = v_user_id
  ) THEN
    RETURN jsonb_build_object('success', false, 'error', 'You are already a member of this organization');
  END IF;
  
  -- Create membership
  INSERT INTO public.org_members (org_id, user_id, role, status)
  VALUES (v_invite.org_id, v_user_id, v_invite.role, 'active');
  
  -- Increment invite usage
  UPDATE public.org_invites
  SET uses_count = uses_count + 1
  WHERE id = v_invite.id;
  
  -- Return success with org info
  SELECT jsonb_build_object(
    'success', true,
    'org_id', v_invite.org_id,
    'role', v_invite.role
  ) INTO v_result;
  
  RETURN v_result;
END;
$$;