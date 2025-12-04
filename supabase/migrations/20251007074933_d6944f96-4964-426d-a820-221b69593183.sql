-- Create a security definer function to check if user is linked to a student record
CREATE OR REPLACE FUNCTION public.user_is_linked_to_student(p_student_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 
    FROM public.org_students
    WHERE id = p_student_id 
    AND linked_user_id = auth.uid()
  );
$$;

-- Drop existing policy
DROP POLICY IF EXISTS "Users can view goals in organizations they belong to" ON public.org_goals;

-- Recreate the SELECT policy with proper student linking check
CREATE POLICY "Users can view goals in organizations they belong to" 
ON public.org_goals 
FOR SELECT 
USING (
  user_is_linked_to_student(student_id)
  OR user_is_org_owner(organization_id) 
  OR (user_is_org_member(organization_id, auth.uid()) AND (user_org_role(organization_id) = 'instructor'::member_role))
  OR has_role(auth.uid(), 'admin'::app_role)
);