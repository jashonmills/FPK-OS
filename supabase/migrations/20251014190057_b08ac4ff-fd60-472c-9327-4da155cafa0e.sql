-- Fix RLS policies for phoenix_messages to allow edge function inserts and proper analytics

-- Drop existing policies if any
DROP POLICY IF EXISTS "Enable insert for edge functions" ON phoenix_messages;
DROP POLICY IF EXISTS "Enable read for users" ON phoenix_messages;
DROP POLICY IF EXISTS "Enable read for analytics" ON phoenix_messages;

-- Enable RLS
ALTER TABLE phoenix_messages ENABLE ROW LEVEL SECURITY;

-- Policy 1: Allow edge functions to insert messages (using service_role or authenticated context)
CREATE POLICY "Edge functions can insert messages"
ON phoenix_messages
FOR INSERT
TO authenticated
WITH CHECK (true);

-- Policy 2: Users can read their own conversation messages
CREATE POLICY "Users can read own conversation messages"
ON phoenix_messages
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM phoenix_conversations pc
    WHERE pc.id = phoenix_messages.conversation_id
    AND pc.user_id = auth.uid()
  )
);

-- Policy 3: Admins can read all messages
CREATE POLICY "Admins can read all messages"
ON phoenix_messages
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_roles.user_id = auth.uid()
    AND user_roles.role = 'admin'
  )
);

-- Ensure phoenix_conversations also has proper RLS
DROP POLICY IF EXISTS "Users can read own conversations" ON phoenix_conversations;
DROP POLICY IF EXISTS "Edge functions can insert conversations" ON phoenix_conversations;
DROP POLICY IF EXISTS "Edge functions can update conversations" ON phoenix_conversations;
DROP POLICY IF EXISTS "Admins can read all conversations" ON phoenix_conversations;

ALTER TABLE phoenix_conversations ENABLE ROW LEVEL SECURITY;

-- Allow edge functions to insert conversations
CREATE POLICY "Edge functions can insert conversations"
ON phoenix_conversations
FOR INSERT
TO authenticated
WITH CHECK (true);

-- Allow edge functions to update conversations
CREATE POLICY "Edge functions can update conversations"
ON phoenix_conversations
FOR UPDATE
TO authenticated
USING (true);

-- Users can read their own conversations
CREATE POLICY "Users can read own conversations"
ON phoenix_conversations
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

-- Admins can read all conversations
CREATE POLICY "Admins can read all conversations"
ON phoenix_conversations
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_roles.user_id = auth.uid()
    AND user_roles.role = 'admin'
  )
);

-- Fix phoenix_governor_logs RLS as well
DROP POLICY IF EXISTS "Edge functions can insert governor logs" ON phoenix_governor_logs;
DROP POLICY IF EXISTS "Admins can read governor logs" ON phoenix_governor_logs;

ALTER TABLE phoenix_governor_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Edge functions can insert governor logs"
ON phoenix_governor_logs
FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Admins can read governor logs"
ON phoenix_governor_logs
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_roles.user_id = auth.uid()
    AND user_roles.role = 'admin'
  )
);