-- Fix RLS policy for organizations table to show user's orgs
-- Drop problematic policy that may be causing recursion
DROP POLICY IF EXISTS "Members can view their organizations" ON public.organizations;
DROP POLICY IF EXISTS "Anyone can view active organizations" ON public.organizations;

-- Create simplified policy using direct EXISTS check
CREATE POLICY "Members can view their orgs via membership"
ON public.organizations
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 
    FROM public.org_members 
    WHERE org_members.org_id = organizations.id 
    AND org_members.user_id = auth.uid() 
    AND org_members.status = 'active'
  )
);

-- Keep owner policy (should already exist)
CREATE POLICY "Owners can view their organizations" 
ON public.organizations
FOR SELECT
TO authenticated
USING (owner_id = auth.uid());