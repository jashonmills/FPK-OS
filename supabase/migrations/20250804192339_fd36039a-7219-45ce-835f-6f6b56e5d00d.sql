-- Update the initialize_user_quotas function to support new FPK tier system
CREATE OR REPLACE FUNCTION public.initialize_user_quotas(p_user_id uuid, p_subscription_tier text DEFAULT 'calm'::text)
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
  -- Set limits based on new FPK subscription tiers
  CASE p_subscription_tier
    WHEN 'calm' THEN
      chat_limit := 5;
      voice_limit := 2;
      rag_limit := 3;
      doc_limit := 1;
      flashcard_limit := 25;
      insights_limit := 5;
      storage_limit := 10;
    WHEN 'me' THEN
      chat_limit := 150;
      voice_limit := 90;
      rag_limit := 75;
      doc_limit := 15;
      flashcard_limit := 300;
      insights_limit := 75;
      storage_limit := 200;
    WHEN 'us' THEN
      chat_limit := 500;
      voice_limit := 300;
      rag_limit := 250;
      doc_limit := 50;
      flashcard_limit := 1000;
      insights_limit := 200;
      storage_limit := 1000;
    WHEN 'universal' THEN
      chat_limit := -1; -- Unlimited
      voice_limit := -1; -- Unlimited
      rag_limit := -1; -- Unlimited
      doc_limit := -1; -- Unlimited
      flashcard_limit := -1; -- Unlimited
      insights_limit := -1; -- Unlimited
      storage_limit := 5000;
    ELSE
      -- Default to calm tier for unknown tiers or legacy support
      chat_limit := 5;
      voice_limit := 2;
      rag_limit := 3;
      doc_limit := 1;
      flashcard_limit := 25;
      insights_limit := 5;
      storage_limit := 10;
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
$function$;