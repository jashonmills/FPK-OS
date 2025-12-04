-- Fix contact_submissions table security issue
-- Remove public access and add proper RLS policies

DROP POLICY IF EXISTS "Users can create contact submissions" ON public.contact_submissions;
DROP POLICY IF EXISTS "Users can view their own submissions" ON public.contact_submissions;
DROP POLICY IF EXISTS "Admins can view all submissions" ON public.contact_submissions;
DROP POLICY IF EXISTS "Admins can update submissions" ON public.contact_submissions;

-- Recreate with secure policies
CREATE POLICY "Anyone can create contact submissions"
ON public.contact_submissions
FOR INSERT
WITH CHECK (true);

CREATE POLICY "Users can view their own contact submissions"
ON public.contact_submissions
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all contact submissions"
ON public.contact_submissions
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update contact submissions"
ON public.contact_submissions
FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role));

-- Add missing RLS policies for course_progress table
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

CREATE POLICY "Organization members can view org course progress"
ON public.course_progress
FOR SELECT
USING (
  org_id IS NOT NULL 
  AND user_is_org_member_safe(org_id, auth.uid())
);

-- Add RLS policies for data_retention_policies (admin only)
CREATE POLICY "Only admins can manage retention policies"
ON public.data_retention_policies
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));