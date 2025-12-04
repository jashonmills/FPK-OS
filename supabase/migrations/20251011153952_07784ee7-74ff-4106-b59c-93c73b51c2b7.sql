-- Update RLS policies to include admin role
-- Admins have similar permissions to owners, except for subscription management

-- Allow admins to view and update organization settings
DROP POLICY IF EXISTS "Organization owners and admins can update orgs" ON public.organizations;
CREATE POLICY "Organization owners and admins can update orgs"
  ON public.organizations
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.org_members
      WHERE org_members.org_id = organizations.id
      AND org_members.user_id = auth.uid()
      AND org_members.role IN ('owner', 'admin')
      AND org_members.status = 'active'
    )
  );

-- Allow admins to view members
DROP POLICY IF EXISTS "Org leaders can view members" ON public.org_members;
CREATE POLICY "Org leaders can view members"
  ON public.org_members
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.org_members om
      WHERE om.org_id = org_members.org_id
      AND om.user_id = auth.uid()
      AND om.role IN ('owner', 'admin', 'instructor')
      AND om.status = 'active'
    )
  );

-- Allow admins to update members (except owners/admins)
DROP POLICY IF EXISTS "Org owners and admins can update members" ON public.org_members;
CREATE POLICY "Org owners and admins can update members"
  ON public.org_members
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.org_members om
      WHERE om.org_id = org_members.org_id
      AND om.user_id = auth.uid()
      AND om.role IN ('owner', 'admin')
      AND om.status = 'active'
      -- Prevent admins from modifying owners or other admins
      AND (om.role = 'owner' OR org_members.role NOT IN ('owner', 'admin'))
    )
  );

-- Allow admins to create invitations
DROP POLICY IF EXISTS "Org leaders can create invitations" ON public.user_invites;
CREATE POLICY "Org leaders can create invitations"
  ON public.user_invites
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.org_members
      WHERE org_members.org_id = user_invites.org_id
      AND org_members.user_id = auth.uid()
      AND org_members.role IN ('owner', 'admin', 'instructor')
      AND org_members.status = 'active'
    )
  );

-- Allow admins to manage groups
DROP POLICY IF EXISTS "Org leaders can create groups" ON public.org_groups;
CREATE POLICY "Org leaders can create groups"
  ON public.org_groups
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.org_members
      WHERE org_members.org_id = org_groups.org_id
      AND org_members.user_id = auth.uid()
      AND org_members.role IN ('owner', 'admin', 'instructor')
      AND org_members.status = 'active'
    )
  );

DROP POLICY IF EXISTS "Org leaders can update groups" ON public.org_groups;
CREATE POLICY "Org leaders can update groups"
  ON public.org_groups
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.org_members
      WHERE org_members.org_id = org_groups.org_id
      AND org_members.user_id = auth.uid()
      AND org_members.role IN ('owner', 'admin', 'instructor')
      AND org_members.status = 'active'
    )
  );

DROP POLICY IF EXISTS "Org leaders can delete groups" ON public.org_groups;
CREATE POLICY "Org leaders can delete groups"
  ON public.org_groups
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.org_members
      WHERE org_members.org_id = org_groups.org_id
      AND org_members.user_id = auth.uid()
      AND org_members.role IN ('owner', 'admin', 'instructor')
      AND org_members.status = 'active'
    )
  );