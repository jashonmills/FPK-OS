-- Fix infinite recursion in conversation_participants SELECT policy
-- Drop the problematic policy
DROP POLICY IF EXISTS "Users can view their conversation participants" ON conversation_participants;

-- Create a security definer function to check if user is in a specific conversation
-- This bypasses RLS and prevents recursion
CREATE OR REPLACE FUNCTION public.user_in_conversation(conv_id uuid, check_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM conversation_participants
    WHERE conversation_id = conv_id
    AND user_id = check_user_id
  );
$$;

-- Create new SELECT policy using the security definer function
-- Users can see participant records for conversations they're in
CREATE POLICY "Users can view participants in their conversations" ON conversation_participants
FOR SELECT
USING (
  user_in_conversation(conversation_id, auth.uid())
);