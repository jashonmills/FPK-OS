-- Fix recursive RLS policy on org_members table
-- Drop the problematic policy that causes infinite recursion
DROP POLICY IF EXISTS "Org leaders can view org members" ON public.org_members;

-- Create a security definer function to check if user is an org leader
CREATE OR REPLACE FUNCTION public.user_is_org_leader(check_org_id uuid, check_user_id uuid)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.org_members
    WHERE org_id = check_org_id
      AND user_id = check_user_id
      AND role IN ('owner', 'instructor')
      AND status = 'active'
  );
$$;

-- Create new policy using the security definer function
CREATE POLICY "Org leaders can view org members v2" 
ON public.org_members 
FOR SELECT 
USING (user_is_org_leader(org_id, auth.uid()));