-- Drop the restrictive INSERT policy for user_bans
DROP POLICY IF EXISTS "Only service role can insert bans" ON public.user_bans;

-- Create new policy that allows admins to manually ban users
CREATE POLICY "Admins can manually ban users"
ON public.user_bans
FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid()
    AND role = 'admin'::app_role
  )
);

-- Also allow service role (edge functions) to insert bans
CREATE POLICY "Service can create bans"
ON public.user_bans
FOR INSERT
TO service_role
WITH CHECK (true);