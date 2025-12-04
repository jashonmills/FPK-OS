
-- First, drop the problematic policy
DROP POLICY IF EXISTS "Members can view their organizations" ON public.organizations;

-- Create a security definer function to check org membership without triggering RLS recursion
CREATE OR REPLACE FUNCTION public.user_is_org_member(org_id uuid, check_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.org_members
    WHERE org_members.org_id = user_is_org_member.org_id
    AND org_members.user_id = check_user_id
    AND org_members.status = 'active'
  );
$$;

-- Now create the policy using the security definer function
CREATE POLICY "Members can view their organizations"
ON public.organizations
FOR SELECT
TO authenticated
USING (
  user_is_org_member(id, auth.uid())
);

-- Add helpful comment
COMMENT ON POLICY "Members can view their organizations" ON public.organizations 
IS 'Allows users to view organizations where they have an active membership (uses security definer function to avoid recursion)';
