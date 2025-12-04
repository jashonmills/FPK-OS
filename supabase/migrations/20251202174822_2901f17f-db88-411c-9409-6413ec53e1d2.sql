-- Update ai_governance_model_configs to use valid Lovable AI Gateway models
UPDATE ai_governance_model_configs 
SET model_id = 'google/gemini-2.5-flash', provider = 'Google'
WHERE model_id = 'gpt-4o';

UPDATE ai_governance_model_configs 
SET model_id = 'google/gemini-2.5-flash-lite', provider = 'Google'
WHERE model_id = 'gpt-4o-mini';

UPDATE ai_governance_model_configs 
SET model_id = 'openai/gpt-5', provider = 'OpenAI'
WHERE model_id = 'claude-3-5-sonnet';