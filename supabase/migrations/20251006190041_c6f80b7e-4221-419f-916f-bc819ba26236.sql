-- Add DELETE policy for organization owners
CREATE POLICY "Org owners can delete their organizations"
ON organizations
FOR DELETE
TO authenticated
USING (owner_id = auth.uid());