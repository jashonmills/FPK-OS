-- Fix organizations INSERT policy to allow admins to create orgs for other users
DROP POLICY IF EXISTS "org_insert_by_authenticated" ON public.organizations;

CREATE POLICY "org_insert_by_authenticated_or_admin" ON public.organizations
FOR INSERT WITH CHECK (
  auth.uid() IS NOT NULL AND (
    -- Users can create orgs where they are the owner
    owner_id = auth.uid() OR
    -- Admins can create orgs for any user
    auth_is_admin()
  )
);