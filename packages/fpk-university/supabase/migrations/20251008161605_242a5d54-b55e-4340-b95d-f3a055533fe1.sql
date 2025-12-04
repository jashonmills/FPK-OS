-- Fix RLS policy for org_goals to allow students to create their own goals

-- Drop existing insert policy
DROP POLICY IF EXISTS "org_goals_insert" ON public.org_goals;

-- Create new insert policy that allows:
-- 1. Instructors/owners to create goals for any student in their org
-- 2. Students to create goals for themselves
CREATE POLICY "org_goals_insert" ON public.org_goals
  FOR INSERT WITH CHECK (
    -- Allow instructors/owners to create goals
    EXISTS(
      SELECT 1 FROM public.org_members m 
      WHERE m.org_id = org_goals.organization_id 
      AND m.user_id = auth.uid() 
      AND m.role IN ('owner','instructor')
      AND m.status = 'active'
    )
    OR
    -- Allow students to create goals for themselves
    EXISTS(
      SELECT 1 FROM public.org_students s
      WHERE s.id = org_goals.student_id
      AND s.linked_user_id = auth.uid()
    )
  );