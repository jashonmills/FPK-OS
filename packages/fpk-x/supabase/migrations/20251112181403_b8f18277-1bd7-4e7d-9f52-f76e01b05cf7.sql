-- Phase 1: Extend app_role enum to include super_admin
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'super_admin';

-- Create user_account_status table
CREATE TABLE IF NOT EXISTS public.user_account_status (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('active', 'suspended', 'invited')),
  status_reason TEXT,
  modified_by UUID REFERENCES auth.users(id),
  modified_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Enable RLS on user_account_status
ALTER TABLE public.user_account_status ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_account_status
CREATE POLICY "Admins can view all user account statuses"
  ON public.user_account_status
  FOR SELECT
  TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'super_admin'::app_role));

CREATE POLICY "Admins can insert user account statuses"
  ON public.user_account_status
  FOR INSERT
  TO authenticated
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'super_admin'::app_role));

CREATE POLICY "Admins can update user account statuses"
  ON public.user_account_status
  FOR UPDATE
  TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'super_admin'::app_role));

-- Create admin_audit_log table (immutable)
CREATE TABLE IF NOT EXISTS public.admin_audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_user_id UUID REFERENCES auth.users(id) NOT NULL,
  target_user_id UUID REFERENCES auth.users(id),
  action_type TEXT NOT NULL,
  action_details JSONB DEFAULT '{}'::jsonb,
  ip_address TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on admin_audit_log
ALTER TABLE public.admin_audit_log ENABLE ROW LEVEL SECURITY;

-- RLS Policies for admin_audit_log (read-only, no updates/deletes)
CREATE POLICY "Admins can view audit logs"
  ON public.admin_audit_log
  FOR SELECT
  TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'super_admin'::app_role));

CREATE POLICY "Admins can insert audit logs"
  ON public.admin_audit_log
  FOR INSERT
  TO authenticated
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'super_admin'::app_role));

-- Create function to check super admin role
CREATE OR REPLACE FUNCTION public.has_super_admin_role(_user_id UUID)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = 'super_admin'::app_role
  )
$$;

-- Create admin_impersonation_sessions table
CREATE TABLE IF NOT EXISTS public.admin_impersonation_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_user_id UUID REFERENCES auth.users(id) NOT NULL,
  target_user_id UUID REFERENCES auth.users(id) NOT NULL,
  token TEXT NOT NULL UNIQUE,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_active BOOLEAN DEFAULT TRUE
);

-- Enable RLS on admin_impersonation_sessions
ALTER TABLE public.admin_impersonation_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Super admins can manage impersonation sessions"
  ON public.admin_impersonation_sessions
  FOR ALL
  TO authenticated
  USING (has_super_admin_role(auth.uid()));

-- Create view for admin user management
CREATE OR REPLACE VIEW public.admin_user_management_view AS
WITH user_engagement AS (
  SELECT 
    fm.user_id,
    COUNT(DISTINCT d.id) as documents_uploaded,
    COUNT(DISTINCT pl.id) + COUNT(DISTINCT el.id) + COUNT(DISTINCT il.id) as logs_created,
    COALESCE(SUM(ABS(acl.credits_changed)), 0) as ai_credits_used,
    COUNT(DISTINCT acl.id) as ai_interactions,
    GREATEST(MAX(d.created_at), MAX(pl.created_at), MAX(el.created_at), MAX(il.created_at)) as last_activity_date
  FROM family_members fm
  LEFT JOIN documents d ON d.family_id = fm.family_id
  LEFT JOIN parent_logs pl ON pl.family_id = fm.family_id
  LEFT JOIN educator_logs el ON el.family_id = fm.family_id
  LEFT JOIN incident_logs il ON il.family_id = fm.family_id
  LEFT JOIN ai_credit_ledger acl ON acl.family_id = fm.family_id
  GROUP BY fm.user_id
),
user_families AS (
  SELECT 
    fm.user_id,
    jsonb_agg(
      jsonb_build_object(
        'familyId', f.id,
        'familyName', f.family_name,
        'roleInFamily', fm.role,
        'isPrimaryAccountHolder', (f.created_by = fm.user_id),
        'memberCount', (SELECT COUNT(*) FROM family_members WHERE family_id = f.id),
        'studentCount', (SELECT COUNT(*) FROM students WHERE family_id = f.id)
      )
    ) as families
  FROM family_members fm
  JOIN families f ON f.id = fm.family_id
  GROUP BY fm.user_id
)
SELECT 
  p.id as user_id,
  au.email,
  p.display_name,
  p.full_name,
  p.avatar_url as photo_url,
  au.created_at,
  (au.raw_user_meta_data->>'last_sign_in_at')::timestamp with time zone as last_login,
  COALESCE(uas.status, 'active') as account_status,
  COALESCE(
    (SELECT array_agg(role::text) FROM user_roles WHERE user_id = p.id),
    ARRAY[]::text[]
  ) as roles,
  COALESCE(uf.families, '[]'::jsonb) as families,
  jsonb_build_object(
    'documentsUploaded', COALESCE(ue.documents_uploaded, 0),
    'logsCreated', COALESCE(ue.logs_created, 0),
    'aiCreditsUsed', COALESCE(ue.ai_credits_used, 0),
    'aiInteractions', COALESCE(ue.ai_interactions, 0),
    'lastActivityDate', ue.last_activity_date,
    'hoursOnPlatform', 0
  ) as engagement_metrics,
  uas.modified_by as last_modified_by,
  uas.modified_at as last_modified_at
FROM auth.users au
JOIN profiles p ON p.id = au.id
LEFT JOIN user_account_status uas ON uas.user_id = au.id
LEFT JOIN user_engagement ue ON ue.user_id = p.id
LEFT JOIN user_families uf ON uf.user_id = p.id;

-- Grant access to view for authenticated users (RLS will handle admin check)
GRANT SELECT ON public.admin_user_management_view TO authenticated;

-- Create function to get comprehensive user data
CREATE OR REPLACE FUNCTION public.get_comprehensive_user_data(
  p_user_id UUID DEFAULT NULL,
  p_search TEXT DEFAULT NULL,
  p_status_filter TEXT[] DEFAULT NULL,
  p_role_filter TEXT[] DEFAULT NULL,
  p_date_after TIMESTAMP WITH TIME ZONE DEFAULT NULL,
  p_date_before TIMESTAMP WITH TIME ZONE DEFAULT NULL,
  p_limit INTEGER DEFAULT 25,
  p_offset INTEGER DEFAULT 0
)
RETURNS TABLE (
  user_id UUID,
  email TEXT,
  display_name TEXT,
  full_name TEXT,
  photo_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE,
  last_login TIMESTAMP WITH TIME ZONE,
  account_status TEXT,
  roles TEXT[],
  families JSONB,
  engagement_metrics JSONB,
  last_modified_by UUID,
  last_modified_at TIMESTAMP WITH TIME ZONE,
  total_count BIGINT
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Check if user has admin role
  IF NOT (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'super_admin'::app_role)) THEN
    RAISE EXCEPTION 'Access denied: Admin role required';
  END IF;

  RETURN QUERY
  WITH filtered_users AS (
    SELECT 
      v.*,
      COUNT(*) OVER() as total_count
    FROM admin_user_management_view v
    WHERE 
      (p_user_id IS NULL OR v.user_id = p_user_id)
      AND (p_search IS NULL OR 
        v.email ILIKE '%' || p_search || '%' OR 
        v.display_name ILIKE '%' || p_search || '%' OR
        v.full_name ILIKE '%' || p_search || '%' OR
        v.user_id::text ILIKE '%' || p_search || '%')
      AND (p_status_filter IS NULL OR v.account_status = ANY(p_status_filter))
      AND (p_role_filter IS NULL OR v.roles && p_role_filter)
      AND (p_date_after IS NULL OR v.created_at >= p_date_after)
      AND (p_date_before IS NULL OR v.created_at <= p_date_before)
    ORDER BY v.created_at DESC
    LIMIT p_limit
    OFFSET p_offset
  )
  SELECT * FROM filtered_users;
END;
$$;