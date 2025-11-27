-- Drop the three conflicting policies for anon on org_students
DROP POLICY IF EXISTS "Anonymous users can view students for activation" ON public.org_students;
DROP POLICY IF EXISTS "Anon can view org students for token validation" ON public.org_students;
DROP POLICY IF EXISTS "Anon users can validate activation tokens" ON public.org_students;

-- Create a single consolidated policy for token validation
CREATE POLICY "Anonymous users can view students with tokens"
ON public.org_students
FOR SELECT
TO anon
USING (activation_token IS NOT NULL);