-- Fix infinite recursion in conversation_participants RLS policies
-- Drop the problematic policy
DROP POLICY IF EXISTS "Admins can add participants" ON conversation_participants;

-- Create a simpler policy that avoids circular references
-- Allow users to add participants if they created the conversation
CREATE POLICY "Conversation creators can add participants"
ON conversation_participants
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM conversations
    WHERE conversations.id = conversation_participants.conversation_id
    AND conversations.created_by = auth.uid()
  )
);

-- Create a separate policy for admins using a security definer function
-- First, create a function that checks if user is admin (bypasses RLS)
CREATE OR REPLACE FUNCTION is_conversation_admin(conv_id uuid, user_id uuid)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM conversation_participants
    WHERE conversation_id = conv_id
    AND user_id = user_id
    AND role = 'ADMIN'
  );
$$;

-- Now create the admin policy using the function
CREATE POLICY "Admins can add participants via function"
ON conversation_participants
FOR INSERT
WITH CHECK (
  is_conversation_admin(conversation_participants.conversation_id, auth.uid())
);