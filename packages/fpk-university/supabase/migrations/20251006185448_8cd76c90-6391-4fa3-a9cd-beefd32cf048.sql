-- Drop the problematic circular policies
DROP POLICY IF EXISTS "Org owners can manage all memberships in their org" ON org_members;
DROP POLICY IF EXISTS "Members can view their orgs via membership" ON organizations;

-- Recreate the org_members policy using the security definer function
CREATE POLICY "Org owners can manage all memberships in their org"
ON org_members
FOR ALL
USING (user_is_org_owner_direct(org_id, auth.uid()));

-- Recreate the organizations policy using the security definer function  
CREATE POLICY "Members can view their orgs via membership"
ON organizations
FOR SELECT
TO authenticated
USING (user_is_org_member_direct(id, auth.uid()));