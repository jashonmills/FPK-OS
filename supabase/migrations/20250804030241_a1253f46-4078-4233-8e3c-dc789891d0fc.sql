-- Phase 1: Core GDPR Compliance Infrastructure

-- Table for tracking user consent preferences
CREATE TABLE public.user_consent (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  consent_type text NOT NULL, -- 'essential', 'analytics', 'marketing', 'functional'
  is_granted boolean NOT NULL DEFAULT false,
  granted_at timestamp with time zone,
  withdrawn_at timestamp with time zone,
  legal_basis text, -- 'consent', 'legitimate_interest', 'contract', etc.
  purpose text, -- Description of what the data is used for
  ip_address inet,
  user_agent text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.user_consent ENABLE ROW LEVEL SECURITY;

-- RLS policies for user_consent
CREATE POLICY "Users can view their own consent records"
  ON public.user_consent FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own consent records"
  ON public.user_consent FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own consent records"
  ON public.user_consent FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all consent records"
  ON public.user_consent FOR SELECT
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Table for comprehensive audit logging
CREATE TABLE public.audit_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid,
  action text NOT NULL, -- 'create', 'read', 'update', 'delete', 'export', 'access'
  table_name text NOT NULL,
  record_id uuid,
  old_values jsonb,
  new_values jsonb,
  ip_address inet,
  user_agent text,
  session_id text,
  legal_basis text,
  purpose text,
  timestamp timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS for audit_log
ALTER TABLE public.audit_log ENABLE ROW LEVEL SECURITY;

-- RLS policies for audit_log
CREATE POLICY "Users can view their own audit logs"
  ON public.audit_log FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "System can create audit logs"
  ON public.audit_log FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Admins can view all audit logs"
  ON public.audit_log FOR SELECT
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Table for data retention policies
CREATE TABLE public.data_retention_policies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  table_name text NOT NULL UNIQUE,
  retention_period_days integer NOT NULL,
  deletion_criteria jsonb,
  legal_basis text NOT NULL,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.data_retention_policies ENABLE ROW LEVEL SECURITY;

-- Only admins can manage retention policies
CREATE POLICY "Only admins can manage retention policies"
  ON public.data_retention_policies FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Table for data breach incidents
CREATE TABLE public.data_breach_incidents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  incident_type text NOT NULL,
  severity text NOT NULL, -- 'low', 'medium', 'high', 'critical'
  affected_records_count integer,
  affected_data_types text[],
  detection_method text,
  description text NOT NULL,
  remediation_actions text,
  notification_sent boolean NOT NULL DEFAULT false,
  notification_sent_at timestamp with time zone,
  regulatory_notification_required boolean NOT NULL DEFAULT false,
  regulatory_notification_sent boolean NOT NULL DEFAULT false,
  regulatory_notification_sent_at timestamp with time zone,
  status text NOT NULL DEFAULT 'open', -- 'open', 'investigating', 'contained', 'resolved'
  created_by uuid,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.data_breach_incidents ENABLE ROW LEVEL SECURITY;

-- Only admins can manage breach incidents
CREATE POLICY "Only admins can manage breach incidents"
  ON public.data_breach_incidents FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Table for data processing activities (GDPR Article 30)
CREATE TABLE public.data_processing_activities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  activity_name text NOT NULL,
  purpose text NOT NULL,
  legal_basis text NOT NULL,
  data_categories text[] NOT NULL,
  data_subjects text[] NOT NULL,
  recipients text[],
  international_transfers text[],
  retention_period text NOT NULL,
  security_measures text[],
  controller_name text NOT NULL,
  controller_contact text NOT NULL,
  dpo_contact text,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.data_processing_activities ENABLE ROW LEVEL SECURITY;

-- Only admins can manage processing activities
CREATE POLICY "Only admins can manage processing activities"
  ON public.data_processing_activities FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Create indexes for performance
CREATE INDEX idx_user_consent_user_id ON public.user_consent(user_id);
CREATE INDEX idx_user_consent_type ON public.user_consent(consent_type);
CREATE INDEX idx_audit_log_user_id ON public.audit_log(user_id);
CREATE INDEX idx_audit_log_timestamp ON public.audit_log(timestamp);
CREATE INDEX idx_audit_log_table_name ON public.audit_log(table_name);

-- Trigger to update updated_at timestamps
CREATE TRIGGER update_user_consent_updated_at
  BEFORE UPDATE ON public.user_consent
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_data_retention_policies_updated_at
  BEFORE UPDATE ON public.data_retention_policies
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_data_breach_incidents_updated_at
  BEFORE UPDATE ON public.data_breach_incidents
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_data_processing_activities_updated_at
  BEFORE UPDATE ON public.data_processing_activities
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default data retention policies
INSERT INTO public.data_retention_policies (table_name, retention_period_days, legal_basis) VALUES
('profiles', 2555, 'contract'), -- 7 years for user profiles
('chat_sessions', 1095, 'legitimate_interest'), -- 3 years for chat data
('audit_log', 2555, 'legal_obligation'), -- 7 years for audit logs
('user_consent', 2555, 'legal_obligation'), -- 7 years for consent records
('goals', 1095, 'legitimate_interest'), -- 3 years for goals
('flashcards', 1095, 'legitimate_interest'), -- 3 years for flashcards
('daily_activities', 1095, 'legitimate_interest'), -- 3 years for activities
('study_sessions', 1095, 'legitimate_interest'), -- 3 years for study data
('analytics_metrics', 1095, 'legitimate_interest'); -- 3 years for analytics

-- Insert default data processing activities
INSERT INTO public.data_processing_activities (
  activity_name, purpose, legal_basis, data_categories, data_subjects, 
  retention_period, controller_name, controller_contact
) VALUES
(
  'User Account Management',
  'Managing user accounts and providing learning platform services',
  'contract',
  ARRAY['identification_data', 'contact_data', 'profile_data'],
  ARRAY['platform_users'],
  '7 years after account closure',
  'Learning Platform',
  'privacy@company.com'
),
(
  'Learning Analytics',
  'Analyzing user learning patterns to improve platform effectiveness',
  'legitimate_interest',
  ARRAY['usage_data', 'performance_data', 'behavioral_data'],
  ARRAY['platform_users'],
  '3 years after data collection',
  'Learning Platform',
  'privacy@company.com'
),
(
  'Customer Support',
  'Providing technical support and customer service',
  'contract',
  ARRAY['identification_data', 'contact_data', 'support_communications'],
  ARRAY['platform_users'],
  '2 years after support interaction',
  'Learning Platform',
  'privacy@company.com'
);

-- Function to record audit events
CREATE OR REPLACE FUNCTION public.record_audit_event(
  p_user_id uuid,
  p_action text,
  p_table_name text,
  p_record_id uuid DEFAULT NULL,
  p_old_values jsonb DEFAULT NULL,
  p_new_values jsonb DEFAULT NULL,
  p_legal_basis text DEFAULT NULL,
  p_purpose text DEFAULT NULL
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.audit_log (
    user_id, action, table_name, record_id, old_values, new_values, 
    legal_basis, purpose, ip_address, user_agent
  )
  VALUES (
    p_user_id, p_action, p_table_name, p_record_id, p_old_values, p_new_values,
    p_legal_basis, p_purpose, 
    inet_client_addr(), 
    current_setting('request.headers', true)::json->>'user-agent'
  );
END;
$$;