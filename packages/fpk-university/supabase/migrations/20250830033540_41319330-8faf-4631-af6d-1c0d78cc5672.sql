-- Fix the infinite recursion in scorm_packages RLS policy
-- Drop the problematic policy and create a proper one

DROP POLICY IF EXISTS "Users can view packages they created or that are public" ON public.scorm_packages;

-- Create a simple policy that allows authenticated users to view all ready packages
CREATE POLICY "Anyone can view ready packages" ON public.scorm_packages
FOR SELECT USING (status = 'ready' OR created_by = auth.uid());

-- Allow creators to manage their own packages
CREATE POLICY "Users can manage their own packages" ON public.scorm_packages
FOR ALL USING (created_by = auth.uid());