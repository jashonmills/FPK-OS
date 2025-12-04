-- Allow authenticated users to read their own membership from org_members
CREATE POLICY "Users can read their own membership"
ON public.org_members
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);