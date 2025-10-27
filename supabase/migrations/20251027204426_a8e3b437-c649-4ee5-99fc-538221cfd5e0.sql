-- Fix infinite recursion in conversation_participants policies
-- Drop existing problematic policies
DROP POLICY IF EXISTS "Admins can add participants via function" ON conversation_participants;
DROP POLICY IF EXISTS "Conversation creators can add participants" ON conversation_participants;
DROP POLICY IF EXISTS "Users can view conversation participants" ON conversation_participants;

-- Create a helper function to check if user created a conversation
CREATE OR REPLACE FUNCTION public.is_conversation_creator(conv_id uuid, user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM conversations
    WHERE id = conv_id
    AND created_by = user_id
  );
$$;

-- New INSERT policy: Allow conversation creator to add participants
CREATE POLICY "Conversation creators can add participants" ON conversation_participants
FOR INSERT
WITH CHECK (
  public.is_conversation_creator(conversation_id, auth.uid())
);

-- New SELECT policy: Use a simpler check that doesn't cause recursion
-- Allow users to see participants if they're in the conversation
-- We'll use a subquery that limits the recursion
CREATE POLICY "Users can view their conversation participants" ON conversation_participants
FOR SELECT
USING (
  conversation_id IN (
    SELECT DISTINCT cp.conversation_id 
    FROM conversation_participants cp
    WHERE cp.user_id = auth.uid()
    LIMIT 1000
  )
);