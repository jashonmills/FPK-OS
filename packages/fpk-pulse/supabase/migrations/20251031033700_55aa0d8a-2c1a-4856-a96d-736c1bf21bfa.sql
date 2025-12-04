-- Fix conversations SELECT policy to allow creators to view their conversations
-- even before being added as participants
DROP POLICY IF EXISTS "Users can view conversations they participate in" ON public.conversations;

CREATE POLICY "Users can view conversations they participate in"
  ON public.conversations FOR SELECT
  USING (
    is_conversation_participant(id, auth.uid()) 
    OR created_by = auth.uid()
  );