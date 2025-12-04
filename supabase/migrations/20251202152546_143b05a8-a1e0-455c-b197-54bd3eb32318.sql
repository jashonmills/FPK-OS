-- Add RLS policy for organization leaders to view activity_log for their organization
CREATE POLICY "Org leaders can view activity for their organization"
ON public.activity_log FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM org_members om
    WHERE om.org_id = activity_log.org_id
    AND om.user_id = auth.uid()
    AND om.status = 'active'
    AND om.role IN ('owner', 'admin', 'instructor', 'instructor_aide')
  )
  OR has_role(auth.uid(), 'admin'::app_role)
);