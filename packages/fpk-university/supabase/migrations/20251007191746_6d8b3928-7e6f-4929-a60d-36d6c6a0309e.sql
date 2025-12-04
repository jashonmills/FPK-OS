-- Allow anonymous users to validate activation tokens
-- This enables unauthenticated students to look up their activation record
-- Only exposes pending, non-expired tokens for security

CREATE POLICY "Anonymous users can validate pending activation tokens" 
ON public.org_students
FOR SELECT
TO anon
USING (
  activation_token IS NOT NULL
  AND activation_status = 'pending'
  AND token_expires_at > now()
);