-- AI Insights System Database Schema

-- AI Inbox cards for prioritized insights
CREATE TABLE public.ai_inbox (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  org_id uuid,
  type text NOT NULL,
  title text NOT NULL,
  subtitle text,
  severity text NOT NULL DEFAULT 'medium' CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  confidence numeric NOT NULL DEFAULT 0.0 CHECK (confidence >= 0.0 AND confidence <= 1.0),
  why jsonb DEFAULT '[]'::jsonb,
  cta jsonb NOT NULL DEFAULT '{}'::jsonb,
  dismissed boolean DEFAULT false,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Risk radar alerts for early warning system
CREATE TABLE public.risk_radar_alerts (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id uuid NOT NULL,
  cohort_id uuid,
  risk_type text NOT NULL CHECK (risk_type IN ('miss_deadline', 'drop_mastery', 'engagement_drop', 'misconception_pattern')),
  risk_score numeric NOT NULL CHECK (risk_score >= 0.0 AND risk_score <= 1.0),
  confidence numeric NOT NULL CHECK (confidence >= 0.0 AND confidence <= 1.0),
  next_deadline_at timestamp with time zone,
  top_features jsonb DEFAULT '[]'::jsonb,
  suggested_actions jsonb DEFAULT '[]'::jsonb,
  resolved boolean DEFAULT false,
  resolved_at timestamp with time zone,
  window_days integer DEFAULT 7,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Misconception clusters for learning insights
CREATE TABLE public.misconception_clusters (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  cohort_id uuid NOT NULL,
  label text NOT NULL,
  support_count integer NOT NULL DEFAULT 0,
  confidence numeric NOT NULL CHECK (confidence >= 0.0 AND confidence <= 1.0),
  representative_answers jsonb DEFAULT '[]'::jsonb,
  linked_outcomes jsonb DEFAULT '[]'::jsonb,
  suggested_actions jsonb DEFAULT '[]'::jsonb,
  window_days integer DEFAULT 7,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Prerequisite gap analysis
CREATE TABLE public.gap_analysis (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  course_id text NOT NULL,
  cohort_id uuid,
  outcome_id text NOT NULL,
  title text NOT NULL,
  gap_score numeric NOT NULL CHECK (gap_score >= 0.0 AND gap_score <= 1.0),
  confidence numeric NOT NULL CHECK (confidence >= 0.0 AND confidence <= 1.0),
  blockers jsonb DEFAULT '[]'::jsonb,
  metrics jsonb DEFAULT '{}'::jsonb,
  window_days integer DEFAULT 7,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Engagement mastery matrix data
CREATE TABLE public.engagement_matrix (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  cohort_id uuid NOT NULL,
  quadrants jsonb NOT NULL DEFAULT '{}'::jsonb,
  thresholds jsonb NOT NULL DEFAULT '{"engagement": 0.6, "mastery": 0.7}'::jsonb,
  examples jsonb DEFAULT '{}'::jsonb,
  window_days integer DEFAULT 7,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enhanced analytics metrics for AI insights
ALTER TABLE public.analytics_metrics 
ADD COLUMN IF NOT EXISTS insight_type text,
ADD COLUMN IF NOT EXISTS cohort_id uuid,
ADD COLUMN IF NOT EXISTS confidence numeric DEFAULT 0.0 CHECK (confidence >= 0.0 AND confidence <= 1.0);

-- Enable RLS
ALTER TABLE public.ai_inbox ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.risk_radar_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.misconception_clusters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gap_analysis ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.engagement_matrix ENABLE ROW LEVEL SECURITY;

-- RLS Policies for ai_inbox
CREATE POLICY "Users can view their own inbox items" ON public.ai_inbox
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Org members can view org inbox items" ON public.ai_inbox
  FOR SELECT USING (
    org_id IS NOT NULL AND 
    EXISTS (
      SELECT 1 FROM public.org_members 
      WHERE org_id = ai_inbox.org_id 
      AND user_id = auth.uid() 
      AND status = 'active'
    )
  );

CREATE POLICY "Admins can view all inbox items" ON public.ai_inbox
  FOR SELECT USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "System can insert inbox items" ON public.ai_inbox
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update their own inbox items" ON public.ai_inbox
  FOR UPDATE USING (user_id = auth.uid() OR has_role(auth.uid(), 'admin'::app_role));

-- RLS Policies for risk_radar_alerts
CREATE POLICY "Org members can view org risk alerts" ON public.risk_radar_alerts
  FOR SELECT USING (
    cohort_id IS NOT NULL AND 
    EXISTS (
      SELECT 1 FROM public.org_members 
      WHERE user_id = auth.uid() 
      AND status = 'active'
    )
  );

CREATE POLICY "Students can view their own risk alerts" ON public.risk_radar_alerts
  FOR SELECT USING (student_id = auth.uid());

CREATE POLICY "Admins can manage all risk alerts" ON public.risk_radar_alerts
  FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "System can insert risk alerts" ON public.risk_radar_alerts
  FOR INSERT WITH CHECK (true);

-- RLS Policies for misconception_clusters
CREATE POLICY "Org members can view org misconceptions" ON public.misconception_clusters
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.org_members 
      WHERE user_id = auth.uid() 
      AND status = 'active'
    )
  );

CREATE POLICY "Admins can manage all misconceptions" ON public.misconception_clusters
  FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "System can insert misconceptions" ON public.misconception_clusters
  FOR INSERT WITH CHECK (true);

-- RLS Policies for gap_analysis
CREATE POLICY "Org members can view org gap analysis" ON public.gap_analysis
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.org_members 
      WHERE user_id = auth.uid() 
      AND status = 'active'
    )
  );

CREATE POLICY "Admins can manage all gap analysis" ON public.gap_analysis
  FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "System can insert gap analysis" ON public.gap_analysis
  FOR INSERT WITH CHECK (true);

-- RLS Policies for engagement_matrix
CREATE POLICY "Org members can view org engagement matrix" ON public.engagement_matrix
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.org_members 
      WHERE user_id = auth.uid() 
      AND status = 'active'
    )
  );

CREATE POLICY "Admins can manage all engagement matrix" ON public.engagement_matrix
  FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "System can insert engagement matrix" ON public.engagement_matrix
  FOR INSERT WITH CHECK (true);

-- Indexes for performance
CREATE INDEX idx_ai_inbox_user_id ON public.ai_inbox(user_id);
CREATE INDEX idx_ai_inbox_org_id ON public.ai_inbox(org_id);
CREATE INDEX idx_ai_inbox_created_at ON public.ai_inbox(created_at DESC);
CREATE INDEX idx_ai_inbox_severity ON public.ai_inbox(severity);

CREATE INDEX idx_risk_radar_student_id ON public.risk_radar_alerts(student_id);
CREATE INDEX idx_risk_radar_cohort_id ON public.risk_radar_alerts(cohort_id);
CREATE INDEX idx_risk_radar_risk_score ON public.risk_radar_alerts(risk_score DESC);
CREATE INDEX idx_risk_radar_created_at ON public.risk_radar_alerts(created_at DESC);

CREATE INDEX idx_misconception_cohort_id ON public.misconception_clusters(cohort_id);
CREATE INDEX idx_misconception_created_at ON public.misconception_clusters(created_at DESC);

CREATE INDEX idx_gap_analysis_course_id ON public.gap_analysis(course_id);
CREATE INDEX idx_gap_analysis_cohort_id ON public.gap_analysis(cohort_id);
CREATE INDEX idx_gap_analysis_created_at ON public.gap_analysis(created_at DESC);

CREATE INDEX idx_engagement_matrix_cohort_id ON public.engagement_matrix(cohort_id);
CREATE INDEX idx_engagement_matrix_created_at ON public.engagement_matrix(created_at DESC);

-- Update updated_at triggers
CREATE OR REPLACE FUNCTION public.update_ai_insights_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_ai_inbox_updated_at
  BEFORE UPDATE ON public.ai_inbox
  FOR EACH ROW
  EXECUTE FUNCTION public.update_ai_insights_updated_at();

CREATE TRIGGER update_risk_radar_updated_at
  BEFORE UPDATE ON public.risk_radar_alerts
  FOR EACH ROW
  EXECUTE FUNCTION public.update_ai_insights_updated_at();

CREATE TRIGGER update_misconception_updated_at
  BEFORE UPDATE ON public.misconception_clusters
  FOR EACH ROW
  EXECUTE FUNCTION public.update_ai_insights_updated_at();

CREATE TRIGGER update_gap_analysis_updated_at
  BEFORE UPDATE ON public.gap_analysis
  FOR EACH ROW
  EXECUTE FUNCTION public.update_ai_insights_updated_at();

CREATE TRIGGER update_engagement_matrix_updated_at
  BEFORE UPDATE ON public.engagement_matrix
  FOR EACH ROW
  EXECUTE FUNCTION public.update_ai_insights_updated_at();