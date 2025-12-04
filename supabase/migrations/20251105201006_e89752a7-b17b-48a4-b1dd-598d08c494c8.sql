-- Drop existing policies on organizations table
DROP POLICY IF EXISTS "org_members_view_own_org" ON organizations;
DROP POLICY IF EXISTS "org_owners_manage_own_org" ON organizations;
DROP POLICY IF EXISTS "users_create_new_org" ON organizations;

-- Allow users to view organizations they created OR are members of
CREATE POLICY "users_view_their_orgs"
ON organizations
FOR SELECT
TO authenticated
USING (
  created_by = auth.uid()
  OR id IN (
    SELECT organization_id FROM organization_members
    WHERE user_id = auth.uid() AND is_active = true
  )
);

-- Allow users to create new organizations
CREATE POLICY "users_create_new_org"
ON organizations
FOR INSERT
TO authenticated
WITH CHECK (created_by = auth.uid());

-- Allow org creators to update their organization
CREATE POLICY "org_creators_update"
ON organizations
FOR UPDATE
TO authenticated
USING (created_by = auth.uid())
WITH CHECK (created_by = auth.uid());

-- Allow org creators to delete their organization
CREATE POLICY "org_creators_delete"
ON organizations
FOR DELETE
TO authenticated
USING (created_by = auth.uid());