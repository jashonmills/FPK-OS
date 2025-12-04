-- Insert feature flag for vision-based extraction
INSERT INTO feature_flags (flag_key, flag_name, description, is_enabled, metadata)
VALUES (
  'use-vision-extraction',
  'Use Vision API for Document Extraction',
  'Enable Anthropic Claude Vision API for OCR and document text extraction (handles scanned PDFs and complex layouts)',
  true,
  '{"extraction_method": "anthropic_vision", "model": "claude-sonnet-4-20250514"}'::jsonb
)
ON CONFLICT (flag_key) 
DO UPDATE SET 
  is_enabled = true,
  metadata = '{"extraction_method": "anthropic_vision", "model": "claude-sonnet-4-20250514"}'::jsonb,
  updated_at = now();