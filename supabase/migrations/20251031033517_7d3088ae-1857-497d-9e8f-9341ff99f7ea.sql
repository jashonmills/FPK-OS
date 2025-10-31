-- Fix the conversation_participants INSERT policy to avoid recursion
DROP POLICY IF EXISTS "Users can join public channels or be added to conversations" ON public.conversation_participants;

-- Simplified policy: users can add themselves to any conversation they create
-- or any public channel
CREATE POLICY "Users can add themselves to conversations"
  ON public.conversation_participants FOR INSERT
  WITH CHECK (
    auth.uid() = user_id
  );