-- Drop all dependent policies first
DROP POLICY IF EXISTS "Users can see conversations they are a part of" ON public.conversations;
DROP POLICY IF EXISTS "Users can see participants of conversations they are in" ON public.conversation_participants;
DROP POLICY IF EXISTS "Users can see messages in conversations they are a part of" ON public.messages;
DROP POLICY IF EXISTS "Users can send messages in conversations they are a part of" ON public.messages;
DROP POLICY IF EXISTS "Users can see attachments for messages they can see" ON public.message_attachments;
DROP POLICY IF EXISTS "Users can see mentions in conversations they are in" ON public.message_mentions;
DROP POLICY IF EXISTS "Users can create conversations" ON public.conversations;

-- Now drop the function with CASCADE
DROP FUNCTION IF EXISTS public.is_conversation_participant(uuid, uuid) CASCADE;

-- Recreate the helper function with correct parameter names
CREATE OR REPLACE FUNCTION public.is_conversation_participant(_user_id uuid, _conversation_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.conversation_participants
    WHERE user_id = _user_id
      AND conversation_id = _conversation_id
  )
$$;

-- Conversations policies
CREATE POLICY "Users can create conversations"
ON public.conversations
FOR INSERT
TO authenticated
WITH CHECK (created_by = auth.uid());

CREATE POLICY "Users can view conversations they participate in"
ON public.conversations
FOR SELECT
TO authenticated
USING (
  created_by = auth.uid() 
  OR public.is_conversation_participant(auth.uid(), id)
);

CREATE POLICY "Users can update conversations they created"
ON public.conversations
FOR UPDATE
TO authenticated
USING (created_by = auth.uid());

-- Conversation participants policies  
CREATE POLICY "Users can view participants of their conversations"
ON public.conversation_participants
FOR SELECT
TO authenticated
USING (public.is_conversation_participant(auth.uid(), conversation_id));

CREATE POLICY "Conversation creators can add participants"
ON public.conversation_participants
FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.conversations 
    WHERE id = conversation_id AND created_by = auth.uid()
  )
  OR user_id = auth.uid()
);

CREATE POLICY "Users can update their own participant record"
ON public.conversation_participants
FOR UPDATE
TO authenticated
USING (user_id = auth.uid());

-- Messages policies
CREATE POLICY "Users can view messages in their conversations"
ON public.messages
FOR SELECT
TO authenticated
USING (public.is_conversation_participant(auth.uid(), conversation_id));

CREATE POLICY "Users can send messages in their conversations"
ON public.messages
FOR INSERT
TO authenticated
WITH CHECK (
  sender_id = auth.uid() 
  AND public.is_conversation_participant(auth.uid(), conversation_id)
);

-- Message attachments policies
CREATE POLICY "Users can view attachments in their conversations"
ON public.message_attachments
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.messages m 
    WHERE m.id = message_id 
    AND public.is_conversation_participant(auth.uid(), m.conversation_id)
  )
);

-- Message mentions policies
CREATE POLICY "Users can view mentions in their conversations"
ON public.message_mentions
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.messages m 
    WHERE m.id = message_id 
    AND public.is_conversation_participant(auth.uid(), m.conversation_id)
  )
);