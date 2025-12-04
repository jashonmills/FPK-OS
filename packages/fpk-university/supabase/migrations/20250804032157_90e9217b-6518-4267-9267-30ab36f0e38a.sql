-- Phase 2: Data Governance & Automated Retention

-- Function to automatically delete expired data based on retention policies
CREATE OR REPLACE FUNCTION public.cleanup_expired_data()
RETURNS TABLE(
  table_name text,
  records_deleted integer,
  cleanup_date timestamp with time zone
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  policy_record RECORD;
  deleted_count integer;
  cleanup_result text;
BEGIN
  -- Loop through active retention policies
  FOR policy_record IN 
    SELECT * FROM data_retention_policies WHERE is_active = true
  LOOP
    deleted_count := 0;
    
    -- Handle different table cleanup logic
    CASE policy_record.table_name
      WHEN 'profiles' THEN
        -- Only delete profiles of users who haven't logged in for retention period
        -- and have explicitly requested deletion
        DELETE FROM profiles p
        WHERE EXISTS (
          SELECT 1 FROM auth.users au 
          WHERE au.id = p.id 
          AND au.last_sign_in_at < now() - (policy_record.retention_period_days || ' days')::interval
          AND au.deleted_at IS NOT NULL
        );
        GET DIAGNOSTICS deleted_count = ROW_COUNT;
        
      WHEN 'chat_sessions' THEN
        DELETE FROM chat_sessions 
        WHERE updated_at < now() - (policy_record.retention_period_days || ' days')::interval;
        GET DIAGNOSTICS deleted_count = ROW_COUNT;
        
      WHEN 'daily_activities' THEN
        DELETE FROM daily_activities 
        WHERE created_at < now() - (policy_record.retention_period_days || ' days')::interval;
        GET DIAGNOSTICS deleted_count = ROW_COUNT;
        
      WHEN 'analytics_metrics' THEN
        DELETE FROM analytics_metrics 
        WHERE timestamp < now() - (policy_record.retention_period_days || ' days')::interval;
        GET DIAGNOSTICS deleted_count = ROW_COUNT;
        
      WHEN 'user_consent' THEN
        -- Only delete withdrawn consent records after retention period
        DELETE FROM user_consent 
        WHERE withdrawn_at IS NOT NULL 
        AND withdrawn_at < now() - (policy_record.retention_period_days || ' days')::interval;
        GET DIAGNOSTICS deleted_count = ROW_COUNT;
        
      ELSE
        -- Generic cleanup for other tables
        EXECUTE format('DELETE FROM %I WHERE created_at < now() - interval ''%s days''', 
                      policy_record.table_name, policy_record.retention_period_days);
        GET DIAGNOSTICS deleted_count = ROW_COUNT;
    END CASE;
    
    -- Log cleanup activity
    INSERT INTO audit_log (
      user_id, action, table_name, new_values, 
      legal_basis, purpose, timestamp
    ) VALUES (
      null, 'cleanup', policy_record.table_name, 
      jsonb_build_object('records_deleted', deleted_count, 'retention_days', policy_record.retention_period_days),
      'legal_obligation', 'Automated data retention cleanup', now()
    );
    
    -- Return results
    table_name := policy_record.table_name;
    records_deleted := deleted_count;
    cleanup_date := now();
    RETURN NEXT;
  END LOOP;
END;
$$;

-- Function to validate and update legal basis for data processing
CREATE OR REPLACE FUNCTION public.validate_legal_basis(
  p_user_id uuid,
  p_processing_purpose text,
  p_data_categories text[]
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  consent_status jsonb := '{}';
  processing_activity RECORD;
  consent_record RECORD;
  is_valid boolean := true;
  validation_result jsonb;
BEGIN
  -- Find relevant processing activity
  SELECT * INTO processing_activity
  FROM data_processing_activities
  WHERE activity_name ILIKE '%' || p_processing_purpose || '%'
  AND is_active = true
  LIMIT 1;
  
  IF NOT FOUND THEN
    RETURN jsonb_build_object(
      'valid', false,
      'error', 'No processing activity found for purpose: ' || p_processing_purpose
    );
  END IF;
  
  -- Check consent requirements based on legal basis
  IF processing_activity.legal_basis = 'consent' THEN
    -- Verify user has given consent for required categories
    FOR consent_record IN 
      SELECT consent_type, is_granted, withdrawn_at
      FROM user_consent
      WHERE user_id = p_user_id
      AND consent_type = ANY(p_data_categories)
      ORDER BY created_at DESC
    LOOP
      consent_status := consent_status || jsonb_build_object(
        consent_record.consent_type, 
        jsonb_build_object(
          'granted', consent_record.is_granted,
          'withdrawn', consent_record.withdrawn_at IS NOT NULL
        )
      );
      
      -- Check if consent is still valid
      IF NOT consent_record.is_granted OR consent_record.withdrawn_at IS NOT NULL THEN
        is_valid := false;
      END IF;
    END LOOP;
  END IF;
  
  validation_result := jsonb_build_object(
    'valid', is_valid,
    'legal_basis', processing_activity.legal_basis,
    'processing_activity', processing_activity.activity_name,
    'consent_status', consent_status,
    'data_categories', p_data_categories
  );
  
  -- Log validation check
  INSERT INTO audit_log (
    user_id, action, table_name, new_values,
    legal_basis, purpose, timestamp
  ) VALUES (
    p_user_id, 'validate', 'legal_basis_check', validation_result,
    processing_activity.legal_basis, 'Legal basis validation for: ' || p_processing_purpose, now()
  );
  
  RETURN validation_result;
END;
$$;

-- Function to handle consent withdrawal
CREATE OR REPLACE FUNCTION public.withdraw_user_consent(
  p_user_id uuid,
  p_consent_type text,
  p_reason text DEFAULT 'User requested withdrawal'
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  affected_records integer := 0;
  cleanup_actions text[] := '{}';
  withdrawal_result jsonb;
BEGIN
  -- Mark consent as withdrawn
  UPDATE user_consent 
  SET 
    is_granted = false,
    withdrawn_at = now(),
    updated_at = now()
  WHERE user_id = p_user_id 
  AND consent_type = p_consent_type 
  AND withdrawn_at IS NULL;
  
  GET DIAGNOSTICS affected_records = ROW_COUNT;
  
  -- Perform data cleanup based on consent type
  CASE p_consent_type
    WHEN 'analytics' THEN
      DELETE FROM analytics_metrics WHERE user_id = p_user_id;
      cleanup_actions := cleanup_actions || 'analytics_data_deleted';
      
    WHEN 'marketing' THEN
      -- Would integrate with marketing platforms to remove user
      cleanup_actions := cleanup_actions || 'marketing_preferences_updated';
      
    WHEN 'functional' THEN
      -- Clear functional preferences
      cleanup_actions := cleanup_actions || 'functional_preferences_cleared';
  END CASE;
  
  withdrawal_result := jsonb_build_object(
    'consent_type', p_consent_type,
    'withdrawn_at', now(),
    'reason', p_reason,
    'cleanup_actions', cleanup_actions,
    'records_affected', affected_records
  );
  
  -- Log withdrawal
  INSERT INTO audit_log (
    user_id, action, table_name, new_values,
    legal_basis, purpose, timestamp
  ) VALUES (
    p_user_id, 'withdraw', 'user_consent', withdrawal_result,
    'user_request', 'User withdrew consent: ' || p_consent_type, now()
  );
  
  RETURN withdrawal_result;
END;
$$;

-- Create table for tracking data subject requests (GDPR Articles 15-22)
CREATE TABLE public.data_subject_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  request_type text NOT NULL, -- 'access', 'rectification', 'erasure', 'portability', 'restriction', 'objection'
  status text NOT NULL DEFAULT 'pending', -- 'pending', 'in_progress', 'completed', 'rejected'
  description text,
  legal_basis text NOT NULL,
  requested_data_categories text[],
  response_data jsonb,
  processed_by uuid,
  due_date timestamp with time zone NOT NULL, -- 30 days from request
  completed_at timestamp with time zone,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.data_subject_requests ENABLE ROW LEVEL SECURITY;

-- Users can view their own requests
CREATE POLICY "Users can view their own data requests"
  ON public.data_subject_requests FOR SELECT
  USING (auth.uid() = user_id);

-- Users can create their own requests
CREATE POLICY "Users can create data requests"
  ON public.data_subject_requests FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Admins can manage all requests
CREATE POLICY "Admins can manage all data requests"
  ON public.data_subject_requests FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Add trigger for updated_at
CREATE TRIGGER update_data_subject_requests_updated_at
  BEFORE UPDATE ON public.data_subject_requests
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Function to automatically create data subject request
CREATE OR REPLACE FUNCTION public.create_data_subject_request(
  p_user_id uuid,
  p_request_type text,
  p_description text DEFAULT null,
  p_data_categories text[] DEFAULT null
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  request_id uuid;
  due_date timestamp with time zone;
BEGIN
  -- Calculate due date (30 days for most requests, 72 hours for breach notifications)
  due_date := CASE 
    WHEN p_request_type = 'breach_notification' THEN now() + interval '72 hours'
    ELSE now() + interval '30 days'
  END;
  
  -- Create the request
  INSERT INTO data_subject_requests (
    user_id, request_type, description, legal_basis,
    requested_data_categories, due_date
  ) VALUES (
    p_user_id, p_request_type, p_description, 'gdpr_compliance',
    COALESCE(p_data_categories, ARRAY['all']), due_date
  ) RETURNING id INTO request_id;
  
  -- Log the request creation
  PERFORM record_audit_event(
    p_user_id, 'create', 'data_subject_requests', request_id,
    null, jsonb_build_object('request_type', p_request_type),
    'gdpr_compliance', 'Data subject request created: ' || p_request_type
  );
  
  RETURN request_id;
END;
$$;

-- Create index for performance
CREATE INDEX idx_data_subject_requests_user_id ON public.data_subject_requests(user_id);
CREATE INDEX idx_data_subject_requests_status ON public.data_subject_requests(status);
CREATE INDEX idx_data_subject_requests_due_date ON public.data_subject_requests(due_date);

-- Insert sample legal basis documentation for common processing activities
INSERT INTO public.data_processing_activities (
  activity_name, purpose, legal_basis, data_categories, data_subjects, 
  retention_period, controller_name, controller_contact
) VALUES
(
  'Marketing Communications',
  'Sending promotional emails and personalized content to users',
  'consent',
  ARRAY['contact_data', 'behavioral_data', 'preference_data'],
  ARRAY['platform_users', 'newsletter_subscribers'],
  '2 years after unsubscribe',
  'Learning Platform',
  'privacy@company.com'
),
(
  'Security Monitoring',
  'Monitoring platform security and preventing unauthorized access',
  'legitimate_interest',
  ARRAY['technical_data', 'usage_data', 'device_data'],
  ARRAY['all_users'],
  '5 years after incident',
  'Learning Platform',
  'privacy@company.com'
),
(
  'Performance Analytics',
  'Analyzing platform performance and user experience optimization',
  'legitimate_interest',
  ARRAY['usage_data', 'performance_data', 'technical_data'],
  ARRAY['platform_users'],
  '3 years after collection',
  'Learning Platform',
  'privacy@company.com'
);

-- Update existing data processing activities with security measures
UPDATE public.data_processing_activities 
SET security_measures = ARRAY[
  'encryption_at_rest',
  'encryption_in_transit', 
  'access_controls',
  'audit_logging',
  'regular_backups',
  'incident_response_plan'
]
WHERE security_measures IS NULL;