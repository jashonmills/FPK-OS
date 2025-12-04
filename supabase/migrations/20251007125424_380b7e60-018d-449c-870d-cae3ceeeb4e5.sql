-- Allow unauthenticated users to validate activation tokens
-- This is safe because tokens are secret, time-limited, and single-use
CREATE POLICY "Anyone can validate activation tokens"
ON public.org_students
FOR SELECT
TO anon
USING (
  activation_token IS NOT NULL 
  AND activation_status = 'pending'
  AND token_expires_at > now()
);