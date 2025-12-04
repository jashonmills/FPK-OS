-- Drop all existing policies on organization_members to start fresh
DROP POLICY IF EXISTS "authenticated_users_view_org_members" ON organization_members;
DROP POLICY IF EXISTS "org_owners_manage_members" ON organization_members;
DROP POLICY IF EXISTS "users_insert_self_as_org_owner" ON organization_members;
DROP POLICY IF EXISTS "org_members_view_peers" ON organization_members;

-- Simple policy: authenticated users can view all organization members
-- This avoids recursion since we don't query organization_members within the policy
CREATE POLICY "view_organization_members"
ON organization_members
FOR SELECT
TO authenticated
USING (true);

-- Org owners can manage members (using organizations table only, no recursion)
CREATE POLICY "org_owners_full_access"
ON organization_members
FOR ALL
TO authenticated
USING (
  organization_id IN (
    SELECT id FROM organizations 
    WHERE created_by = auth.uid()
  )
)
WITH CHECK (
  organization_id IN (
    SELECT id FROM organizations 
    WHERE created_by = auth.uid()
  )
);

-- Allow users to insert themselves as org_owner when creating a new org
CREATE POLICY "users_create_own_membership"
ON organization_members
FOR INSERT
TO authenticated
WITH CHECK (
  user_id = auth.uid() 
  AND role = 'org_owner'
  AND organization_id IN (
    SELECT id FROM organizations 
    WHERE created_by = auth.uid()
  )
);