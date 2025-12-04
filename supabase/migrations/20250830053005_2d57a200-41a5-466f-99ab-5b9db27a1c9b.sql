-- Helper function to check if current user is admin
-- Reads from auth.users user_metadata.role field
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN 
LANGUAGE SQL 
SECURITY DEFINER
STABLE
AS $$
  SELECT COALESCE(
    (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin', 
    false
  );
$$;

-- Function to get current user's role from metadata
CREATE OR REPLACE FUNCTION public.current_user_role()
RETURNS TEXT
LANGUAGE SQL 
SECURITY DEFINER
STABLE
AS $$
  SELECT COALESCE(
    (auth.jwt() -> 'user_metadata' ->> 'role'),
    'learner'
  );
$$;

-- Enable RLS on all SCORM tables and create admin-only policies
ALTER TABLE public.scorm_packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scorm_scos ENABLE ROW LEVEL SECURITY; 
ALTER TABLE public.scorm_enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scorm_runtime ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scorm_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scorm_rate_limits ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "scorm_packages_admin_only" ON public.scorm_packages;
DROP POLICY IF EXISTS "scorm_scos_admin_only" ON public.scorm_scos;
DROP POLICY IF EXISTS "scorm_enrollments_admin_only" ON public.scorm_enrollments;
DROP POLICY IF EXISTS "scorm_runtime_admin_only" ON public.scorm_runtime;
DROP POLICY IF EXISTS "scorm_analytics_admin_only" ON public.scorm_analytics;
DROP POLICY IF EXISTS "scorm_rate_limits_admin_only" ON public.scorm_rate_limits;

-- SCORM Packages - Admin only for all operations
CREATE POLICY "scorm_packages_admin_only"
ON public.scorm_packages
FOR ALL
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- SCORM SCOs - Admin only for all operations  
CREATE POLICY "scorm_scos_admin_only"
ON public.scorm_scos
FOR ALL
TO authenticated  
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- SCORM Enrollments - Admin only for all operations
CREATE POLICY "scorm_enrollments_admin_only" 
ON public.scorm_enrollments
FOR ALL
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- SCORM Runtime - Admin only for all operations
CREATE POLICY "scorm_runtime_admin_only"
ON public.scorm_runtime  
FOR ALL
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- SCORM Analytics - Admin only for all operations
CREATE POLICY "scorm_analytics_admin_only"
ON public.scorm_analytics
FOR ALL  
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- SCORM Rate Limits - Admin only for all operations
CREATE POLICY "scorm_rate_limits_admin_only"
ON public.scorm_rate_limits
FOR ALL
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());