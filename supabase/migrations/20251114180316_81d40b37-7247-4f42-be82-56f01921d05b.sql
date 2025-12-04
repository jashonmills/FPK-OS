-- ============================================================================
-- PHASE 1C: CREATE UNIVERSAL METRICS TABLE
-- ============================================================================
-- The bedrock_metrics table stores structured metrics extracted from 
-- document analysis data for BOTH B2C families and B2B organizations
-- ============================================================================

CREATE TABLE bedrock_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id UUID NOT NULL REFERENCES bedrock_documents(id) ON DELETE CASCADE,
  family_id UUID REFERENCES families(id) ON DELETE CASCADE,
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  
  -- Metric identification
  metric_type TEXT NOT NULL, -- 'behavior_frequency', 'academic_fluency', 'executive_function', etc.
  metric_name TEXT NOT NULL, -- Specific metric name (e.g., "Reading Fluency", "Task Initiation")
  metric_value NUMERIC, -- Measured value
  target_value NUMERIC, -- Target/baseline value for comparison
  measurement_date DATE NOT NULL, -- When this measurement was taken
  
  -- Context and details
  context TEXT, -- Additional context (e.g., "during math class", "morning routine")
  intervention_used TEXT, -- What intervention/support was used
  duration_minutes NUMERIC, -- Duration if applicable
  metadata JSONB DEFAULT '{}'::jsonb, -- Additional flexible data
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Constraints
  CONSTRAINT bedrock_metrics_owner_check 
  CHECK (
    (family_id IS NOT NULL AND organization_id IS NULL) OR 
    (family_id IS NULL AND organization_id IS NOT NULL)
  ),
  CONSTRAINT unique_metric_per_doc UNIQUE (document_id, metric_type, metric_name, measurement_date)
);

-- Indexes for fast queries
CREATE INDEX idx_bedrock_metrics_student ON bedrock_metrics(student_id, metric_type);
CREATE INDEX idx_bedrock_metrics_family ON bedrock_metrics(family_id, student_id);
CREATE INDEX idx_bedrock_metrics_org ON bedrock_metrics(organization_id, student_id);
CREATE INDEX idx_bedrock_metrics_date ON bedrock_metrics(measurement_date);
CREATE INDEX idx_bedrock_metrics_type ON bedrock_metrics(metric_type, metric_name);

-- RLS Policies
ALTER TABLE bedrock_metrics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view metrics"
ON bedrock_metrics FOR SELECT
USING (
  (family_id IS NOT NULL AND is_family_member(auth.uid(), family_id)) OR
  (organization_id IS NOT NULL AND is_organization_member(auth.uid(), organization_id))
);

CREATE POLICY "Users can insert metrics"
ON bedrock_metrics FOR INSERT
WITH CHECK (
  (family_id IS NOT NULL AND is_family_member(auth.uid(), family_id)) OR
  (organization_id IS NOT NULL AND is_organization_member(auth.uid(), organization_id))
);

CREATE POLICY "Users can update metrics"
ON bedrock_metrics FOR UPDATE
USING (
  (family_id IS NOT NULL AND is_family_member(auth.uid(), family_id)) OR
  (organization_id IS NOT NULL AND is_organization_member(auth.uid(), organization_id))
);

CREATE POLICY "Owners can delete metrics"
ON bedrock_metrics FOR DELETE
USING (
  (family_id IS NOT NULL AND is_family_owner(auth.uid(), family_id)) OR
  (organization_id IS NOT NULL AND is_organization_admin(auth.uid(), organization_id))
);

-- Comments for documentation
COMMENT ON TABLE bedrock_metrics IS 'Structured metrics extracted from Bedrock document analysis for both B2C and B2B';
COMMENT ON COLUMN bedrock_metrics.family_id IS 'Family that owns this metric (B2C). Mutually exclusive with organization_id.';
COMMENT ON COLUMN bedrock_metrics.organization_id IS 'Organization that owns this metric (B2B). Mutually exclusive with family_id.';
COMMENT ON COLUMN bedrock_metrics.metric_type IS 'Category of metric (behavior_frequency, academic_fluency, executive_function, communication, etc.)';
COMMENT ON COLUMN bedrock_metrics.metric_name IS 'Specific metric name extracted from analysis';
COMMENT ON COLUMN bedrock_metrics.metric_value IS 'Measured value of the metric';
COMMENT ON COLUMN bedrock_metrics.target_value IS 'Target or baseline value for comparison';
COMMENT ON COLUMN bedrock_metrics.measurement_date IS 'Date when this measurement was taken';
COMMENT ON COLUMN bedrock_metrics.context IS 'Additional context about the measurement';
COMMENT ON COLUMN bedrock_metrics.intervention_used IS 'Intervention or support strategy used';
COMMENT ON COLUMN bedrock_metrics.duration_minutes IS 'Duration of activity/observation in minutes';