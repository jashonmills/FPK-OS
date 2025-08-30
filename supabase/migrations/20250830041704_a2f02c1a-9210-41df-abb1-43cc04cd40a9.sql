-- First, let's check what RLS policies exist on scorm_packages and scorm_enrollments
-- and fix the infinite recursion issue

-- Drop existing problematic policies on scorm_packages
DROP POLICY IF EXISTS "Users can view packages they created" ON scorm_packages;
DROP POLICY IF EXISTS "Users can update packages they created" ON scorm_packages; 
DROP POLICY IF EXISTS "Users can delete packages they created" ON scorm_packages;
DROP POLICY IF EXISTS "Admins can view all packages" ON scorm_packages;
DROP POLICY IF EXISTS "Users can view public packages" ON scorm_packages;

-- Drop existing problematic policies on scorm_enrollments  
DROP POLICY IF EXISTS "Users can view their enrollments" ON scorm_enrollments;
DROP POLICY IF EXISTS "Users can create enrollments" ON scorm_enrollments;
DROP POLICY IF EXISTS "Users can update their enrollments" ON scorm_enrollments;
DROP POLICY IF EXISTS "Admins can view all enrollments" ON scorm_enrollments;

-- Create security definer function to check user role safely
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

-- Create new safe RLS policies for scorm_packages
CREATE POLICY "Users can view packages they created" ON public.scorm_packages
FOR SELECT USING (created_by = auth.uid());

CREATE POLICY "Users can update packages they created" ON public.scorm_packages  
FOR UPDATE USING (created_by = auth.uid());

CREATE POLICY "Users can delete packages they created" ON public.scorm_packages
FOR DELETE USING (created_by = auth.uid());

CREATE POLICY "Users can create packages" ON public.scorm_packages
FOR INSERT WITH CHECK (created_by = auth.uid());

CREATE POLICY "Admins can view all packages" ON public.scorm_packages
FOR SELECT USING (current_user_has_admin_role());

CREATE POLICY "Admins can manage all packages" ON public.scorm_packages
FOR ALL USING (current_user_has_admin_role());

CREATE POLICY "Users can view public packages" ON public.scorm_packages
FOR SELECT USING (is_public = true);

-- Create new safe RLS policies for scorm_enrollments
CREATE POLICY "Users can view their enrollments" ON public.scorm_enrollments
FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can create their enrollments" ON public.scorm_enrollments
FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their enrollments" ON public.scorm_enrollments
FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Admins can view all enrollments" ON public.scorm_enrollments
FOR SELECT USING (current_user_has_admin_role());

CREATE POLICY "Admins can manage all enrollments" ON public.scorm_enrollments  
FOR ALL USING (current_user_has_admin_role());