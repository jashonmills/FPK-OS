-- Drop ALL conflicting anon policies on org_students
DROP POLICY IF EXISTS "Activation tokens can be validated publicly" ON public.org_students;
DROP POLICY IF EXISTS "Anonymous users can validate pending activation tokens" ON public.org_students;
DROP POLICY IF EXISTS "Anyone can validate activation tokens" ON public.org_students;

-- Keep only the simplest policy (already exists from previous migration)
-- "Anonymous users can view students with tokens"
-- This allows token validation to happen in application code, not at DB level