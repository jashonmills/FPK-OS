-- Update RLS policy to allow auto-enrollment for EL Spelling & Reading course
DROP POLICY IF EXISTS "Users can auto-enroll in Learning State beta" ON public.enrollments;

CREATE POLICY "Users can auto-enroll in preloaded courses" ON public.enrollments
FOR INSERT
WITH CHECK (
  auth.uid() = user_id AND 
  course_id IN ('learning-state-beta', 'el-spelling-reading')
);