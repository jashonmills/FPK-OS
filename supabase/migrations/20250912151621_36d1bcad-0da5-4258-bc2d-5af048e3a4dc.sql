-- Update the initialize_user_quotas function to provide unlimited access for all tiers
CREATE OR REPLACE FUNCTION public.initialize_user_quotas(p_user_id uuid, p_subscription_tier text DEFAULT 'unlimited'::text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $function$
DECLARE
  chat_limit INTEGER;
  voice_limit INTEGER;
  rag_limit INTEGER;
  doc_limit INTEGER;
  flashcard_limit INTEGER;
  insights_limit INTEGER;
  storage_limit INTEGER;
BEGIN
  -- Set unlimited limits for all tiers
  chat_limit := -1; -- Unlimited
  voice_limit := -1; -- Unlimited
  rag_limit := -1; -- Unlimited
  doc_limit := -1; -- Unlimited
  flashcard_limit := -1; -- Unlimited
  insights_limit := -1; -- Unlimited
  storage_limit := 50000; -- Very high storage limit

  -- Insert or update quotas with unlimited access
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
    ai_chat_messages_limit = -1,
    voice_minutes_limit = -1,
    rag_queries_limit = -1,
    document_processing_limit = -1,
    flashcard_generation_limit = -1,
    ai_insights_limit = -1,
    knowledge_base_storage_mb_limit = 50000,
    updated_at = now();
END;
$function$;

-- Update the track_usage function to always return true for unlimited access
CREATE OR REPLACE FUNCTION public.track_usage(p_user_id uuid, p_feature_type text, p_usage_amount numeric DEFAULT 1, p_metadata jsonb DEFAULT '{}'::jsonb)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $function$
DECLARE
  current_used INTEGER;
  usage_limit INTEGER;
  can_use BOOLEAN := true; -- Always allow usage
BEGIN
  -- Log the usage attempt
  INSERT INTO public.usage_logs (user_id, feature_type, usage_amount, metadata)
  VALUES (p_user_id, p_feature_type, p_usage_amount, p_metadata);

  -- Update usage tracking but don't enforce limits
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

  -- Always return true for unlimited access
  RETURN true;
END;
$function$;

-- Clean up restrictive quotas and set all existing quotas to unlimited
UPDATE public.usage_quotas 
SET 
  subscription_tier = 'unlimited',
  ai_chat_messages_limit = -1,
  voice_minutes_limit = -1,
  rag_queries_limit = -1,
  document_processing_limit = -1,
  flashcard_generation_limit = -1,
  ai_insights_limit = -1,
  knowledge_base_storage_mb_limit = 50000,
  updated_at = now();

-- Initialize quotas for any users who don't have them yet
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
)
SELECT 
  p.id,
  'unlimited',
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  50000
FROM profiles p
LEFT JOIN usage_quotas uq ON uq.user_id = p.id AND uq.period_start <= now() AND uq.period_end > now()
WHERE uq.user_id IS NULL
ON CONFLICT (user_id, period_start) DO NOTHING;