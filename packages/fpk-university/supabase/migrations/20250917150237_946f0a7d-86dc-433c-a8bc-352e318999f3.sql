-- Fix RLS policies for tables with missing policies

-- Add RLS policy for course_progress table
CREATE POLICY "Users can view their own course progress" 
ON public.course_progress 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own course progress" 
ON public.course_progress 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own course progress" 
ON public.course_progress 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Add RLS policy for data_retention_policies (admin only)
CREATE POLICY "Only admins can manage retention policies" 
ON public.data_retention_policies 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role));