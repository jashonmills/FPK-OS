-- Create the family_data_embeddings table for RAG
CREATE TABLE public.family_data_embeddings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  family_id UUID NOT NULL REFERENCES public.families(id) ON DELETE CASCADE,
  student_id UUID REFERENCES public.students(id) ON DELETE CASCADE,
  source_table TEXT NOT NULL,
  source_id UUID NOT NULL,
  chunk_text TEXT NOT NULL,
  embedding vector(1536) NOT NULL,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create index for vector similarity search
CREATE INDEX idx_family_data_embeddings_family ON public.family_data_embeddings(family_id);
CREATE INDEX idx_family_data_embeddings_vector ON public.family_data_embeddings 
USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);

-- Enable RLS
ALTER TABLE public.family_data_embeddings ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Family members can only access their own embeddings
CREATE POLICY "Family members can view their embeddings"
  ON public.family_data_embeddings
  FOR SELECT
  USING (is_family_member(auth.uid(), family_id));

CREATE POLICY "Family members can insert their embeddings"
  ON public.family_data_embeddings
  FOR INSERT
  WITH CHECK (is_family_member(auth.uid(), family_id));

CREATE POLICY "Family members can delete their embeddings"
  ON public.family_data_embeddings
  FOR DELETE
  USING (is_family_member(auth.uid(), family_id));

-- Create table for chat conversations
CREATE TABLE public.chat_conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  family_id UUID NOT NULL REFERENCES public.families(id) ON DELETE CASCADE,
  created_by UUID NOT NULL,
  title TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.chat_conversations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Family members can manage conversations"
  ON public.chat_conversations
  FOR ALL
  USING (is_family_member(auth.uid(), family_id))
  WITH CHECK (is_family_member(auth.uid(), family_id));

-- Create table for chat messages
CREATE TABLE public.chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES public.chat_conversations(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
  content TEXT NOT NULL,
  sources JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view messages in their family conversations"
  ON public.chat_messages
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.chat_conversations cc
      WHERE cc.id = chat_messages.conversation_id
      AND is_family_member(auth.uid(), cc.family_id)
    )
  );

CREATE POLICY "Users can insert messages in their family conversations"
  ON public.chat_messages
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.chat_conversations cc
      WHERE cc.id = chat_messages.conversation_id
      AND is_family_member(auth.uid(), cc.family_id)
    )
  );