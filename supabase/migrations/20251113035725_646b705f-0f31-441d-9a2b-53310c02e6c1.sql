-- ============================================
-- PHASE 1: DEMOLITION - Remove V3 Infrastructure
-- ============================================

-- Drop V3 tables and related data
DROP TABLE IF EXISTS v3_documents CASCADE;
DROP TABLE IF EXISTS document_metrics CASCADE;
DROP TABLE IF EXISTS ai_insights CASCADE;
DROP TABLE IF EXISTS progress_tracking CASCADE;

-- ============================================
-- PHASE 2: BEDROCK FOUNDATION - Build New System
-- ============================================

-- Create feature flag for bedrock pipeline
INSERT INTO feature_flags (flag_key, flag_name, description, is_enabled, rollout_percentage)
VALUES ('bedrock_pipeline', 'Bedrock Pipeline', 'Atomic, reliable document pipeline - Project Bedrock', false, 0)
ON CONFLICT (flag_key) DO UPDATE SET
  flag_name = 'Bedrock Pipeline',
  description = 'Atomic, reliable document pipeline - Project Bedrock',
  is_enabled = false,
  rollout_percentage = 0;

-- Create bedrock_documents table
CREATE TABLE bedrock_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  family_id UUID NOT NULL REFERENCES families(id) ON DELETE CASCADE,
  student_id UUID REFERENCES students(id) ON DELETE CASCADE,
  
  -- File metadata
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_size_kb INTEGER,
  
  -- User-provided classification (NOT AI-guessed)
  category TEXT,
  
  -- Processing state
  status TEXT NOT NULL DEFAULT 'uploaded',
  -- Valid statuses: 'uploaded', 'analyzing', 'completed', 'failed'
  
  -- Content (populated during upload)
  extracted_content TEXT,
  
  -- Analysis results (stored as JSONB for simplicity)
  analysis_data JSONB,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  analyzed_at TIMESTAMPTZ,
  
  -- Error tracking
  error_message TEXT
);

-- Create indices for performance
CREATE INDEX idx_bedrock_family_status ON bedrock_documents(family_id, status);
CREATE INDEX idx_bedrock_category ON bedrock_documents(category) WHERE category IS NOT NULL;

-- Enable RLS
ALTER TABLE bedrock_documents ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Family members can view documents"
  ON bedrock_documents FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM family_members 
      WHERE family_members.family_id = bedrock_documents.family_id 
      AND family_members.user_id = auth.uid()
    )
  );

CREATE POLICY "Family members can insert documents"
  ON bedrock_documents FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM family_members 
      WHERE family_members.family_id = bedrock_documents.family_id 
      AND family_members.user_id = auth.uid()
    )
  );

CREATE POLICY "Family members can update documents"
  ON bedrock_documents FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM family_members 
      WHERE family_members.family_id = bedrock_documents.family_id 
      AND family_members.user_id = auth.uid()
    )
  );

-- Create storage bucket for bedrock
INSERT INTO storage.buckets (id, name, public)
VALUES ('bedrock-storage', 'bedrock-storage', false)
ON CONFLICT (id) DO NOTHING;

-- Storage RLS for uploads
CREATE POLICY "Users can upload to family folders"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'bedrock-storage' AND
    (storage.foldername(name))[1]::uuid IN (
      SELECT family_id FROM family_members WHERE user_id = auth.uid()
    )
  );

-- Storage RLS for downloads
CREATE POLICY "Users can download family documents"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'bedrock-storage' AND
    (storage.foldername(name))[1]::uuid IN (
      SELECT family_id FROM family_members WHERE user_id = auth.uid()
    )
  );