
-- Fix RLS policies for phoenix_messages to allow edge function to insert
DROP POLICY IF EXISTS "Admins can manage all phoenix messages" ON public.phoenix_messages;
DROP POLICY IF EXISTS "Users can view their own messages" ON public.phoenix_messages;

-- Allow edge functions (service role) to insert messages
CREATE POLICY "Service role can manage all phoenix messages"
ON public.phoenix_messages
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- Allow admins to view all messages
CREATE POLICY "Admins can view all phoenix messages"
ON public.phoenix_messages
FOR SELECT
TO public
USING (
  has_role(auth.uid(), 'admin'::app_role)
);

-- Allow users to view messages from their own conversations
CREATE POLICY "Users can view their own conversation messages"
ON public.phoenix_messages
FOR SELECT
TO public
USING (
  EXISTS (
    SELECT 1 FROM phoenix_conversations pc
    WHERE pc.id = phoenix_messages.conversation_id
    AND pc.user_id = auth.uid()
  )
);

-- Update message_intent enum to match what the code is using
ALTER TYPE message_intent ADD VALUE IF NOT EXISTS 'socratic_guidance';
ALTER TYPE message_intent ADD VALUE IF NOT EXISTS 'direct_answer';
ALTER TYPE message_intent ADD VALUE IF NOT EXISTS 'request_for_clarification';
ALTER TYPE message_intent ADD VALUE IF NOT EXISTS 'platform_question';
ALTER TYPE message_intent ADD VALUE IF NOT EXISTS 'query_user_data';
