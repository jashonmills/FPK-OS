-- Create usage tracking tables for AI features
CREATE TABLE public.usage_quotas (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  subscription_tier TEXT NOT NULL DEFAULT 'basic',
  period_start TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT date_trunc('month', now()),
  period_end TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT (date_trunc('month', now()) + interval '1 month'),
  
  -- AI Chat & Voice limits
  ai_chat_messages_limit INTEGER NOT NULL DEFAULT 100,
  ai_chat_messages_used INTEGER NOT NULL DEFAULT 0,
  voice_minutes_limit INTEGER NOT NULL DEFAULT 60,
  voice_minutes_used INTEGER NOT NULL DEFAULT 0,
  
  -- Knowledge & RAG limits
  rag_queries_limit INTEGER NOT NULL DEFAULT 50,
  rag_queries_used INTEGER NOT NULL DEFAULT 0,
  document_processing_limit INTEGER NOT NULL DEFAULT 10,
  document_processing_used INTEGER NOT NULL DEFAULT 0,
  
  -- Advanced AI limits
  flashcard_generation_limit INTEGER NOT NULL DEFAULT 200,
  flashcard_generation_used INTEGER NOT NULL DEFAULT 0,
  ai_insights_limit INTEGER NOT NULL DEFAULT 50,
  ai_insights_used INTEGER NOT NULL DEFAULT 0,
  
  -- Storage limits
  knowledge_base_storage_mb_limit INTEGER NOT NULL DEFAULT 100,
  knowledge_base_storage_mb_used INTEGER NOT NULL DEFAULT 0,
  
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create usage tracking log for detailed analytics
CREATE TABLE public.usage_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  feature_type TEXT NOT NULL, -- 'ai_chat', 'voice_processing', 'rag_query', etc.
  usage_amount NUMERIC NOT NULL DEFAULT 1, -- Credits consumed or minutes used
  metadata JSONB DEFAULT '{}',
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.usage_quotas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.usage_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies for usage_quotas
CREATE POLICY "Users can view their own quotas" 
ON public.usage_quotas 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "System can manage quotas" 
ON public.usage_quotas 
FOR ALL 
USING (true);

-- RLS Policies for usage_logs
CREATE POLICY "Users can view their own usage logs" 
ON public.usage_logs 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "System can create usage logs" 
ON public.usage_logs 
FOR INSERT 
WITH CHECK (true);

-- Function to reset quotas monthly
CREATE OR REPLACE FUNCTION public.reset_monthly_quotas()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Reset quotas for users whose period has ended
  UPDATE public.usage_quotas 
  SET 
    period_start = date_trunc('month', now()),
    period_end = (date_trunc('month', now()) + interval '1 month'),
    ai_chat_messages_used = 0,
    voice_minutes_used = 0,
    rag_queries_used = 0,
    document_processing_used = 0,
    flashcard_generation_used = 0,
    ai_insights_used = 0,
    knowledge_base_storage_mb_used = 0,
    updated_at = now()
  WHERE period_end <= now();
END;
$$;

-- Function to initialize quotas for new users
CREATE OR REPLACE FUNCTION public.initialize_user_quotas(
  p_user_id UUID,
  p_subscription_tier TEXT DEFAULT 'basic'
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  chat_limit INTEGER;
  voice_limit INTEGER;
  rag_limit INTEGER;
  doc_limit INTEGER;
  flashcard_limit INTEGER;
  insights_limit INTEGER;
  storage_limit INTEGER;
BEGIN
  -- Set limits based on subscription tier
  CASE p_subscription_tier
    WHEN 'basic' THEN
      chat_limit := 100;
      voice_limit := 60;
      rag_limit := 50;
      doc_limit := 10;
      flashcard_limit := 200;
      insights_limit := 50;
      storage_limit := 100;
    WHEN 'pro' THEN
      chat_limit := 500;
      voice_limit := 300;
      rag_limit := 250;
      doc_limit := 50;
      flashcard_limit := 1000;
      insights_limit := 200;
      storage_limit := 500;
    WHEN 'premium' THEN
      chat_limit := -1; -- Unlimited
      voice_limit := -1; -- Unlimited
      rag_limit := -1; -- Unlimited
      doc_limit := -1; -- Unlimited
      flashcard_limit := -1; -- Unlimited
      insights_limit := -1; -- Unlimited
      storage_limit := 2000;
    ELSE
      -- Default to basic
      chat_limit := 100;
      voice_limit := 60;
      rag_limit := 50;
      doc_limit := 10;
      flashcard_limit := 200;
      insights_limit := 50;
      storage_limit := 100;
  END CASE;

  -- Insert or update quotas
  INSERT INTO public.usage_quotas (
    user_id,
    subscription_tier,
    ai_chat_messages_limit,
    voice_minutes_limit,
    rag_queries_limit,
    document_processing_limit,
    flashcard_generation_limit,
    ai_insights_limit,
    knowledge_base_storage_mb_limit
  ) VALUES (
    p_user_id,
    p_subscription_tier,
    chat_limit,
    voice_limit,
    rag_limit,
    doc_limit,
    flashcard_limit,
    insights_limit,
    storage_limit
  )
  ON CONFLICT (user_id, period_start) 
  DO UPDATE SET
    subscription_tier = EXCLUDED.subscription_tier,
    ai_chat_messages_limit = EXCLUDED.ai_chat_messages_limit,
    voice_minutes_limit = EXCLUDED.voice_minutes_limit,
    rag_queries_limit = EXCLUDED.rag_queries_limit,
    document_processing_limit = EXCLUDED.document_processing_limit,
    flashcard_generation_limit = EXCLUDED.flashcard_generation_limit,
    ai_insights_limit = EXCLUDED.ai_insights_limit,
    knowledge_base_storage_mb_limit = EXCLUDED.knowledge_base_storage_mb_limit,
    updated_at = now();
END;
$$;

-- Function to track usage
CREATE OR REPLACE FUNCTION public.track_usage(
  p_user_id UUID,
  p_feature_type TEXT,
  p_usage_amount NUMERIC DEFAULT 1,
  p_metadata JSONB DEFAULT '{}'
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  current_used INTEGER;
  usage_limit INTEGER;
  can_use BOOLEAN := false;
BEGIN
  -- Log the usage attempt
  INSERT INTO public.usage_logs (user_id, feature_type, usage_amount, metadata)
  VALUES (p_user_id, p_feature_type, p_usage_amount, p_metadata);

  -- Check and update quotas
  UPDATE public.usage_quotas 
  SET 
    ai_chat_messages_used = CASE 
      WHEN p_feature_type = 'ai_chat' THEN ai_chat_messages_used + p_usage_amount::INTEGER
      ELSE ai_chat_messages_used 
    END,
    voice_minutes_used = CASE 
      WHEN p_feature_type = 'voice_processing' THEN voice_minutes_used + p_usage_amount::INTEGER
      ELSE voice_minutes_used 
    END,
    rag_queries_used = CASE 
      WHEN p_feature_type = 'rag_query' THEN rag_queries_used + p_usage_amount::INTEGER
      ELSE rag_queries_used 
    END,
    document_processing_used = CASE 
      WHEN p_feature_type = 'document_processing' THEN document_processing_used + p_usage_amount::INTEGER
      ELSE document_processing_used 
    END,
    flashcard_generation_used = CASE 
      WHEN p_feature_type = 'flashcard_generation' THEN flashcard_generation_used + p_usage_amount::INTEGER
      ELSE flashcard_generation_used 
    END,
    ai_insights_used = CASE 
      WHEN p_feature_type = 'ai_insights' THEN ai_insights_used + p_usage_amount::INTEGER
      ELSE ai_insights_used 
    END,
    updated_at = now()
  WHERE user_id = p_user_id 
    AND period_start <= now() 
    AND period_end > now();

  -- Check if usage is within limits
  SELECT 
    CASE p_feature_type
      WHEN 'ai_chat' THEN (ai_chat_messages_limit = -1 OR ai_chat_messages_used <= ai_chat_messages_limit)
      WHEN 'voice_processing' THEN (voice_minutes_limit = -1 OR voice_minutes_used <= voice_minutes_limit)
      WHEN 'rag_query' THEN (rag_queries_limit = -1 OR rag_queries_used <= rag_queries_limit)
      WHEN 'document_processing' THEN (document_processing_limit = -1 OR document_processing_used <= document_processing_limit)
      WHEN 'flashcard_generation' THEN (flashcard_generation_limit = -1 OR flashcard_generation_used <= flashcard_generation_limit)
      WHEN 'ai_insights' THEN (ai_insights_limit = -1 OR ai_insights_used <= ai_insights_limit)
      ELSE true
    END INTO can_use
  FROM public.usage_quotas
  WHERE user_id = p_user_id 
    AND period_start <= now() 
    AND period_end > now();

  RETURN COALESCE(can_use, false);
END;
$$;

-- Add unique constraint to prevent duplicate quota records per period
ALTER TABLE public.usage_quotas 
ADD CONSTRAINT usage_quotas_user_period_unique 
UNIQUE (user_id, period_start);