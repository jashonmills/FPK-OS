-- Project Bedrock Phase 1: Foundation (Without user override)
-- Create the new v3_documents table with RLS

CREATE TABLE v3_documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    family_id UUID NOT NULL REFERENCES families(id) ON DELETE CASCADE,
    student_id UUID REFERENCES students(id) ON DELETE CASCADE,
    uploaded_by UUID REFERENCES auth.users(id),
    file_name TEXT NOT NULL,
    file_path TEXT NOT NULL UNIQUE,
    file_size_kb INTEGER,
    category TEXT DEFAULT 'general',
    status TEXT NOT NULL DEFAULT 'uploaded',
    error_message TEXT,
    extracted_content TEXT,
    analysis_summary JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Add status constraint
ALTER TABLE v3_documents ADD CONSTRAINT v3_documents_status_check 
CHECK (status IN ('uploaded', 'extracting', 'analyzing', 'completed', 'failed'));

-- Enable RLS
ALTER TABLE v3_documents ENABLE ROW LEVEL SECURITY;

-- Create RLS policy for family members
CREATE POLICY "Family members can manage v3 documents"
ON v3_documents FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM family_members
    WHERE family_members.family_id = v3_documents.family_id
    AND family_members.user_id = auth.uid()
  )
);

-- Create indexes for performance
CREATE INDEX idx_v3_documents_family_student ON v3_documents(family_id, student_id);
CREATE INDEX idx_v3_documents_status ON v3_documents(status);

-- Insert the v3_document_pipeline feature flag
INSERT INTO feature_flags (flag_key, flag_name, is_enabled, rollout_percentage, description)
VALUES (
  'v3_document_pipeline',
  'V3 Document Pipeline',
  true,
  100,
  'Enables the new, simplified V3 document upload and analysis system (Project Bedrock)'
)
ON CONFLICT (flag_key) DO UPDATE SET 
  rollout_percentage = 100,
  is_enabled = true;