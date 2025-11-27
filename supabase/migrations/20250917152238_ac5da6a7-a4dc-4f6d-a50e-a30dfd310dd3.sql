-- CRITICAL SECURITY FIX: Properly secure contact_submissions table
-- This table contains customer emails and names - must be protected

-- First ensure RLS is enabled
ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;

-- Drop all existing policies to start fresh
DROP POLICY IF EXISTS "Anyone can create contact submissions" ON public.contact_submissions;
DROP POLICY IF EXISTS "Users can view their own contact submissions" ON public.contact_submissions;
DROP POLICY IF EXISTS "Admins can view all contact submissions" ON public.contact_submissions;
DROP POLICY IF EXISTS "Admins can update contact submissions" ON public.contact_submissions;
DROP POLICY IF EXISTS "Users can create contact submissions" ON public.contact_submissions;
DROP POLICY IF EXISTS "Users can view their own submissions" ON public.contact_submissions;
DROP POLICY IF EXISTS "Admins can view all submissions" ON public.contact_submissions;
DROP POLICY IF EXISTS "Admins can update submissions" ON public.contact_submissions;

-- Create secure policies that protect customer data
CREATE POLICY "Allow anonymous contact form submissions"
ON public.contact_submissions
FOR INSERT
WITH CHECK (true);

CREATE POLICY "Users can view only their own submissions"
ON public.contact_submissions
FOR SELECT
USING (
  auth.uid() IS NOT NULL 
  AND auth.uid() = user_id
);

CREATE POLICY "Admins can view all contact submissions"
ON public.contact_submissions
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update contact submission status"
ON public.contact_submissions
FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Add missing RLS policies for tables without policies
-- Fix curriculum_files table
ALTER TABLE public.curriculum_files ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view curriculum files"
ON public.curriculum_files
FOR SELECT
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Users can upload curriculum files"
ON public.curriculum_files
FOR INSERT
WITH CHECK (auth.uid() IS NOT NULL AND auth.uid() = uploaded_by);

CREATE POLICY "Users can update files they uploaded"
ON public.curriculum_files
FOR UPDATE
USING (auth.uid() = uploaded_by);

-- Fix curriculum_lessons table
ALTER TABLE public.curriculum_lessons ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view curriculum lessons"
ON public.curriculum_lessons
FOR SELECT
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Users can create curriculum lessons"
ON public.curriculum_lessons
FOR INSERT
WITH CHECK (auth.uid() IS NOT NULL AND auth.uid() = created_by);

CREATE POLICY "Users can update lessons they created"
ON public.curriculum_lessons
FOR UPDATE
USING (auth.uid() = created_by);