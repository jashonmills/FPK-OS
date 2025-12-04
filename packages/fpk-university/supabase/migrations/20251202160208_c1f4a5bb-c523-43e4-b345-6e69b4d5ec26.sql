-- Seed default tool-model assignments for all active AI tools
-- Using Google Gemini 2.5 Flash as the sensible default

-- First, get the model config ID for gemini-2.5-flash
DO $$
DECLARE
  v_model_config_id UUID;
BEGIN
  -- Get the gemini-2.5-flash model config (or create one if it doesn't exist)
  SELECT id INTO v_model_config_id
  FROM ai_governance_model_configs
  WHERE model_id = 'google/gemini-2.5-flash'
  AND org_id IS NULL
  LIMIT 1;
  
  -- If no gemini model exists, try GPT-4o
  IF v_model_config_id IS NULL THEN
    SELECT id INTO v_model_config_id
    FROM ai_governance_model_configs
    WHERE model_id LIKE '%gpt-4o%'
    AND org_id IS NULL
    LIMIT 1;
  END IF;
  
  -- If still no model, get any active model
  IF v_model_config_id IS NULL THEN
    SELECT id INTO v_model_config_id
    FROM ai_governance_model_configs
    WHERE is_active = true
    AND org_id IS NULL
    LIMIT 1;
  END IF;
  
  -- Insert default assignments for all active tools (only if we found a model)
  IF v_model_config_id IS NOT NULL THEN
    INSERT INTO ai_tool_model_assignments (tool_id, model_config_id, org_id, is_active)
    SELECT 
      t.id as tool_id,
      v_model_config_id as model_config_id,
      NULL as org_id,
      true as is_active
    FROM ai_tools t
    WHERE t.is_active = true
    ON CONFLICT (org_id, tool_id) DO NOTHING;
    
    RAISE NOTICE 'Created default tool-model assignments using model config: %', v_model_config_id;
  ELSE
    RAISE NOTICE 'No model config found, skipping tool-model assignments';
  END IF;
END $$;