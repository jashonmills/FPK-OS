-- Create diagnostics table for extraction quality tracking
CREATE TABLE IF NOT EXISTS public.document_extraction_diagnostics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id UUID NOT NULL REFERENCES public.documents(id) ON DELETE CASCADE,
  family_id UUID NOT NULL REFERENCES public.families(id) ON DELETE CASCADE,
  
  -- Extraction details
  extraction_method TEXT NOT NULL, -- 'pdf-parse' or 'ocr'
  text_length INTEGER NOT NULL,
  word_count INTEGER NOT NULL,
  quality_score TEXT NOT NULL, -- 'excellent', 'good', 'poor', 'failed'
  validation_passed BOOLEAN NOT NULL,
  validation_reason TEXT,
  
  -- Document classification
  identified_type TEXT,
  type_confidence NUMERIC,
  classification_method TEXT, -- 'keyword' or 'ai'
  
  -- Analysis results
  metrics_extracted INTEGER DEFAULT 0,
  insights_generated INTEGER DEFAULT 0,
  progress_records INTEGER DEFAULT 0,
  charts_mapped INTEGER DEFAULT 0,
  
  -- AI details
  ai_model_used TEXT,
  retry_count INTEGER DEFAULT 0,
  
  -- Performance
  processing_time_ms INTEGER,
  
  -- Errors
  errors JSONB DEFAULT '[]'::jsonb,
  
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.document_extraction_diagnostics ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Family members can view diagnostics"
  ON public.document_extraction_diagnostics
  FOR SELECT
  USING (is_family_member(auth.uid(), family_id));

CREATE POLICY "System can insert diagnostics"
  ON public.document_extraction_diagnostics
  FOR INSERT
  WITH CHECK (true);

-- Add index for performance
CREATE INDEX idx_diagnostics_document ON public.document_extraction_diagnostics(document_id);
CREATE INDEX idx_diagnostics_family ON public.document_extraction_diagnostics(family_id);
CREATE INDEX idx_diagnostics_quality ON public.document_extraction_diagnostics(quality_score, validation_passed);