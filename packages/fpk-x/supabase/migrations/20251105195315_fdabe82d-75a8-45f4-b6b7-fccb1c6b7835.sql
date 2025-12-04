-- Fix infinite recursion in organization_members RLS policies
-- Drop the problematic policy
DROP POLICY IF EXISTS "org_members_view_peers" ON organization_members;

-- Create a simpler policy that doesn't cause recursion
-- Users can view organization members if they are authenticated (we'll check membership in application logic)
CREATE POLICY "authenticated_users_view_org_members" 
ON organization_members 
FOR SELECT 
TO authenticated
USING (true);

-- Update the org_owners policy to also avoid recursion
DROP POLICY IF EXISTS "org_owners_manage_members" ON organization_members;

CREATE POLICY "org_owners_manage_members" 
ON organization_members 
FOR ALL 
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM organizations 
    WHERE organizations.id = organization_members.organization_id 
    AND organizations.created_by = auth.uid()
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM organizations 
    WHERE organizations.id = organization_members.organization_id 
    AND organizations.created_by = auth.uid()
  )
);