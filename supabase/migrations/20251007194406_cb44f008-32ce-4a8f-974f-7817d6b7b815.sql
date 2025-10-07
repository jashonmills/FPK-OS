-- Allow anonymous users to view organizations by slug
-- This enables the student activation flow where anonymous users need to look up
-- the organization before validating their activation token
CREATE POLICY "Anonymous users can view organizations"
ON public.organizations
FOR SELECT
TO anon
USING (true);