
-- Add RLS policy to allow org members to view their organizations
CREATE POLICY "Members can view their organizations"
ON public.organizations
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.org_members
    WHERE org_members.org_id = organizations.id
    AND org_members.user_id = auth.uid()
    AND org_members.status = 'active'
  )
);

-- Add helpful comment
COMMENT ON POLICY "Members can view their organizations" ON public.organizations 
IS 'Allows users to view organizations where they have an active membership';
