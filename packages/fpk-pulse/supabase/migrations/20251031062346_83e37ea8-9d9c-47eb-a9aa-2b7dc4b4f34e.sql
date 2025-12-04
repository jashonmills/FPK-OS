-- Update the conversations SELECT policy to allow viewing public channels
DROP POLICY IF EXISTS "Users can view conversations they participate in" ON public.conversations;

CREATE POLICY "Users can view their conversations and public channels" 
ON public.conversations
FOR SELECT 
USING (
  is_conversation_participant(id, auth.uid()) 
  OR created_by = auth.uid()
  OR is_private = false
);