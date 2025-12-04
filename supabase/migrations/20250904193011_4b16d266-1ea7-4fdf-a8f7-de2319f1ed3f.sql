-- Enhanced organization invite system with link-based invitations
-- Update org_invitations table to support link-based invitations
ALTER TABLE public.org_invitations ADD COLUMN IF NOT EXISTS invitation_link TEXT UNIQUE;
ALTER TABLE public.org_invitations ADD COLUMN IF NOT EXISTS max_uses INTEGER DEFAULT 1;
ALTER TABLE public.org_invitations ADD COLUMN IF NOT EXISTS current_uses INTEGER DEFAULT 0;
ALTER TABLE public.org_invitations ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;

-- Add organization assignment tracking
CREATE TABLE IF NOT EXISTS public.org_course_assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE NOT NULL,
  course_id TEXT NOT NULL,
  assigned_by UUID NOT NULL,
  student_ids UUID[] NOT NULL DEFAULT '{}',
  due_date TIMESTAMPTZ,
  instructions TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Add RLS policies for course assignments
ALTER TABLE public.org_course_assignments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Organization owners can manage course assignments" 
ON public.org_course_assignments 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.organizations 
    WHERE id = organization_id AND owner_id = auth.uid()
  )
);

CREATE POLICY "Organization members can view course assignments" 
ON public.org_course_assignments 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.org_members 
    WHERE organization_id = org_course_assignments.organization_id 
    AND user_id = auth.uid() 
    AND status = 'active'
  )
);

CREATE POLICY "Admins can view all course assignments" 
ON public.org_course_assignments 
FOR SELECT 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Enhanced profiles table for role selection during signup
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS pending_role TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS signup_completed BOOLEAN DEFAULT false;

-- Organization membership tracking enhancements
ALTER TABLE public.org_members ADD COLUMN IF NOT EXISTS invitation_link TEXT;
ALTER TABLE public.org_members ADD COLUMN IF NOT EXISTS access_revoked_at TIMESTAMPTZ;
ALTER TABLE public.org_members ADD COLUMN IF NOT EXISTS access_revoked_reason TEXT;

-- Function to generate unique invitation links
CREATE OR REPLACE FUNCTION public.generate_invitation_link(org_id UUID)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
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