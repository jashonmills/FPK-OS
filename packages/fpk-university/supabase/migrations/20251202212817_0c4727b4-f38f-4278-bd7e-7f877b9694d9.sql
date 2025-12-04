-- FPK University Messaging System - Full Schema & Security Policies

-- =================================================================
-- 1. CREATE THE CORE TABLES
-- =================================================================

-- Table for conversations (both DMs and groups)
CREATE TABLE IF NOT EXISTS public.conversations (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    org_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    type TEXT NOT NULL CHECK (type IN ('dm', 'group')),
    name TEXT,
    created_by uuid NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);
COMMENT ON TABLE public.conversations IS 'Holds metadata for each distinct chat thread (DM or Group).';

-- Table to link users to conversations (many-to-many relationship)
CREATE TABLE IF NOT EXISTS public.conversation_participants (
    conversation_id uuid NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
    user_id uuid NOT NULL,
    last_read_at TIMESTAMPTZ DEFAULT now(),
    joined_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    PRIMARY KEY (conversation_id, user_id)
);
COMMENT ON TABLE public.conversation_participants IS 'Links users to conversations they are a part of.';

-- Table for all messages, with support for replies and edits
CREATE TABLE IF NOT EXISTS public.messages (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    conversation_id uuid NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
    sender_id uuid NOT NULL,
    content TEXT CHECK (char_length(content) > 0),
    replying_to_message_id uuid REFERENCES public.messages(id) ON DELETE SET NULL,
    is_edited BOOLEAN DEFAULT false NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);
COMMENT ON TABLE public.messages IS 'Stores every message sent, with support for replies and edits.';

-- Table for message attachments, linked to Supabase Storage
CREATE TABLE IF NOT EXISTS public.message_attachments (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    message_id uuid NOT NULL REFERENCES public.messages(id) ON DELETE CASCADE,
    file_path TEXT NOT NULL,
    file_name TEXT NOT NULL,
    file_type TEXT,
    file_size BIGINT,
    uploaded_at TIMESTAMPTZ DEFAULT now() NOT NULL
);
COMMENT ON TABLE public.message_attachments IS 'Links files in Supabase Storage to specific messages.';

-- Table to explicitly track @mentions for notifications
CREATE TABLE IF NOT EXISTS public.message_mentions (
    message_id uuid NOT NULL REFERENCES public.messages(id) ON DELETE CASCADE,
    mentioned_user_id uuid NOT NULL,
    PRIMARY KEY (message_id, mentioned_user_id)
);
COMMENT ON TABLE public.message_mentions IS 'Tracks user @mentions in messages for targeted notifications.';

-- =================================================================
-- 2. CREATE INDEXES FOR PERFORMANCE
-- =================================================================
CREATE INDEX IF NOT EXISTS idx_conversations_org_id ON public.conversations(org_id);
CREATE INDEX IF NOT EXISTS idx_conversation_participants_user_id ON public.conversation_participants(user_id);
CREATE INDEX IF NOT EXISTS idx_messages_conversation_id ON public.messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON public.messages(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_message_attachments_message_id ON public.message_attachments(message_id);
CREATE INDEX IF NOT EXISTS idx_message_mentions_user_id ON public.message_mentions(mentioned_user_id);

-- =================================================================
-- 3. CREATE AUTOMATION & TRIGGERS
-- =================================================================

-- Automatically update the `updated_at` timestamp when a message content is changed
CREATE OR REPLACE FUNCTION public.handle_message_update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  NEW.is_edited = true;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS on_message_update ON public.messages;
CREATE TRIGGER on_message_update
  BEFORE UPDATE OF content ON public.messages
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_message_update_timestamp();

-- =================================================================
-- 4. APPLY ROW LEVEL SECURITY (RLS)
-- =================================================================

ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversation_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.message_attachments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.message_mentions ENABLE ROW LEVEL SECURITY;

-- Helper function to check if a user is in a conversation
CREATE OR REPLACE FUNCTION public.is_conversation_participant(p_conversation_id uuid, p_user_id uuid)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1
    FROM public.conversation_participants
    WHERE conversation_id = p_conversation_id AND user_id = p_user_id
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- RLS Policies for `conversations`
DROP POLICY IF EXISTS "Users can see conversations they are a part of" ON public.conversations;
CREATE POLICY "Users can see conversations they are a part of"
  ON public.conversations FOR SELECT
  USING (is_conversation_participant(id, auth.uid()));

DROP POLICY IF EXISTS "Users can create conversations" ON public.conversations;
CREATE POLICY "Users can create conversations"
  ON public.conversations FOR INSERT
  WITH CHECK (created_by = auth.uid());

-- RLS Policies for `conversation_participants`
DROP POLICY IF EXISTS "Users can see participants of conversations they are in" ON public.conversation_participants;
CREATE POLICY "Users can see participants of conversations they are in"
  ON public.conversation_participants FOR SELECT
  USING (is_conversation_participant(conversation_id, auth.uid()));

DROP POLICY IF EXISTS "Users can add participants to conversations they created" ON public.conversation_participants;
CREATE POLICY "Users can add participants to conversations they created"
  ON public.conversation_participants FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.conversations 
      WHERE id = conversation_id AND created_by = auth.uid()
    )
    OR user_id = auth.uid()
  );

DROP POLICY IF EXISTS "Users can update their own participation" ON public.conversation_participants;
CREATE POLICY "Users can update their own participation"
  ON public.conversation_participants FOR UPDATE
  USING (user_id = auth.uid());

-- RLS Policies for `messages`
DROP POLICY IF EXISTS "Users can see messages in conversations they are a part of" ON public.messages;
CREATE POLICY "Users can see messages in conversations they are a part of"
  ON public.messages FOR SELECT
  USING (is_conversation_participant(conversation_id, auth.uid()));

DROP POLICY IF EXISTS "Users can send messages in conversations they are a part of" ON public.messages;
CREATE POLICY "Users can send messages in conversations they are a part of"
  ON public.messages FOR INSERT
  WITH CHECK (is_conversation_participant(conversation_id, auth.uid()) AND sender_id = auth.uid());

DROP POLICY IF EXISTS "Users can edit their own messages" ON public.messages;
CREATE POLICY "Users can edit their own messages"
  ON public.messages FOR UPDATE
  USING (sender_id = auth.uid())
  WITH CHECK (sender_id = auth.uid());

DROP POLICY IF EXISTS "Users can delete their own messages" ON public.messages;
CREATE POLICY "Users can delete their own messages"
  ON public.messages FOR DELETE
  USING (sender_id = auth.uid());

-- RLS Policies for `message_attachments`
DROP POLICY IF EXISTS "Users can see attachments for messages they can see" ON public.message_attachments;
CREATE POLICY "Users can see attachments for messages they can see"
  ON public.message_attachments FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.messages m
      WHERE m.id = message_id AND is_conversation_participant(m.conversation_id, auth.uid())
    )
  );

DROP POLICY IF EXISTS "Users can create attachments for their messages" ON public.message_attachments;
CREATE POLICY "Users can create attachments for their messages"
  ON public.message_attachments FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.messages m
      WHERE m.id = message_id AND m.sender_id = auth.uid()
    )
  );

-- RLS Policies for `message_mentions`
DROP POLICY IF EXISTS "Users can see mentions in conversations they are in" ON public.message_mentions;
CREATE POLICY "Users can see mentions in conversations they are in"
  ON public.message_mentions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.messages m
      WHERE m.id = message_id AND is_conversation_participant(m.conversation_id, auth.uid())
    )
  );

DROP POLICY IF EXISTS "Users can create mentions for their messages" ON public.message_mentions;
CREATE POLICY "Users can create mentions for their messages"
  ON public.message_mentions FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.messages m
      WHERE m.id = message_id AND m.sender_id = auth.uid()
    )
  );

-- =================================================================
-- 5. CREATE STORAGE BUCKET FOR ATTACHMENTS
-- =================================================================
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'message-attachments', 
  'message-attachments', 
  false,
  52428800, -- 50MB limit
  ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain']
)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for message attachments
DROP POLICY IF EXISTS "Users can upload attachments" ON storage.objects;
CREATE POLICY "Users can upload attachments"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'message-attachments' 
    AND auth.uid() IS NOT NULL
  );

DROP POLICY IF EXISTS "Users can view attachments in their conversations" ON storage.objects;
CREATE POLICY "Users can view attachments in their conversations"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'message-attachments'
    AND auth.uid() IS NOT NULL
  );

DROP POLICY IF EXISTS "Users can delete their own attachments" ON storage.objects;
CREATE POLICY "Users can delete their own attachments"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'message-attachments'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );