-- Create system error log table for tracking user flow interruptions
CREATE TABLE public.system_error_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  family_id UUID REFERENCES families(id) ON DELETE SET NULL,
  error_type TEXT NOT NULL, -- 'document_upload_failure', 'page_not_found', 'api_error', etc.
  error_code TEXT, -- HTTP status code or custom error code
  error_message TEXT NOT NULL,
  user_action TEXT NOT NULL, -- What the user was doing
  context_data JSONB DEFAULT '{}', -- Additional context (file size, file type, route, etc.)
  stack_trace TEXT,
  user_agent TEXT,
  ip_address TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Add index for common queries
CREATE INDEX idx_system_error_log_created_at ON public.system_error_log(created_at DESC);
CREATE INDEX idx_system_error_log_error_type ON public.system_error_log(error_type);
CREATE INDEX idx_system_error_log_user_id ON public.system_error_log(user_id);

-- Enable RLS
ALTER TABLE public.system_error_log ENABLE ROW LEVEL SECURITY;

-- Super admins can view all error logs
CREATE POLICY "Super admins can view all error logs"
ON public.system_error_log
FOR SELECT
TO authenticated
USING (has_super_admin_role(auth.uid()));

-- System can insert error logs (anyone can log errors)
CREATE POLICY "Anyone can insert error logs"
ON public.system_error_log
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

-- Create system health metrics view for dashboard
CREATE OR REPLACE VIEW public.system_health_metrics AS
SELECT
  -- User metrics
  (SELECT COUNT(*) FROM auth.users) as total_users,
  (SELECT COUNT(*) FROM auth.users WHERE last_sign_in_at > NOW() - INTERVAL '24 hours') as active_users_24h,
  (SELECT COUNT(*) FROM auth.users WHERE last_sign_in_at > NOW() - INTERVAL '7 days') as active_users_7d,
  (SELECT COUNT(*) FROM auth.users WHERE created_at > NOW() - INTERVAL '30 days') as new_users_30d,
  
  -- Family metrics
  (SELECT COUNT(*) FROM families) as total_families,
  (SELECT COUNT(*) FROM families WHERE created_at > NOW() - INTERVAL '30 days') as new_families_30d,
  
  -- Organization metrics
  (SELECT COUNT(*) FROM organizations) as total_organizations,
  (SELECT COUNT(*) FROM organizations WHERE is_active = true) as active_organizations,
  
  -- Document metrics
  (SELECT COUNT(*) FROM documents) as total_documents,
  (SELECT COUNT(*) FROM documents WHERE created_at > NOW() - INTERVAL '24 hours') as documents_uploaded_24h,
  (SELECT COALESCE(SUM(file_size_kb), 0) FROM documents) as total_storage_kb,
  
  -- Error metrics
  (SELECT COUNT(*) FROM system_error_log WHERE created_at > NOW() - INTERVAL '24 hours') as errors_24h,
  (SELECT COUNT(*) FROM system_error_log WHERE created_at > NOW() - INTERVAL '7 days') as errors_7d,
  (SELECT COUNT(*) FROM system_error_log WHERE error_type = 'document_upload_failure' AND created_at > NOW() - INTERVAL '24 hours') as upload_failures_24h;

-- Grant access to super admins
GRANT SELECT ON public.system_health_metrics TO authenticated;