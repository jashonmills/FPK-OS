-- Fix get_comprehensive_user_data to match auth.users email type (varchar instead of text)
DROP FUNCTION IF EXISTS public.get_comprehensive_user_data(uuid, text, text[], text[], timestamptz, timestamptz, int, int);

CREATE FUNCTION public.get_comprehensive_user_data(
  p_user_id uuid DEFAULT NULL,
  p_search text DEFAULT NULL,
  p_status_filter text[] DEFAULT NULL,
  p_role_filter text[] DEFAULT NULL,
  p_date_after timestamptz DEFAULT NULL,
  p_date_before timestamptz DEFAULT NULL,
  p_limit int DEFAULT 25,
  p_offset int DEFAULT 0
)
RETURNS TABLE(
  user_id uuid,
  email text,
  display_name text,
  full_name text,
  photo_url text,
  created_at timestamptz,
  last_login timestamptz,
  account_status text,
  roles text[],
  families jsonb,
  engagement_metrics jsonb,
  last_modified_by uuid,
  last_modified_at timestamptz,
  total_count bigint
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
      v.user_id,
      au.email::text as email,
      v.display_name,
      v.full_name,
      v.photo_url,
      v.created_at,
      au.last_sign_in_at as last_login,
      v.account_status,
      v.roles,
      v.families,
      v.engagement_metrics,
      v.last_modified_by,
      v.last_modified_at,
      COUNT(*) OVER() as total_count
    FROM admin_user_management_view v
    JOIN auth.users au ON au.id = v.user_id
    WHERE 
      (p_user_id IS NULL OR v.user_id = p_user_id)
      AND (p_search IS NULL OR 
        au.email ILIKE '%' || p_search || '%' OR 
        v.display_name ILIKE '%' || p_search || '%' OR
        v.full_name ILIKE '%' || p_search || '%' OR
        v.user_id::text ILIKE '%' || p_search || '%')
      AND (p_status_filter IS NULL OR v.account_status = ANY(p_status_filter))
      AND (p_role_filter IS NULL OR v.roles && p_role_filter)
      AND (p_date_after IS NULL OR au.created_at >= p_date_after)
      AND (p_date_before IS NULL OR au.created_at <= p_date_before)
    ORDER BY au.created_at DESC
    LIMIT p_limit
    OFFSET p_offset
  )
  SELECT 
    fu.user_id,
    fu.email,
    fu.display_name,
    fu.full_name,
    fu.photo_url,
    fu.created_at,
    fu.last_login,
    fu.account_status,
    fu.roles,
    fu.families,
    fu.engagement_metrics,
    fu.last_modified_by,
    fu.last_modified_at,
    fu.total_count
  FROM filtered_users fu;
END;
$$;