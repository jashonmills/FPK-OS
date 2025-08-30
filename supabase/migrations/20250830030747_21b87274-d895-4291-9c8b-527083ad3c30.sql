-- Fix infinite recursion in scorm_packages RLS policies
DROP POLICY IF EXISTS "Authenticated users can view packages" ON public.scorm_packages;
DROP POLICY IF EXISTS "Package creators can manage their packages" ON public.scorm_packages;
DROP POLICY IF EXISTS "Public packages are viewable by everyone" ON public.scorm_packages;
DROP POLICY IF EXISTS "Admins can manage all packages" ON public.scorm_packages;

-- Create proper RLS policies without recursion
CREATE POLICY "Users can view public packages" 
ON public.scorm_packages FOR SELECT 
USING (is_public = true OR created_by = auth.uid());

CREATE POLICY "Users can create packages" 
ON public.scorm_packages FOR INSERT 
WITH CHECK (created_by = auth.uid());

CREATE POLICY "Users can update their own packages" 
ON public.scorm_packages FOR UPDATE 
USING (created_by = auth.uid());

CREATE POLICY "Users can delete their own packages" 
ON public.scorm_packages FOR DELETE 
USING (created_by = auth.uid());

-- Fix other SCORM table policies
CREATE POLICY "Users can view SCOs of accessible packages" 
ON public.scorm_scos FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM public.scorm_packages p 
  WHERE p.id = scorm_scos.package_id 
  AND (p.is_public = true OR p.created_by = auth.uid())
));

CREATE POLICY "Package owners can manage SCOs" 
ON public.scorm_scos FOR ALL 
USING (EXISTS (
  SELECT 1 FROM public.scorm_packages p 
  WHERE p.id = scorm_scos.package_id 
  AND p.created_by = auth.uid()
));

-- Fix enrollment policies
CREATE POLICY "Users can view enrollments of accessible packages" 
ON public.scorm_enrollments FOR SELECT 
USING (user_id = auth.uid() OR EXISTS (
  SELECT 1 FROM public.scorm_packages p 
  WHERE p.id = scorm_enrollments.package_id 
  AND p.created_by = auth.uid()
));

CREATE POLICY "Users can create their own enrollments" 
ON public.scorm_enrollments FOR INSERT 
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own enrollments" 
ON public.scorm_enrollments FOR UPDATE 
USING (user_id = auth.uid());

-- Fix runtime policies
CREATE POLICY "Users can view their own runtime data" 
ON public.scorm_runtime FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM public.scorm_enrollments e 
  WHERE e.id = scorm_runtime.enrollment_id 
  AND e.user_id = auth.uid()
));

CREATE POLICY "Users can update their own runtime data" 
ON public.scorm_runtime FOR ALL 
USING (EXISTS (
  SELECT 1 FROM public.scorm_enrollments e 
  WHERE e.id = scorm_runtime.enrollment_id 
  AND e.user_id = auth.uid()
));

-- Analytics policies
CREATE POLICY "Users can view their own analytics" 
ON public.scorm_analytics FOR SELECT 
USING (user_id = auth.uid());

CREATE POLICY "System can create analytics" 
ON public.scorm_analytics FOR INSERT 
WITH CHECK (user_id = auth.uid());