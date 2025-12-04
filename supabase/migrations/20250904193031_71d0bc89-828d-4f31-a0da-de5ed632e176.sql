-- Fix RLS policy for org_course_assignments table that was missing
-- Add missing policies for org_course_assignments
CREATE POLICY "System can insert course assignments" 
ON public.org_course_assignments 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "System can update course assignments" 
ON public.org_course_assignments 
FOR UPDATE 
USING (true);

-- Update the search path for the generate_invitation_link function to fix security warning
CREATE OR REPLACE FUNCTION public.generate_invitation_link(org_id UUID)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  link_code TEXT;
  full_link TEXT;
BEGIN
  -- Generate a unique code
  link_code := encode(gen_random_bytes(16), 'hex');
  full_link := 'org-invite-' || link_code;
  
  -- Ensure uniqueness
  WHILE EXISTS (SELECT 1 FROM public.org_invitations WHERE invitation_link = full_link) LOOP
    link_code := encode(gen_random_bytes(16), 'hex');
    full_link := 'org-invite-' || link_code;
  END LOOP;
  
  RETURN full_link;
END;
$$;