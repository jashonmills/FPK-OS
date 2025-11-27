-- Allow org owners and instructors to view all members in their organization
CREATE POLICY "Org leaders can view all org members"
ON public.org_members
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.org_members om
    WHERE om.org_id = org_members.org_id
    AND om.user_id = auth.uid()
    AND om.role IN ('owner', 'instructor')
    AND om.status = 'active'
  )
);