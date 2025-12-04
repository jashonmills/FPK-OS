-- Add capability column to ai_governance_rules for capability-based rule enforcement
ALTER TABLE public.ai_governance_rules 
ADD COLUMN IF NOT EXISTS capability TEXT DEFAULT 'general_chat';

-- Add constraint for valid capability values
ALTER TABLE public.ai_governance_rules
ADD CONSTRAINT ai_governance_rules_capability_check 
CHECK (capability IN (
  'image_generation',
  'code_generation',
  'document_creation',
  'research_web_search',
  'content_summarization',
  'math_calculations',
  'creative_writing',
  'data_analysis',
  'general_chat'
));

-- Update existing rules to map categories to capabilities
UPDATE public.ai_governance_rules 
SET capability = CASE 
  WHEN category = 'Academic' THEN 'research_web_search'
  WHEN category = 'Technical' THEN 'code_generation'
  WHEN category = 'Creative' THEN 'creative_writing'
  WHEN category = 'Communication' THEN 'general_chat'
  ELSE 'general_chat'
END;