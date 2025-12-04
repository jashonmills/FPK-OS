-- Phase 1: Critical Security Fixes - Add Missing RLS Policies

-- Enable RLS on tables that are missing it
ALTER TABLE public.modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.learning_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assessment_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.learning_objectives ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.slide_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.interactive_lesson_analytics ENABLE ROW LEVEL SECURITY;

-- Add comprehensive RLS policies for modules
CREATE POLICY "Users can view published modules" 
ON public.modules 
FOR SELECT 
USING (is_published = true);

CREATE POLICY "Admins can manage all modules" 
ON public.modules 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Course creators can manage their modules" 
ON public.modules 
FOR ALL 
USING (created_by = auth.uid());

-- Add RLS policies for lessons
CREATE POLICY "Users can view lessons from published modules" 
ON public.lessons 
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM public.modules 
  WHERE modules.id = lessons.module_id 
  AND modules.is_published = true
));

CREATE POLICY "Admins can manage all lessons" 
ON public.lessons 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Instructors can manage their lessons" 
ON public.lessons 
FOR ALL 
USING (instructor_id = auth.uid());

-- Add RLS policies for learning_attempts
CREATE POLICY "Users can view their own learning attempts" 
ON public.learning_attempts 
FOR SELECT 
USING (user_id = auth.uid());

CREATE POLICY "Users can create their own learning attempts" 
ON public.learning_attempts 
FOR INSERT 
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own learning attempts" 
ON public.learning_attempts 
FOR UPDATE 
USING (user_id = auth.uid());

CREATE POLICY "Admins can view all learning attempts" 
ON public.learning_attempts 
FOR SELECT 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Add RLS policies for assessment_items
CREATE POLICY "Users can view assessment items for published content" 
ON public.assessment_items 
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM public.lessons l
  JOIN public.modules m ON m.id = l.module_id
  WHERE l.id = assessment_items.lesson_id 
  AND m.is_published = true
));

CREATE POLICY "Admins can manage all assessment items" 
ON public.assessment_items 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Instructors can manage their assessment items" 
ON public.assessment_items 
FOR ALL 
USING (EXISTS (
  SELECT 1 FROM public.lessons 
  WHERE lessons.id = assessment_items.lesson_id 
  AND lessons.instructor_id = auth.uid()
));

-- Add RLS policies for learning_objectives
CREATE POLICY "Users can view learning objectives for published content" 
ON public.learning_objectives 
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM public.lessons l
  JOIN public.modules m ON m.id = l.module_id
  WHERE l.id = learning_objectives.lesson_id 
  AND m.is_published = true
));

CREATE POLICY "Admins can manage all learning objectives" 
ON public.learning_objectives 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Add RLS policies for slide_analytics
CREATE POLICY "Users can view their own slide analytics" 
ON public.slide_analytics 
FOR SELECT 
USING (user_id = auth.uid());

CREATE POLICY "Users can create their own slide analytics" 
ON public.slide_analytics 
FOR INSERT 
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Admins can view all slide analytics" 
ON public.slide_analytics 
FOR SELECT 
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Organization leaders can view org slide analytics" 
ON public.slide_analytics 
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM public.org_members om
  WHERE om.user_id = auth.uid() 
  AND om.status = 'active' 
  AND om.role IN ('owner', 'instructor')
));

-- Add RLS policies for interactive_lesson_analytics
CREATE POLICY "Users can view their own lesson analytics" 
ON public.interactive_lesson_analytics 
FOR SELECT 
USING (user_id = auth.uid());

CREATE POLICY "Users can create their own lesson analytics" 
ON public.interactive_lesson_analytics 
FOR INSERT 
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own lesson analytics" 
ON public.interactive_lesson_analytics 
FOR UPDATE 
USING (user_id = auth.uid());

CREATE POLICY "Admins can view all lesson analytics" 
ON public.interactive_lesson_analytics 
FOR SELECT 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Fix security definer function vulnerabilities
CREATE OR REPLACE FUNCTION public.user_is_org_owner(org_id uuid)
RETURNS boolean
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Direct check without exposing data
  RETURN EXISTS (
    SELECT 1 FROM public.organizations 
    WHERE id = org_id AND owner_id = auth.uid()
  );
END;
$$;

-- Create secure function for user role checking
CREATE OR REPLACE FUNCTION public.get_user_role()
RETURNS text
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  user_role text;
BEGIN
  SELECT role::text INTO user_role 
  FROM public.user_roles 
  WHERE user_id = auth.uid() 
  LIMIT 1;
  
  RETURN COALESCE(user_role, 'learner');
END;
$$;