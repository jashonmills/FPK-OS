-- Phase 3-4: HIPAA Access Controls, Breach Automation, and Admin Compliance Tools

-- HIPAA Access Control Tables
CREATE TABLE public.hipaa_access_roles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  role_name TEXT NOT NULL UNIQUE,
  description TEXT,
  access_level TEXT NOT NULL CHECK (access_level IN ('minimum_necessary', 'administrative', 'emergency', 'technical')),
  permissions JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE public.user_access_certifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  certification_type TEXT NOT NULL,
  issued_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  expiry_date TIMESTAMP WITH TIME ZONE NOT NULL,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'expired', 'revoked', 'suspended')),
  issuer TEXT,
  training_completed BOOLEAN NOT NULL DEFAULT false,
  last_access_review TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE public.emergency_access_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  requestor_id UUID NOT NULL,
  requested_resource TEXT NOT NULL,
  justification TEXT NOT NULL,
  emergency_type TEXT NOT NULL,
  approval_status TEXT NOT NULL DEFAULT 'pending' CHECK (approval_status IN ('pending', 'approved', 'denied', 'expired')),
  approved_by UUID,
  approved_at TIMESTAMP WITH TIME ZONE,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  access_granted BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Breach Detection and Response Tables
CREATE TABLE public.security_incidents (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  incident_type TEXT NOT NULL,
  severity_level TEXT NOT NULL CHECK (severity_level IN ('low', 'medium', 'high', 'critical')),
  detection_method TEXT NOT NULL,
  description TEXT NOT NULL,
  affected_systems JSONB,
  affected_users_count INTEGER DEFAULT 0,
  data_types_affected JSONB,
  incident_status TEXT NOT NULL DEFAULT 'open' CHECK (incident_status IN ('open', 'investigating', 'contained', 'resolved', 'closed')),
  detection_timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  containment_timestamp TIMESTAMP WITH TIME ZONE,
  resolution_timestamp TIMESTAMP WITH TIME ZONE,
  assigned_to UUID,
  escalation_level INTEGER DEFAULT 1,
  regulatory_reporting_required BOOLEAN NOT NULL DEFAULT false,
  notifications_sent JSONB DEFAULT '{}',
  remediation_actions TEXT,
  lessons_learned TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE public.incident_response_actions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  incident_id UUID NOT NULL REFERENCES public.security_incidents(id) ON DELETE CASCADE,
  action_type TEXT NOT NULL,
  action_description TEXT NOT NULL,
  performed_by UUID,
  performed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'failed')),
  evidence JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Compliance Management Tables
CREATE TABLE public.compliance_policies (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  policy_name TEXT NOT NULL,
  policy_category TEXT NOT NULL,
  version TEXT NOT NULL DEFAULT '1.0',
  content TEXT NOT NULL,
  effective_date TIMESTAMP WITH TIME ZONE NOT NULL,
  review_date TIMESTAMP WITH TIME ZONE,
  approval_status TEXT NOT NULL DEFAULT 'draft' CHECK (approval_status IN ('draft', 'pending_review', 'approved', 'archived')),
  approved_by UUID,
  approved_at TIMESTAMP WITH TIME ZONE,
  mandatory_training BOOLEAN NOT NULL DEFAULT false,
  created_by UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE public.compliance_assessments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  assessment_name TEXT NOT NULL,
  assessment_type TEXT NOT NULL,
  framework TEXT NOT NULL, -- HIPAA, GDPR, SOC2, etc.
  scope TEXT NOT NULL,
  assessment_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  assessor_name TEXT,
  overall_score DECIMAL(5,2),
  risk_level TEXT CHECK (risk_level IN ('low', 'medium', 'high', 'critical')),
  findings JSONB,
  recommendations JSONB,
  action_items JSONB,
  status TEXT NOT NULL DEFAULT 'in_progress' CHECK (status IN ('planned', 'in_progress', 'completed', 'follow_up_required')),
  next_assessment_due TIMESTAMP WITH TIME ZONE,
  created_by UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE public.training_modules (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  module_name TEXT NOT NULL,
  description TEXT,
  content_url TEXT,
  duration_minutes INTEGER,
  mandatory BOOLEAN NOT NULL DEFAULT false,
  compliance_framework TEXT,
  passing_score INTEGER DEFAULT 80,
  created_by UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE public.user_training_completions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  training_module_id UUID NOT NULL REFERENCES public.training_modules(id) ON DELETE CASCADE,
  completion_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  score INTEGER,
  passed BOOLEAN NOT NULL DEFAULT false,
  certificate_url TEXT,
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enhanced audit log for HIPAA compliance
CREATE TABLE public.hipaa_audit_log (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID,
  user_role TEXT,
  action_type TEXT NOT NULL,
  resource_type TEXT NOT NULL,
  resource_id UUID,
  phi_accessed BOOLEAN NOT NULL DEFAULT false,
  minimum_necessary_justified BOOLEAN,
  access_purpose TEXT,
  patient_id UUID,
  ip_address INET,
  user_agent TEXT,
  session_id TEXT,
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  audit_trail_hash TEXT -- For integrity verification
);

-- RLS Policies
ALTER TABLE public.hipaa_access_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_access_certifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.emergency_access_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.security_incidents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.incident_response_actions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.compliance_policies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.compliance_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.training_modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_training_completions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hipaa_audit_log ENABLE ROW LEVEL SECURITY;

-- Admin-only access for most compliance tables
CREATE POLICY "Admins can manage HIPAA roles" ON public.hipaa_access_roles FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can manage security incidents" ON public.security_incidents FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can manage compliance policies" ON public.compliance_policies FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can manage compliance assessments" ON public.compliance_assessments FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can manage training modules" ON public.training_modules FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- User-specific access for certifications and training
CREATE POLICY "Users can view their own certifications" ON public.user_access_certifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins can manage all certifications" ON public.user_access_certifications FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Users can create emergency access requests" ON public.emergency_access_requests FOR INSERT WITH CHECK (auth.uid() = requestor_id);
CREATE POLICY "Users can view their own emergency requests" ON public.emergency_access_requests FOR SELECT USING (auth.uid() = requestor_id);
CREATE POLICY "Admins can manage emergency requests" ON public.emergency_access_requests FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Users can view their own training completions" ON public.user_training_completions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own training completions" ON public.user_training_completions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins can manage all training completions" ON public.user_training_completions FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can view HIPAA audit logs" ON public.hipaa_audit_log FOR SELECT USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "System can create HIPAA audit logs" ON public.hipaa_audit_log FOR INSERT WITH CHECK (true);

-- Triggers for updated_at timestamps
CREATE TRIGGER update_hipaa_access_roles_updated_at BEFORE UPDATE ON public.hipaa_access_roles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_user_access_certifications_updated_at BEFORE UPDATE ON public.user_access_certifications FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_emergency_access_requests_updated_at BEFORE UPDATE ON public.emergency_access_requests FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_security_incidents_updated_at BEFORE UPDATE ON public.security_incidents FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_compliance_policies_updated_at BEFORE UPDATE ON public.compliance_policies FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_compliance_assessments_updated_at BEFORE UPDATE ON public.compliance_assessments FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_training_modules_updated_at BEFORE UPDATE ON public.training_modules FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default HIPAA access roles
INSERT INTO public.hipaa_access_roles (role_name, description, access_level, permissions) VALUES
('HIPAA Administrator', 'Full administrative access to all PHI and systems', 'administrative', '{"phi_access": true, "user_management": true, "policy_management": true, "audit_access": true}'),
('Clinical Staff', 'Access to PHI for direct patient care', 'minimum_necessary', '{"phi_access": true, "patient_records": true, "treatment_only": true}'),
('Technical Support', 'Technical access for system maintenance', 'technical', '{"system_access": true, "phi_access": false, "maintenance_only": true}'),
('Emergency Responder', 'Emergency access to critical patient information', 'emergency', '{"phi_access": true, "emergency_only": true, "time_limited": true}'),
('Compliance Officer', 'Access for compliance monitoring and reporting', 'administrative', '{"audit_access": true, "compliance_reporting": true, "risk_assessment": true}');

-- Insert default training modules
INSERT INTO public.training_modules (module_name, description, duration_minutes, mandatory, compliance_framework, created_by) VALUES
('HIPAA Privacy and Security Training', 'Comprehensive training on HIPAA privacy and security requirements', 90, true, 'HIPAA', (SELECT id FROM auth.users LIMIT 1)),
('Data Breach Response Procedures', 'Training on incident response and breach notification procedures', 45, true, 'HIPAA', (SELECT id FROM auth.users LIMIT 1)),
('GDPR Compliance for Healthcare', 'GDPR compliance requirements in healthcare context', 60, true, 'GDPR', (SELECT id FROM auth.users LIMIT 1)),
('Minimum Necessary Standard', 'Understanding and implementing minimum necessary access', 30, true, 'HIPAA', (SELECT id FROM auth.users LIMIT 1));

-- Functions for HIPAA compliance
CREATE OR REPLACE FUNCTION public.log_hipaa_access(
  p_user_id UUID,
  p_action_type TEXT,
  p_resource_type TEXT,
  p_resource_id UUID DEFAULT NULL,
  p_phi_accessed BOOLEAN DEFAULT FALSE,
  p_access_purpose TEXT DEFAULT NULL,
  p_patient_id UUID DEFAULT NULL
) RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  user_role_info TEXT;
BEGIN
  -- Get user role information
  SELECT string_agg(role::TEXT, ',') INTO user_role_info
  FROM user_roles 
  WHERE user_id = p_user_id;
  
  -- Log the access
  INSERT INTO public.hipaa_audit_log (
    user_id, user_role, action_type, resource_type, resource_id,
    phi_accessed, access_purpose, patient_id,
    ip_address, user_agent, session_id
  ) VALUES (
    p_user_id, user_role_info, p_action_type, p_resource_type, p_resource_id,
    p_phi_accessed, p_access_purpose, p_patient_id,
    inet_client_addr(),
    current_setting('request.headers', true)::json->>'user-agent',
    current_setting('request.headers', true)::json->>'x-session-id'
  );
END;
$$;

CREATE OR REPLACE FUNCTION public.detect_security_incident(
  p_incident_type TEXT,
  p_description TEXT,
  p_severity_level TEXT DEFAULT 'medium',
  p_affected_systems JSONB DEFAULT NULL,
  p_data_types_affected JSONB DEFAULT NULL
) RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  incident_id UUID;
  notification_required BOOLEAN := false;
BEGIN
  -- Create the incident
  INSERT INTO public.security_incidents (
    incident_type, description, severity_level,
    affected_systems, data_types_affected,
    detection_method, regulatory_reporting_required
  ) VALUES (
    p_incident_type, p_description, p_severity_level,
    p_affected_systems, p_data_types_affected,
    'automated_detection', 
    CASE WHEN p_severity_level IN ('high', 'critical') THEN true ELSE false END
  ) RETURNING id INTO incident_id;
  
  -- Determine if immediate notification is required
  notification_required := p_severity_level IN ('high', 'critical') OR 
                          (p_data_types_affected ? 'phi') OR 
                          (p_data_types_affected ? 'personal_data');
  
  -- Create immediate response actions for critical incidents
  IF p_severity_level = 'critical' THEN
    INSERT INTO public.incident_response_actions (incident_id, action_type, action_description, status)
    VALUES 
    (incident_id, 'containment', 'Immediate containment measures required', 'pending'),
    (incident_id, 'notification', 'Regulatory authorities notification required', 'pending'),
    (incident_id, 'assessment', 'Impact assessment and forensic analysis', 'pending');
  END IF;
  
  RETURN incident_id;
END;
$$;