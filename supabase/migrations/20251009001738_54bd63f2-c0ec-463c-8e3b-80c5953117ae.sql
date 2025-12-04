-- Drop the problematic recursive policy
DROP POLICY IF EXISTS "Org leaders can view all org members" ON public.org_members;

-- Create security definer function to check if user is org leader
CREATE OR REPLACE FUNCTION public.user_is_org_leader_safe(check_org_id uuid, check_user_id uuid)
RETURNS boolean
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.org_members
    WHERE org_id = check_org_id
    AND user_id = check_user_id
    AND role IN ('owner', 'instructor')
    AND status = 'active'
  );
END;
$$;

-- Create new non-recursive policy using the security definer function
CREATE POLICY "Leaders view org members via function"
ON public.org_members
FOR SELECT
TO authenticated
USING (
  user_is_org_leader_safe(org_id, auth.uid())
);