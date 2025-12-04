-- Phase 1: Add master control switch for AI analysis pipeline
INSERT INTO feature_flags (flag_key, flag_name, is_enabled, rollout_percentage, description)
VALUES (
  'enable-ai-analysis-pipeline',
  'AI Analysis Pipeline',
  false,  -- DISABLED by default
  0,
  'Master switch for the AI document analysis system. When disabled, documents are uploaded and stored only.'
)
ON CONFLICT (flag_key) DO UPDATE SET
  flag_name = EXCLUDED.flag_name,
  description = EXCLUDED.description,
  is_enabled = EXCLUDED.is_enabled;

-- Phase 2: Add flag for choosing Google Document AI vs legacy parser
INSERT INTO feature_flags (flag_key, flag_name, is_enabled, rollout_percentage, description)
VALUES (
  'use-document-ai-extraction',
  'Google Document AI Extraction',
  false,  -- Start with legacy, switch after testing
  0,
  'Use Google Cloud Document AI for PDF text extraction instead of the legacy parser.'
)
ON CONFLICT (flag_key) DO UPDATE SET
  flag_name = EXCLUDED.flag_name,
  description = EXCLUDED.description;