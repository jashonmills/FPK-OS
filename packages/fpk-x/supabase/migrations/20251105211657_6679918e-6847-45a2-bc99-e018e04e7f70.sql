-- Add INSERT policy for organizations table
-- Allow authenticated users to create their own organizations
CREATE POLICY "Users can create their own organizations"
ON public.organizations
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = created_by);