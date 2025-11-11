-- Drop the incorrect INSERT policy for messages
DROP POLICY IF EXISTS "Users can send messages to their conversations" ON messages;

-- Create correct INSERT policy that checks persona ownership
CREATE POLICY "Users can send messages via their personas"
ON messages
FOR INSERT
TO public
WITH CHECK (
  -- Check that the user owns the persona being used as sender_id
  EXISTS (
    SELECT 1 FROM personas
    WHERE personas.id = messages.sender_id
    AND personas.user_id = auth.uid()
  )
  AND
  -- Check that the user is a participant in the conversation
  EXISTS (
    SELECT 1 FROM conversation_participants
    WHERE conversation_participants.conversation_id = messages.conversation_id
    AND conversation_participants.user_id = auth.uid()
  )
);