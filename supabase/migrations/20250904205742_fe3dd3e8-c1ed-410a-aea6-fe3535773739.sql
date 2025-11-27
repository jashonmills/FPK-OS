-- Drop existing policies
DROP POLICY IF EXISTS "Users can create their own organizations" ON public.organizations;
DROP POLICY IF EXISTS "Users can view accessible organizations" ON public.organizations;
DROP POLICY IF EXISTS "Owners and admins can update organizations" ON public.organizations;
DROP POLICY IF EXISTS "Organization owners can manage their orgs" ON public.organizations;
DROP POLICY IF EXISTS "Organization members can view themselves" ON public.org_members;
DROP POLICY IF EXISTS "Users can view members of organizations they belong to" ON public.org_members;
DROP POLICY IF EXISTS "Organization owners can manage members" ON public.org_members;

-- Drop the existing function that caused recursion
DROP FUNCTION IF EXISTS public.user_can_view_org(uuid);

-- Create admin helper function
CREATE OR REPLACE FUNCTION public.auth_is_admin()
RETURNS boolean 
LANGUAGE sql 
STABLE 
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COALESCE(
    (current_setting('request.jwt.claims', true)::jsonb ->> 'role') = 'admin',
    EXISTS (
      SELECT 1 FROM public.user_roles 
      WHERE user_id = auth.uid() 
      AND role = 'admin'
    ),
    false
  )
$$;

-- ORGANIZATIONS POLICIES

-- READ: users can see orgs they belong to or own; admins see all
CREATE POLICY org_select_members
ON public.organizations
FOR SELECT
USING (
  auth_is_admin()
  OR owner_id = auth.uid()
  OR EXISTS (
    SELECT 1 FROM public.org_members m
    WHERE m.organization_id = organizations.id
      AND m.user_id = auth.uid()
  )
);

-- INSERT: a logged-in user may create an org only if they set owner_id = auth.uid()
CREATE POLICY org_insert_owner_self
ON public.organizations
FOR INSERT
WITH CHECK ( auth.uid() IS NOT NULL AND owner_id = auth.uid() );

-- UPDATE: owner or admin can update
CREATE POLICY org_update_owner_or_admin
ON public.organizations
FOR UPDATE
USING (auth_is_admin() OR owner_id = auth.uid())
WITH CHECK (auth_is_admin() OR owner_id = auth.uid());

-- DELETE: owner or admin
CREATE POLICY org_delete_owner_or_admin
ON public.organizations
FOR DELETE
USING (auth_is_admin() OR owner_id = auth.uid());

-- ORGANIZATION_MEMBERS POLICIES

-- READ: members and admins
CREATE POLICY org_members_select
ON public.org_members
FOR SELECT
USING (
  auth_is_admin()
  OR user_id = auth.uid()
  OR EXISTS (
    SELECT 1 FROM public.org_members mm
    WHERE mm.organization_id = org_members.organization_id
      AND mm.user_id = auth.uid()
  )
);

-- INSERT: owner or admin of the org can add members
CREATE POLICY org_members_insert_by_owner_or_admin
ON public.org_members
FOR INSERT
WITH CHECK (
  auth_is_admin()
  OR EXISTS (
    SELECT 1 FROM public.organizations o
    WHERE o.id = org_members.organization_id
      AND o.owner_id = auth.uid()
  )
);

-- UPDATE/DELETE: owner or admin of the org
CREATE POLICY org_members_modify_by_owner_or_admin
ON public.org_members
FOR UPDATE 
USING (
  auth_is_admin()
  OR EXISTS (
    SELECT 1 FROM public.organizations o
    WHERE o.id = org_members.organization_id
      AND o.owner_id = auth.uid()
  )
)
WITH CHECK (
  auth_is_admin()
  OR EXISTS (
    SELECT 1 FROM public.organizations o
    WHERE o.id = org_members.organization_id
      AND o.owner_id = auth.uid()
  )
);

CREATE POLICY org_members_delete_by_owner_or_admin
ON public.org_members
FOR DELETE
USING (
  auth_is_admin()
  OR EXISTS (
    SELECT 1 FROM public.organizations o
    WHERE o.id = org_members.organization_id
      AND o.owner_id = auth.uid()
  )
);