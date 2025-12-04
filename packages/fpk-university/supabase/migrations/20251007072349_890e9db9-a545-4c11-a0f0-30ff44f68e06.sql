-- Add org_id to analytics tables for organization-level tracking
-- This enables organization administrators to view their students' analytics

-- 1. Add org_id to interactive_course_enrollments
ALTER TABLE public.interactive_course_enrollments
ADD COLUMN org_id uuid REFERENCES public.organizations(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_interactive_course_enrollments_org_id 
ON public.interactive_course_enrollments(org_id);

-- 2. Add org_id to interactive_course_sessions
ALTER TABLE public.interactive_course_sessions
ADD COLUMN org_id uuid REFERENCES public.organizations(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_interactive_course_sessions_org_id 
ON public.interactive_course_sessions(org_id);

-- 3. Add org_id to interactive_lesson_analytics
ALTER TABLE public.interactive_lesson_analytics
ADD COLUMN org_id uuid REFERENCES public.organizations(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_interactive_lesson_analytics_org_id 
ON public.interactive_lesson_analytics(org_id);

-- 4. Enhance RLS policies for organization instructors to view their students' analytics

-- Drop existing policies to recreate them with org support
DROP POLICY IF EXISTS "Users can create their own enrollments" ON public.interactive_course_enrollments;
DROP POLICY IF EXISTS "Users can update their own enrollments" ON public.interactive_course_enrollments;
DROP POLICY IF EXISTS "Users can view their own enrollments" ON public.interactive_course_enrollments;

-- Recreate enrollment policies with org instructor access
CREATE POLICY "Users can create their own enrollments"
ON public.interactive_course_enrollments
FOR INSERT
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own enrollments"
ON public.interactive_course_enrollments
FOR UPDATE
USING (user_id = auth.uid());

CREATE POLICY "Users can view their own enrollments"
ON public.interactive_course_enrollments
FOR SELECT
USING (user_id = auth.uid());

CREATE POLICY "Org instructors can view their students enrollments"
ON public.interactive_course_enrollments
FOR SELECT
USING (
  org_id IS NOT NULL AND
  EXISTS (
    SELECT 1 FROM public.org_members om
    WHERE om.org_id = interactive_course_enrollments.org_id
    AND om.user_id = auth.uid()
    AND om.status = 'active'
    AND om.role IN ('owner', 'instructor')
  )
);

-- Enhance lesson analytics policies
DROP POLICY IF EXISTS "Users can create lesson analytics" ON public.interactive_lesson_analytics;
DROP POLICY IF EXISTS "Users can update lesson analytics" ON public.interactive_lesson_analytics;
DROP POLICY IF EXISTS "Users can view their own lesson analytics" ON public.interactive_lesson_analytics;

CREATE POLICY "Users can create lesson analytics"
ON public.interactive_lesson_analytics
FOR INSERT
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update lesson analytics"
ON public.interactive_lesson_analytics
FOR UPDATE
USING (user_id = auth.uid());

CREATE POLICY "Users can view their own lesson analytics"
ON public.interactive_lesson_analytics
FOR SELECT
USING (user_id = auth.uid());

CREATE POLICY "Org instructors can view their students lesson analytics"
ON public.interactive_lesson_analytics
FOR SELECT
USING (
  org_id IS NOT NULL AND
  EXISTS (
    SELECT 1 FROM public.org_members om
    WHERE om.org_id = interactive_lesson_analytics.org_id
    AND om.user_id = auth.uid()
    AND om.status = 'active'
    AND om.role IN ('owner', 'instructor')
  )
);

-- Enhance session analytics policies
DROP POLICY IF EXISTS "Users can create sessions" ON public.interactive_course_sessions;
DROP POLICY IF EXISTS "Users can update sessions" ON public.interactive_course_sessions;
DROP POLICY IF EXISTS "Users can view their own sessions" ON public.interactive_course_sessions;

CREATE POLICY "Users can create sessions"
ON public.interactive_course_sessions
FOR INSERT
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update sessions"
ON public.interactive_course_sessions
FOR UPDATE
USING (user_id = auth.uid());

CREATE POLICY "Users can view their own sessions"
ON public.interactive_course_sessions
FOR SELECT
USING (user_id = auth.uid());

CREATE POLICY "Org instructors can view their students sessions"
ON public.interactive_course_sessions
FOR SELECT
USING (
  org_id IS NOT NULL AND
  EXISTS (
    SELECT 1 FROM public.org_members om
    WHERE om.org_id = interactive_course_sessions.org_id
    AND om.user_id = auth.uid()
    AND om.status = 'active'
    AND om.role IN ('owner', 'instructor')
  )
);

-- 5. Backfill org_id for existing records where possible
-- This attempts to populate org_id for existing analytics records by matching user_id to org_members
UPDATE public.interactive_course_enrollments e
SET org_id = om.org_id
FROM public.org_members om
WHERE e.user_id = om.user_id
  AND om.status = 'active'
  AND e.org_id IS NULL;

UPDATE public.interactive_course_sessions s
SET org_id = om.org_id
FROM public.org_members om
WHERE s.user_id = om.user_id
  AND om.status = 'active'
  AND s.org_id IS NULL;

UPDATE public.interactive_lesson_analytics l
SET org_id = om.org_id
FROM public.org_members om
WHERE l.user_id = om.user_id
  AND om.status = 'active'
  AND l.org_id IS NULL;