-- Create AI Coach Conversations Table
CREATE TABLE IF NOT EXISTS public.ai_coach_conversations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL DEFAULT 'New Conversation',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create AI Coach Messages Table
CREATE TABLE IF NOT EXISTS public.ai_coach_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  conversation_id UUID NOT NULL REFERENCES public.ai_coach_conversations(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
  content TEXT NOT NULL,
  persona TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create AI Coach Study Materials Table
CREATE TABLE IF NOT EXISTS public.ai_coach_study_materials (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  file_type TEXT,
  file_size BIGINT,
  file_url TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create AI Coach Study Plans Table (if not exists)
CREATE TABLE IF NOT EXISTS public.ai_coach_study_plans (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  estimated_hours INTEGER DEFAULT 0,
  progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.ai_coach_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_coach_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_coach_study_materials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_coach_study_plans ENABLE ROW LEVEL SECURITY;

-- RLS Policies for ai_coach_conversations
CREATE POLICY "Users can view their own conversations"
  ON public.ai_coach_conversations FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own conversations"
  ON public.ai_coach_conversations FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own conversations"
  ON public.ai_coach_conversations FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own conversations"
  ON public.ai_coach_conversations FOR DELETE
  USING (auth.uid() = user_id);

-- RLS Policies for ai_coach_messages
CREATE POLICY "Users can view messages in their conversations"
  ON public.ai_coach_messages FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.ai_coach_conversations
      WHERE ai_coach_conversations.id = ai_coach_messages.conversation_id
      AND ai_coach_conversations.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create messages in their conversations"
  ON public.ai_coach_messages FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.ai_coach_conversations
      WHERE ai_coach_conversations.id = ai_coach_messages.conversation_id
      AND ai_coach_conversations.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete messages in their conversations"
  ON public.ai_coach_messages FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.ai_coach_conversations
      WHERE ai_coach_conversations.id = ai_coach_messages.conversation_id
      AND ai_coach_conversations.user_id = auth.uid()
    )
  );

-- RLS Policies for ai_coach_study_materials
CREATE POLICY "Users can view their own study materials"
  ON public.ai_coach_study_materials FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own study materials"
  ON public.ai_coach_study_materials FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own study materials"
  ON public.ai_coach_study_materials FOR DELETE
  USING (auth.uid() = user_id);

-- RLS Policies for ai_coach_study_plans
CREATE POLICY "Users can view their own study plans"
  ON public.ai_coach_study_plans FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own study plans"
  ON public.ai_coach_study_plans FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own study plans"
  ON public.ai_coach_study_plans FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own study plans"
  ON public.ai_coach_study_plans FOR DELETE
  USING (auth.uid() = user_id);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_ai_coach_conversations_user_id 
  ON public.ai_coach_conversations(user_id);

CREATE INDEX IF NOT EXISTS idx_ai_coach_messages_conversation_id 
  ON public.ai_coach_messages(conversation_id);

CREATE INDEX IF NOT EXISTS idx_ai_coach_study_materials_user_id 
  ON public.ai_coach_study_materials(user_id);

CREATE INDEX IF NOT EXISTS idx_ai_coach_study_plans_user_id 
  ON public.ai_coach_study_plans(user_id);

-- Create updated_at trigger for conversations
CREATE OR REPLACE FUNCTION public.update_ai_coach_conversations_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_ai_coach_conversations_timestamp
  BEFORE UPDATE ON public.ai_coach_conversations
  FOR EACH ROW
  EXECUTE FUNCTION public.update_ai_coach_conversations_updated_at();

-- Create updated_at trigger for study plans
CREATE OR REPLACE FUNCTION public.update_ai_coach_study_plans_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_ai_coach_study_plans_timestamp
  BEFORE UPDATE ON public.ai_coach_study_plans
  FOR EACH ROW
  EXECUTE FUNCTION public.update_ai_coach_study_plans_updated_at();

-- Create learning streak calculation function
CREATE OR REPLACE FUNCTION public.get_ai_coach_learning_streak(p_user_id UUID)
RETURNS INTEGER AS $$
DECLARE
  v_streak INTEGER := 0;
  v_current_date DATE := CURRENT_DATE;
  v_has_activity BOOLEAN;
BEGIN
  LOOP
    SELECT EXISTS(
      SELECT 1 FROM public.ai_coach_analytics
      WHERE user_id = p_user_id
      AND session_date = v_current_date
    ) INTO v_has_activity;
    
    EXIT WHEN NOT v_has_activity;
    
    v_streak := v_streak + 1;
    v_current_date := v_current_date - INTERVAL '1 day';
    
    EXIT WHEN v_streak > 365;
  END LOOP;
  
  RETURN v_streak;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create storage bucket for AI coach materials
INSERT INTO storage.buckets (id, name, public)
VALUES ('ai-coach-materials', 'ai-coach-materials', true)
ON CONFLICT (id) DO NOTHING;

-- Storage RLS policies
CREATE POLICY "Users can upload their own materials"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'ai-coach-materials' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can read their own materials"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'ai-coach-materials' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can delete their own materials"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'ai-coach-materials' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );