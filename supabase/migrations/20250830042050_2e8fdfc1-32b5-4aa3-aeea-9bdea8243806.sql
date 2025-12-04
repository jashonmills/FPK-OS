-- Remove ALL existing policies that could cause recursion
DROP POLICY IF EXISTS "Anyone can view ready packages" ON scorm_packages;
DROP POLICY IF EXISTS "Users can delete their own packages" ON scorm_packages;
DROP POLICY IF EXISTS "Users can manage their own packages" ON scorm_packages;
DROP POLICY IF EXISTS "Users can update their own packages" ON scorm_packages;
DROP POLICY IF EXISTS "scorm_packages_all_admin" ON scorm_packages;
DROP POLICY IF EXISTS "scorm_packages_delete" ON scorm_packages;
DROP POLICY IF EXISTS "scorm_packages_delete_own" ON scorm_packages;
DROP POLICY IF EXISTS "scorm_packages_insert" ON scorm_packages;
DROP POLICY IF EXISTS "scorm_packages_insert_own" ON scorm_packages;
DROP POLICY IF EXISTS "scorm_packages_select" ON scorm_packages;
DROP POLICY IF EXISTS "scorm_packages_select_admin" ON scorm_packages;
DROP POLICY IF EXISTS "scorm_packages_select_own" ON scorm_packages;
DROP POLICY IF EXISTS "scorm_packages_select_public" ON scorm_packages;
DROP POLICY IF EXISTS "scorm_packages_update" ON scorm_packages;
DROP POLICY IF EXISTS "scorm_packages_update_own" ON scorm_packages;

DROP POLICY IF EXISTS "Users can create their own enrollments" ON scorm_enrollments;
DROP POLICY IF EXISTS "Users can update their own enrollments" ON scorm_enrollments;
DROP POLICY IF EXISTS "Users can view enrollments of accessible packages" ON scorm_enrollments;
DROP POLICY IF EXISTS "scorm_enrollments_all_admin" ON scorm_enrollments;
DROP POLICY IF EXISTS "scorm_enrollments_insert" ON scorm_enrollments;
DROP POLICY IF EXISTS "scorm_enrollments_insert_own" ON scorm_enrollments;
DROP POLICY IF EXISTS "scorm_enrollments_select" ON scorm_enrollments;
DROP POLICY IF EXISTS "scorm_enrollments_select_admin" ON scorm_enrollments;
DROP POLICY IF EXISTS "scorm_enrollments_select_own" ON scorm_enrollments;
DROP POLICY IF EXISTS "scorm_enrollments_update" ON scorm_enrollments;
DROP POLICY IF EXISTS "scorm_enrollments_update_own" ON scorm_enrollments;

-- Create simple, non-recursive policies for scorm_packages
CREATE POLICY "packages_insert_own" ON public.scorm_packages
FOR INSERT WITH CHECK (created_by = auth.uid());

CREATE POLICY "packages_select_own" ON public.scorm_packages  
FOR SELECT USING (created_by = auth.uid());

CREATE POLICY "packages_select_public" ON public.scorm_packages
FOR SELECT USING (is_public = true);

CREATE POLICY "packages_select_ready" ON public.scorm_packages
FOR SELECT USING (status = 'ready');

CREATE POLICY "packages_update_own" ON public.scorm_packages
FOR UPDATE USING (created_by = auth.uid());

CREATE POLICY "packages_delete_own" ON public.scorm_packages  
FOR DELETE USING (created_by = auth.uid());

CREATE POLICY "packages_admin_all" ON public.scorm_packages
FOR ALL USING (current_user_has_admin_role());

-- Create simple, non-recursive policies for scorm_enrollments  
CREATE POLICY "enrollments_insert_own" ON public.scorm_enrollments
FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "enrollments_select_own" ON public.scorm_enrollments
FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "enrollments_update_own" ON public.scorm_enrollments
FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "enrollments_delete_own" ON public.scorm_enrollments
FOR DELETE USING (user_id = auth.uid());

CREATE POLICY "enrollments_admin_all" ON public.scorm_enrollments
FOR ALL USING (current_user_has_admin_role());