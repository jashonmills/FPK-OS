-- Update user's quotas to match their premium subscription
UPDATE usage_quotas 
SET 
  subscription_tier = 'premium',
  ai_chat_messages_limit = -1,
  voice_minutes_limit = -1,
  rag_queries_limit = -1,
  document_processing_limit = -1,
  flashcard_generation_limit = -1,
  ai_insights_limit = -1,
  knowledge_base_storage_mb_limit = 2000,
  updated_at = now()
WHERE user_id = '5945ec0e-ac76-4a53-8d2d-e034eafc1a25'
  AND period_start <= now() 
  AND period_end > now();

-- If no current period exists, create it
INSERT INTO usage_quotas (
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
  ai_insights_used,
  knowledge_base_storage_mb_used
)
SELECT 
  '5945ec0e-ac76-4a53-8d2d-e034eafc1a25',
  'premium',
  -1, -1, -1, -1, -1, -1, 2000,
  0, 0, 0, 0, 0, 0, 0
WHERE NOT EXISTS (
  SELECT 1 FROM usage_quotas 
  WHERE user_id = '5945ec0e-ac76-4a53-8d2d-e034eafc1a25'
  AND period_start <= now() 
  AND period_end > now()
);