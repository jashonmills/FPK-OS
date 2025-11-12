-- Drop the old restrictive policy that only allows owner and instructor
DROP POLICY IF EXISTS "Org instructors can manage students" ON public.org_students;

-- Create new policy allowing all educational roles (owner, admin, instructor, instructor_aide) to manage students
CREATE POLICY "Org educators can manage students"
ON public.org_students
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.org_members om
    WHERE om.org_id = org_students.org_id
    AND om.user_id = auth.uid()
    AND om.status = 'active'
    AND om.role IN ('owner', 'admin', 'instructor', 'instructor_aide')
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.org_members om
    WHERE om.org_id = org_students.org_id
    AND om.user_id = auth.uid()
    AND om.status = 'active'
    AND om.role IN ('owner', 'admin', 'instructor', 'instructor_aide')
  )
);