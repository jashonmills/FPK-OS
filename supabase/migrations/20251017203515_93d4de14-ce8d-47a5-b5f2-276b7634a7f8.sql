-- Phase 1 Implementation: Enhanced Extraction & Analysis System (Fixed)

-- 1. Enhanced document_extraction_diagnostics table
ALTER TABLE document_extraction_diagnostics
ADD COLUMN IF NOT EXISTS chunk_index INTEGER,
ADD COLUMN IF NOT EXISTS total_chunks INTEGER,
ADD COLUMN IF NOT EXISTS quality_metrics JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS warnings TEXT[],
ADD COLUMN IF NOT EXISTS requires_manual_review BOOLEAN DEFAULT FALSE;

-- 2. Create analysis_checkpoints table for resume capability
CREATE TABLE IF NOT EXISTS analysis_checkpoints (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id UUID NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
  family_id UUID NOT NULL REFERENCES families(id) ON DELETE CASCADE,
  phase TEXT NOT NULL CHECK (phase IN ('extraction', 'classification', 'metric_extraction', 'insight_generation', 'chart_mapping')),
  completed BOOLEAN DEFAULT FALSE,
  data JSONB DEFAULT '{}',
  error_message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_checkpoints_document ON analysis_checkpoints(document_id);
CREATE INDEX IF NOT EXISTS idx_checkpoints_phase ON analysis_checkpoints(document_id, phase);
CREATE INDEX IF NOT EXISTS idx_checkpoints_family ON analysis_checkpoints(family_id);

-- Enable RLS
ALTER TABLE analysis_checkpoints ENABLE ROW LEVEL SECURITY;

-- RLS policies for analysis_checkpoints
CREATE POLICY "Family members can view checkpoints"
  ON analysis_checkpoints FOR SELECT
  USING (is_family_member(auth.uid(), family_id));

CREATE POLICY "System can insert checkpoints"
  ON analysis_checkpoints FOR INSERT
  WITH CHECK (is_family_member(auth.uid(), family_id));

CREATE POLICY "System can update checkpoints"
  ON analysis_checkpoints FOR UPDATE
  USING (is_family_member(auth.uid(), family_id));

-- 3. Enable realtime for new table only (document_analysis_status already enabled)
ALTER TABLE analysis_checkpoints REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE analysis_checkpoints;

-- 4. Add progress metadata to document_analysis_status
ALTER TABLE document_analysis_status
ADD COLUMN IF NOT EXISTS progress_percent INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS current_phase TEXT,
ADD COLUMN IF NOT EXISTS status_message TEXT;