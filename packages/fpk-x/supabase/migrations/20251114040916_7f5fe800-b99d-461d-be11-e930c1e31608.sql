-- Create student_insights table for surfacing key AI findings on dashboard
CREATE TABLE IF NOT EXISTS public.student_insights (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  
  -- Relationships (student_id is UUID without FK as students table structure is unclear)
  student_id uuid NOT NULL,
  family_id uuid NOT NULL REFERENCES public.families(id) ON DELETE CASCADE,
  source_document_id uuid NOT NULL REFERENCES public.bedrock_documents(id) ON DELETE CASCADE,
  
  -- Insight Content
  insight_text text NOT NULL,
  insight_type text NOT NULL CHECK (insight_type IN ('strength', 'challenge', 'recommendation', 'observation', 'concern')),
  insight_level text NOT NULL CHECK (insight_level IN ('HIGH', 'MEDIUM', 'LOW')),
  insight_category text CHECK (insight_category IN ('Behavioral', 'Academic', 'Social', 'Communication', 'Physical', 'Other')),
  
  -- Metadata
  confidence_score numeric(3,2) CHECK (confidence_score >= 0 AND confidence_score <= 1),
  source_section text,
  document_category text,
  
  -- Lifecycle
  is_archived boolean DEFAULT false,
  is_dismissed boolean DEFAULT false,
  dismissed_by uuid REFERENCES auth.users(id),
  dismissed_at timestamptz
);

-- Indexes for performance
CREATE INDEX idx_student_insights_student ON public.student_insights(student_id);
CREATE INDEX idx_student_insights_family ON public.student_insights(family_id);
CREATE INDEX idx_student_insights_level ON public.student_insights(insight_level);
CREATE INDEX idx_student_insights_active ON public.student_insights(student_id, is_archived, is_dismissed) 
  WHERE is_archived = false AND is_dismissed = false;

-- Enable RLS
ALTER TABLE public.student_insights ENABLE ROW LEVEL SECURITY;

-- Family members can view insights for their students
CREATE POLICY "Family members can view student insights"
  ON public.student_insights FOR SELECT
  USING (is_family_member(auth.uid(), family_id));

-- System can insert insights (called from edge function)
CREATE POLICY "System can insert insights"
  ON public.student_insights FOR INSERT
  WITH CHECK (is_family_member(auth.uid(), family_id));

-- Family owners can update/dismiss insights
CREATE POLICY "Family owners can update insights"
  ON public.student_insights FOR UPDATE
  USING (is_family_owner(auth.uid(), family_id));

-- Trigger to update updated_at timestamp
CREATE TRIGGER update_student_insights_updated_at
  BEFORE UPDATE ON public.student_insights
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();