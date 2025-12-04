-- Fix infinite recursion in RLS policies for scorm_packages
-- First, drop existing problematic policies
DROP POLICY IF EXISTS "Creators can manage packages" ON scorm_packages;
DROP POLICY IF EXISTS "Public packages viewable by all" ON scorm_packages;
DROP POLICY IF EXISTS "Authenticated can view packages" ON scorm_packages;

-- Add proper RLS policies without circular references
CREATE POLICY "Anyone can view ready packages" 
ON scorm_packages 
FOR SELECT 
USING (status = 'ready' OR created_by = auth.uid());

CREATE POLICY "Users can create packages" 
ON scorm_packages 
FOR INSERT 
WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update own packages" 
ON scorm_packages 
FOR UPDATE 
USING (auth.uid() = created_by);

CREATE POLICY "Users can delete own packages" 
ON scorm_packages 
FOR DELETE 
USING (auth.uid() = created_by);

-- Fix any RLS issues with other SCORM tables
DROP POLICY IF EXISTS "Users can view enrollments" ON scorm_enrollments;
CREATE POLICY "Users can view all enrollments" 
ON scorm_enrollments 
FOR SELECT 
USING (true);

CREATE POLICY "Users can create enrollments" 
ON scorm_enrollments 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Fix SCORM runtime policies
DROP POLICY IF EXISTS "Users can view runtime data" ON scorm_runtime;
CREATE POLICY "Users can view all runtime data" 
ON scorm_runtime 
FOR SELECT 
USING (true);

CREATE POLICY "Users can create runtime data" 
ON scorm_runtime 
FOR INSERT 
WITH CHECK (EXISTS (
  SELECT 1 FROM scorm_enrollments e 
  WHERE e.id = enrollment_id AND e.user_id = auth.uid()
));

CREATE POLICY "Users can update runtime data" 
ON scorm_runtime 
FOR UPDATE 
USING (EXISTS (
  SELECT 1 FROM scorm_enrollments e 
  WHERE e.id = enrollment_id AND e.user_id = auth.uid()
));