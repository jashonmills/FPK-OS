-- ============================================
-- Project Phoenix Database Schema
-- Admin-Only Sandbox Tables
-- ============================================

-- 1. Create Custom Types
CREATE TYPE persona_type AS ENUM ('USER', 'BETTY', 'AL', 'CONDUCTOR');
CREATE TYPE message_intent AS ENUM (
  'socratic_exploration',
  'quick_question',
  'story_request',
  'frustrated_vent',
  'video_assessment',
  'general_chat',
  'unclear'
);

-- 2. Phoenix Conversations Table
CREATE TABLE IF NOT EXISTS public.phoenix_conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  session_id TEXT NOT NULL UNIQUE,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Phoenix Messages Table
CREATE TABLE IF NOT EXISTS public.phoenix_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES public.phoenix_conversations(id) ON DELETE CASCADE,
  persona persona_type NOT NULL,
  content TEXT NOT NULL,
  intent message_intent,
  sentiment TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. Indexes for Performance
CREATE INDEX idx_phoenix_conversations_user_id 
  ON public.phoenix_conversations(user_id, created_at DESC);

CREATE INDEX idx_phoenix_messages_conversation_id 
  ON public.phoenix_messages(conversation_id, created_at ASC);

CREATE INDEX idx_phoenix_messages_intent 
  ON public.phoenix_messages(intent);

-- 5. Enable Row Level Security
ALTER TABLE public.phoenix_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.phoenix_messages ENABLE ROW LEVEL SECURITY;

-- 6. RLS Policies (Admin-only access)
CREATE POLICY "Admins can manage all phoenix conversations"
  ON public.phoenix_conversations FOR ALL
  USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage all phoenix messages"
  ON public.phoenix_messages FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.phoenix_conversations pc
      WHERE pc.id = phoenix_messages.conversation_id
    ) AND has_role(auth.uid(), 'admin')
  );

-- 7. Updated_at Trigger
CREATE OR REPLACE FUNCTION update_phoenix_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER phoenix_conversations_updated_at
  BEFORE UPDATE ON public.phoenix_conversations
  FOR EACH ROW
  EXECUTE FUNCTION update_phoenix_updated_at();