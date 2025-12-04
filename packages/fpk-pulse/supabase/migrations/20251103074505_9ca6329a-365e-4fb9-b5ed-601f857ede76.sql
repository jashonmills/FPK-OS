-- Drop existing INSERT policy for time_entries
DROP POLICY IF EXISTS "Users can create their own time entries" ON time_entries;

-- Create new INSERT policy that allows users to create their own entries OR admins to create for anyone
CREATE POLICY "Users can create their own time entries OR admins can create for anyone"
ON time_entries
FOR INSERT
WITH CHECK (
  auth.uid() = user_id OR has_role(auth.uid(), 'admin'::app_role)
);