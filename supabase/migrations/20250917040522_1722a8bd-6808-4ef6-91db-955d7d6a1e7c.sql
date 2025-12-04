-- Add RLS policies for interactive_lesson_analytics table
ALTER TABLE public.interactive_lesson_analytics ENABLE ROW LEVEL SECURITY;

-- Users can view their own lesson analytics
CREATE POLICY "Users can view their own lesson analytics"
ON public.interactive_lesson_analytics
FOR SELECT
USING (user_id = auth.uid());

-- Users can insert their own lesson analytics
CREATE POLICY "Users can insert their own lesson analytics"
ON public.interactive_lesson_analytics
FOR INSERT
WITH CHECK (user_id = auth.uid());

-- Users can update their own lesson analytics
CREATE POLICY "Users can update their own lesson analytics"
ON public.interactive_lesson_analytics
FOR UPDATE
USING (user_id = auth.uid());

-- Admins can view all lesson analytics
CREATE POLICY "Admins can view all lesson analytics"
ON public.interactive_lesson_analytics
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

-- Organization leaders can view analytics for their org members
CREATE POLICY "Organization leaders can view org analytics"
ON public.interactive_lesson_analytics
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM org_members om
    WHERE om.user_id = auth.uid()
    AND om.status = 'active'
    AND om.role IN ('owner', 'instructor')
  )
);