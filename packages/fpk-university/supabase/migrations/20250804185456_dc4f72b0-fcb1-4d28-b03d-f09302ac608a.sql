-- Add 'free' tier to subscription_tier enum if it doesn't exist
DO $$ 
BEGIN 
    -- Check if the 'free' value already exists in the subscription_tier enum
    IF NOT EXISTS (
        SELECT 1 FROM pg_enum 
        WHERE enumlabel = 'free' 
        AND enumtypid = (SELECT oid FROM pg_type WHERE typname = 'subscription_tier')
    ) THEN
        -- Add 'free' to the subscription_tier enum
        ALTER TYPE subscription_tier ADD VALUE 'free';
    END IF;
END $$;

-- Update the initialize_user_quotas function to support 'free' tier
CREATE OR REPLACE FUNCTION public.initialize_user_quotas(p_user_id uuid, p_subscription_tier text DEFAULT 'free'::text)
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
  -- Set limits based on subscription tier
  CASE p_subscription_tier
    WHEN 'free' THEN
      chat_limit := 5;
      voice_limit := 2;
      rag_limit := 3;
      doc_limit := 1;
      flashcard_limit := 25;
      insights_limit := 5;
      storage_limit := 10;
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
      -- Default to free tier
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

-- Initialize all existing users with free tier quotas
INSERT INTO public.usage_quotas (
  user_id,
  subscription_tier,
  ai_chat_messages_limit,
  voice_minutes_limit,
  rag_queries_limit,
  document_processing_limit,
  flashcard_generation_limit,
  ai_insights_limit,
  knowledge_base_storage_mb_limit,
  ai_chat_messages_used,
  voice_minutes_used,
  rag_queries_used,
  document_processing_used,
  flashcard_generation_used,
  ai_insights_used
)
SELECT 
  p.id,
  'free'::text,
  5, -- chat_limit
  2, -- voice_limit  
  3, -- rag_limit
  1, -- doc_limit
  25, -- flashcard_limit
  5, -- insights_limit
  10, -- storage_limit
  0, -- used amounts start at 0
  0,
  0,
  0,
  0,
  0
FROM auth.users au
JOIN public.profiles p ON p.id = au.id
WHERE NOT EXISTS (
  SELECT 1 FROM public.usage_quotas uq 
  WHERE uq.user_id = p.id 
  AND uq.period_start <= now() 
  AND uq.period_end > now()
);