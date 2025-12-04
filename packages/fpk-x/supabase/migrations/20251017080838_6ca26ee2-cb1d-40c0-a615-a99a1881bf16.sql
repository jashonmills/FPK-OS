-- Add feature flag for PDF text extraction with proper fields
INSERT INTO feature_flags (flag_key, flag_name, is_enabled, rollout_percentage, description)
VALUES (
  'enable-pdf-text-extraction',
  'PDF Text Extraction',
  true,
  100,
  'Enable AI-powered PDF text extraction for document analysis'
)
ON CONFLICT (flag_key) DO UPDATE SET
  flag_name = EXCLUDED.flag_name,
  description = EXCLUDED.description;