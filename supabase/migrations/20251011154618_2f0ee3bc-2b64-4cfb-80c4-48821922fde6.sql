-- Fix infinite recursion in org_members RLS policies
-- Create security definer function with proper type casting

-- Drop the function if it exists
DROP FUNCTION IF EXISTS public.user_has_org_role(uuid, uuid, text[]);

-- Create security definer function to check if user has specific roles in an org
CREATE OR REPLACE FUNCTION public.user_has_org_role(
  _user_id uuid,
  _org_id uuid,
  _roles text[]
)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.org_members
    WHERE user_id = _user_id
      AND org_id = _org_id
      AND role::text = ANY(_roles)  -- Cast enum to text for comparison
      AND status = 'active'::member_status
  );
$$;

-- Now update all org_members policies to use this function

-- Policy for viewing members
DROP POLICY IF EXISTS "Org leaders can view members" ON public.org_members;
CREATE POLICY "Org leaders can view members"
  ON public.org_members
  FOR SELECT
  USING (
    public.user_has_org_role(
      auth.uid(),
      org_members.org_id,
      ARRAY['owner', 'admin', 'instructor']
    )
  );

-- Policy for updating members
DROP POLICY IF EXISTS "Org owners and admins can update members" ON public.org_members;
CREATE POLICY "Org owners and admins can update members"
  ON public.org_members
  FOR UPDATE
  USING (
    -- User must be owner or admin
    public.user_has_org_role(
      auth.uid(),
      org_members.org_id,
      ARRAY['owner', 'admin']
    )
    -- Admins can't modify owners or other admins (only owners can)
    AND (
      public.user_has_org_role(auth.uid(), org_members.org_id, ARRAY['owner'])
      OR org_members.role::text NOT IN ('owner', 'admin')
    )
  );

-- Policy for viewing organizations
DROP POLICY IF EXISTS "Organization owners and admins can update orgs" ON public.organizations;
CREATE POLICY "Organization owners and admins can update orgs"
  ON public.organizations
  FOR UPDATE
  USING (
    public.user_has_org_role(
      auth.uid(),
      organizations.id,
      ARRAY['owner', 'admin']
    )
  );

-- Fix other policies that query org_members
DROP POLICY IF EXISTS "Org leaders can create invitations" ON public.user_invites;
CREATE POLICY "Org leaders can create invitations"
  ON public.user_invites
  FOR INSERT
  WITH CHECK (
    public.user_has_org_role(
      auth.uid(),
      user_invites.org_id,
      ARRAY['owner', 'admin', 'instructor']
    )
  );

DROP POLICY IF EXISTS "Org leaders can create groups" ON public.org_groups;
CREATE POLICY "Org leaders can create groups"
  ON public.org_groups
  FOR INSERT
  WITH CHECK (
    public.user_has_org_role(
      auth.uid(),
      org_groups.org_id,
      ARRAY['owner', 'admin', 'instructor']
    )
  );

DROP POLICY IF EXISTS "Org leaders can update groups" ON public.org_groups;
CREATE POLICY "Org leaders can update groups"
  ON public.org_groups
  FOR UPDATE
  USING (
    public.user_has_org_role(
      auth.uid(),
      org_groups.org_id,
      ARRAY['owner', 'admin', 'instructor']
    )
  );

DROP POLICY IF EXISTS "Org leaders can delete groups" ON public.org_groups;
CREATE POLICY "Org leaders can delete groups"
  ON public.org_groups
  FOR DELETE
  USING (
    public.user_has_org_role(
      auth.uid(),
      org_groups.org_id,
      ARRAY['owner', 'admin', 'instructor']
    )
  );