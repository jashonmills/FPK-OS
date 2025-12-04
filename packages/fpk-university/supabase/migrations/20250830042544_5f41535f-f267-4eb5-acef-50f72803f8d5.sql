-- Fix RLS policies for all SCORM tables to prevent recursion and allow proper data insertion

-- Remove existing policies on scorm_scos
DROP POLICY IF EXISTS "Users can create scos for their packages" ON scorm_scos;
DROP POLICY IF EXISTS "Users can view scos from accessible packages" ON scorm_scos;
DROP POLICY IF EXISTS "Users can update scos for their packages" ON scorm_scos;
DROP POLICY IF EXISTS "Users can delete scos for their packages" ON scorm_scos;
DROP POLICY IF EXISTS "scorm_scos_all_admin" ON scorm_scos;
DROP POLICY IF EXISTS "scorm_scos_insert" ON scorm_scos;
DROP POLICY IF EXISTS "scorm_scos_select" ON scorm_scos;
DROP POLICY IF EXISTS "scorm_scos_update" ON scorm_scos;
DROP POLICY IF EXISTS "scorm_scos_delete" ON scorm_scos;

-- Remove existing policies on scorm_runtime
DROP POLICY IF EXISTS "Users can manage runtime for their enrollments" ON scorm_runtime;
DROP POLICY IF EXISTS "scorm_runtime_all_admin" ON scorm_runtime;
DROP POLICY IF EXISTS "scorm_runtime_insert" ON scorm_runtime;
DROP POLICY IF EXISTS "scorm_runtime_select" ON scorm_runtime;
DROP POLICY IF EXISTS "scorm_runtime_update" ON scorm_runtime;
DROP POLICY IF EXISTS "scorm_runtime_delete" ON scorm_runtime;

-- Remove existing policies on scorm_analytics  
DROP POLICY IF EXISTS "Users can view analytics for their packages" ON scorm_analytics;
DROP POLICY IF EXISTS "scorm_analytics_all_admin" ON scorm_analytics;
DROP POLICY IF EXISTS "scorm_analytics_insert" ON scorm_analytics;
DROP POLICY IF EXISTS "scorm_analytics_select" ON scorm_analytics;
DROP POLICY IF EXISTS "scorm_analytics_update" ON scorm_analytics;
DROP POLICY IF EXISTS "scorm_analytics_delete" ON scorm_analytics;

-- Create simple policies for scorm_scos
CREATE POLICY "scos_insert_system" ON public.scorm_scos
FOR INSERT WITH CHECK (true); -- Allow system/parser to insert

CREATE POLICY "scos_select_package_access" ON public.scorm_scos  
FOR SELECT USING (
  package_id IN (
    SELECT id FROM scorm_packages 
    WHERE created_by = auth.uid() OR is_public = true OR status = 'ready'
  )
);

CREATE POLICY "scos_update_package_owner" ON public.scorm_scos
FOR UPDATE USING (
  package_id IN (
    SELECT id FROM scorm_packages WHERE created_by = auth.uid()
  )
);

CREATE POLICY "scos_delete_package_owner" ON public.scorm_scos  
FOR DELETE USING (
  package_id IN (
    SELECT id FROM scorm_packages WHERE created_by = auth.uid()
  )
);

CREATE POLICY "scos_admin_all" ON public.scorm_scos
FOR ALL USING (current_user_has_admin_role());

-- Create simple policies for scorm_runtime
CREATE POLICY "runtime_insert_own_enrollment" ON public.scorm_runtime
FOR INSERT WITH CHECK (
  enrollment_id IN (
    SELECT id FROM scorm_enrollments WHERE user_id = auth.uid()
  )
);

CREATE POLICY "runtime_select_own_enrollment" ON public.scorm_runtime
FOR SELECT USING (
  enrollment_id IN (
    SELECT id FROM scorm_enrollments WHERE user_id = auth.uid()
  )
);

CREATE POLICY "runtime_update_own_enrollment" ON public.scorm_runtime
FOR UPDATE USING (
  enrollment_id IN (
    SELECT id FROM scorm_enrollments WHERE user_id = auth.uid()
  )
);

CREATE POLICY "runtime_admin_all" ON public.scorm_runtime
FOR ALL USING (current_user_has_admin_role());

-- Create simple policies for scorm_analytics
CREATE POLICY "analytics_insert_system" ON public.scorm_analytics
FOR INSERT WITH CHECK (true); -- Allow system to insert analytics

CREATE POLICY "analytics_select_own" ON public.scorm_analytics
FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "analytics_admin_all" ON public.scorm_analytics
FOR ALL USING (current_user_has_admin_role());