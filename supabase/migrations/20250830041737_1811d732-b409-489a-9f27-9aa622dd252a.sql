-- First, create the security definer function if it doesn't exist
CREATE OR REPLACE FUNCTION public.current_user_has_admin_role()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() 
    AND role::text IN ('admin', 'instructor')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Drop all existing policies that might be causing recursion and recreate them properly
DO $$
BEGIN
  -- Drop scorm_packages policies
  DROP POLICY IF EXISTS "Users can view packages they created" ON scorm_packages;
  DROP POLICY IF EXISTS "Users can update packages they created" ON scorm_packages; 
  DROP POLICY IF EXISTS "Users can delete packages they created" ON scorm_packages;
  DROP POLICY IF EXISTS "Users can create packages" ON scorm_packages;
  DROP POLICY IF EXISTS "Admins can view all packages" ON scorm_packages;
  DROP POLICY IF EXISTS "Admins can manage all packages" ON scorm_packages;
  DROP POLICY IF EXISTS "Users can view public packages" ON scorm_packages;
  
  -- Drop scorm_enrollments policies
  DROP POLICY IF EXISTS "Users can view their enrollments" ON scorm_enrollments;
  DROP POLICY IF EXISTS "Users can create their enrollments" ON scorm_enrollments;
  DROP POLICY IF EXISTS "Users can update their enrollments" ON scorm_enrollments;
  DROP POLICY IF EXISTS "Admins can view all enrollments" ON scorm_enrollments;
  DROP POLICY IF EXISTS "Admins can manage all enrollments" ON scorm_enrollments;
END
$$;

-- Create new safe RLS policies for scorm_packages
CREATE POLICY "scorm_packages_select_own" ON public.scorm_packages
FOR SELECT USING (created_by = auth.uid());

CREATE POLICY "scorm_packages_update_own" ON public.scorm_packages  
FOR UPDATE USING (created_by = auth.uid());

CREATE POLICY "scorm_packages_delete_own" ON public.scorm_packages
FOR DELETE USING (created_by = auth.uid());

CREATE POLICY "scorm_packages_insert_own" ON public.scorm_packages
FOR INSERT WITH CHECK (created_by = auth.uid());

CREATE POLICY "scorm_packages_select_admin" ON public.scorm_packages
FOR SELECT USING (current_user_has_admin_role());

CREATE POLICY "scorm_packages_all_admin" ON public.scorm_packages
FOR ALL USING (current_user_has_admin_role());

CREATE POLICY "scorm_packages_select_public" ON public.scorm_packages
FOR SELECT USING (is_public = true);

-- Create new safe RLS policies for scorm_enrollments
CREATE POLICY "scorm_enrollments_select_own" ON public.scorm_enrollments
FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "scorm_enrollments_insert_own" ON public.scorm_enrollments
FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "scorm_enrollments_update_own" ON public.scorm_enrollments
FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "scorm_enrollments_select_admin" ON public.scorm_enrollments
FOR SELECT USING (current_user_has_admin_role());

CREATE POLICY "scorm_enrollments_all_admin" ON public.scorm_enrollments  
FOR ALL USING (current_user_has_admin_role());