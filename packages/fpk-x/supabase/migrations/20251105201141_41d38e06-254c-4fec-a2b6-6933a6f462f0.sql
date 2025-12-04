-- Create a security definer function to check organization access
CREATE OR REPLACE FUNCTION public.user_can_access_org(_user_id uuid, _org_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    -- User created the org
    SELECT 1 FROM organizations 
    WHERE id = _org_id AND created_by = _user_id
  ) OR EXISTS (
    -- User is a member of the org
    SELECT 1 FROM organization_members
    WHERE organization_id = _org_id 
      AND user_id = _user_id 
      AND is_active = true
  );
$$;

-- Drop existing SELECT policy
DROP POLICY IF EXISTS "users_view_their_orgs" ON organizations;

-- Create new SELECT policy using the security definer function
CREATE POLICY "users_view_their_orgs"
ON organizations
FOR SELECT
TO authenticated
USING (user_can_access_org(auth.uid(), id));