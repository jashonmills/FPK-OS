-- Create document_reports table for storing comprehensive AI-generated reports
CREATE TABLE document_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  family_id UUID NOT NULL REFERENCES families(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  report_content TEXT NOT NULL,
  report_format TEXT DEFAULT 'markdown' CHECK (report_format IN ('markdown', 'html', 'pdf')),
  document_ids JSONB NOT NULL,
  metrics_count INTEGER NOT NULL DEFAULT 0,
  insights_count INTEGER NOT NULL DEFAULT 0,
  progress_records_count INTEGER NOT NULL DEFAULT 0,
  generated_by UUID REFERENCES auth.users(id),
  generated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE document_reports ENABLE ROW LEVEL SECURITY;

-- Family members can view reports for their family's students
CREATE POLICY "family_isolation_reports"
  ON document_reports FOR SELECT
  USING (
    family_id IN (
      SELECT family_id FROM family_members WHERE user_id = auth.uid()
    )
  );

-- Owners and contributors can generate reports
CREATE POLICY "family_owners_insert_reports"
  ON document_reports FOR INSERT
  WITH CHECK (
    family_id IN (
      SELECT family_id FROM family_members 
      WHERE user_id = auth.uid() AND role IN ('owner', 'contributor')
    )
  );

-- Owners and contributors can delete reports
CREATE POLICY "family_owners_delete_reports"
  ON document_reports FOR DELETE
  USING (
    family_id IN (
      SELECT family_id FROM family_members 
      WHERE user_id = auth.uid() AND role IN ('owner', 'contributor')
    )
  );

-- Create indexes for performance
CREATE INDEX idx_document_reports_family_student 
  ON document_reports(family_id, student_id);

CREATE INDEX idx_document_reports_generated_at 
  ON document_reports(generated_at DESC);

-- Trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_document_reports_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_document_reports_updated_at
  BEFORE UPDATE ON document_reports
  FOR EACH ROW
  EXECUTE FUNCTION update_document_reports_updated_at();