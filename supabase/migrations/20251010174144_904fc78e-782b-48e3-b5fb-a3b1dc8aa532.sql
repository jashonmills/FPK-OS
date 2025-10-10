-- Add policy to allow anyone to view invites by token (needed for accept-invite page)
CREATE POLICY "Anyone can view invites by token"
ON public.invites
FOR SELECT
USING (true);