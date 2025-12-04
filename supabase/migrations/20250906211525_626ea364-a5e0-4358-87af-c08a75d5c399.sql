-- Add organization support to courses tables
ALTER TABLE public.courses 
ADD COLUMN organization_id uuid REFERENCES public.organizations(id),
ADD COLUMN course_visibility text DEFAULT 'global' CHECK (course_visibility IN ('global', 'organization_only', 'private'));

ALTER TABLE public.native_courses 
ADD COLUMN organization_id uuid REFERENCES public.organizations(id),
ADD COLUMN course_visibility text DEFAULT 'global' CHECK (course_visibility IN ('global', 'organization_only', 'private'));

-- Create organization course assignments table
CREATE TABLE public.organization_course_assignments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid REFERENCES public.organizations(id) NOT NULL,
  course_id text REFERENCES public.courses(id) NOT NULL,
  native_course_id uuid REFERENCES public.native_courses(id),
  assigned_by uuid REFERENCES auth.users(id) NOT NULL,
  assigned_at timestamp with time zone DEFAULT now() NOT NULL,
  is_active boolean DEFAULT true NOT NULL,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  UNIQUE(organization_id, course_id),
  UNIQUE(organization_id, native_course_id),
  CHECK ((course_id IS NOT NULL AND native_course_id IS NULL) OR (course_id IS NULL AND native_course_id IS NOT NULL))
);

-- Enable RLS on organization_course_assignments
ALTER TABLE public.organization_course_assignments ENABLE ROW LEVEL SECURITY;

-- RLS policies for organization_course_assignments
CREATE POLICY "Organization members can view assignments" ON public.organization_course_assignments
FOR SELECT USING (
  user_is_org_member(organization_id) OR 
  user_is_org_owner(organization_id) OR 
  has_role(auth.uid(), 'admin'::app_role)
);

CREATE POLICY "Organization owners and instructors can manage assignments" ON public.organization_course_assignments
FOR ALL USING (
  (user_is_org_owner(organization_id) OR 
   (user_is_org_member(organization_id) AND user_org_role(organization_id) = 'instructor')) OR
  has_role(auth.uid(), 'admin'::app_role)
);

-- Update courses RLS policies for organization visibility
DROP POLICY IF EXISTS "Anyone can view courses" ON public.courses;
CREATE POLICY "Users can view accessible courses" ON public.courses
FOR SELECT USING (
  course_visibility = 'global' OR
  (course_visibility = 'organization_only' AND organization_id IS NOT NULL AND user_is_org_member(organization_id)) OR
  (course_visibility = 'private' AND created_by = auth.uid()) OR
  has_role(auth.uid(), 'admin'::app_role)
);

-- Update native_courses RLS policies for organization visibility  
DROP POLICY IF EXISTS "Anyone can view published native courses" ON public.native_courses;
CREATE POLICY "Users can view accessible native courses" ON public.native_courses
FOR SELECT USING (
  (visibility = 'published' AND (course_visibility = 'global' OR course_visibility IS NULL)) OR
  (visibility = 'published' AND course_visibility = 'organization_only' AND organization_id IS NOT NULL AND user_is_org_member(organization_id)) OR
  (visibility = 'published' AND course_visibility = 'private' AND created_by = auth.uid()) OR
  (created_by = auth.uid()) OR
  has_role(auth.uid(), 'admin'::app_role)
);