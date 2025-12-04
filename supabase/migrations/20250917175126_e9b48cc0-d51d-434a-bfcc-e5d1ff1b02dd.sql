-- Phase 1: Critical Security Fixes - Add RLS for Existing Tables Only

-- Enable RLS on existing tables that need it
ALTER TABLE public.slide_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.interactive_lesson_analytics ENABLE ROW LEVEL SECURITY;

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