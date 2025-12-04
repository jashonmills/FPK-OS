-- Create org_group_course_assignments table
CREATE TABLE IF NOT EXISTS public.org_group_course_assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id UUID NOT NULL REFERENCES public.org_groups(id) ON DELETE CASCADE,
  course_id TEXT NOT NULL,
  assigned_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  assigned_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  UNIQUE(group_id, course_id)
);

-- Enable RLS
ALTER TABLE public.org_group_course_assignments ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Org members can view group course assignments
CREATE POLICY "Org members can view group course assignments"
ON public.org_group_course_assignments
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.org_groups og
    JOIN public.org_members om ON om.org_id = og.org_id
    WHERE og.id = org_group_course_assignments.group_id
    AND om.user_id = auth.uid()
    AND om.status = 'active'
  )
);

-- RLS Policies: Org instructors can manage group course assignments
CREATE POLICY "Org instructors can insert group course assignments"
ON public.org_group_course_assignments
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.org_groups og
    JOIN public.org_members om ON om.org_id = og.org_id
    WHERE og.id = org_group_course_assignments.group_id
    AND om.user_id = auth.uid()
    AND om.role IN ('owner', 'instructor')
    AND om.status = 'active'
  )
);

CREATE POLICY "Org instructors can delete group course assignments"
ON public.org_group_course_assignments
FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM public.org_groups og
    JOIN public.org_members om ON om.org_id = og.org_id
    WHERE og.id = org_group_course_assignments.group_id
    AND om.user_id = auth.uid()
    AND om.role IN ('owner', 'instructor')
    AND om.status = 'active'
  )
);

-- Function to cascade course assignments to group members
CREATE OR REPLACE FUNCTION public.cascade_group_course_assignment()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    -- Assign course to all current group members
    INSERT INTO public.student_course_assignments (
      student_id,
      course_id,
      org_id,
      assigned_by,
      source_type,
      source_id
    )
    SELECT 
      ogm.user_id,
      NEW.course_id,
      og.org_id,
      NEW.assigned_by,
      'group',
      NEW.group_id
    FROM public.org_group_members ogm
    JOIN public.org_groups og ON og.id = ogm.group_id
    WHERE ogm.group_id = NEW.group_id
    ON CONFLICT (student_id, course_id, org_id) DO NOTHING;
    
  ELSIF TG_OP = 'DELETE' THEN
    -- Remove course assignments that came from this group
    DELETE FROM public.student_course_assignments
    WHERE course_id = OLD.course_id
    AND source_type = 'group'
    AND source_id = OLD.group_id;
  END IF;
  
  RETURN COALESCE(NEW, OLD);
END;
$$;

-- Trigger for cascading group course assignments
CREATE TRIGGER trigger_cascade_group_course_assignment
AFTER INSERT OR DELETE ON public.org_group_course_assignments
FOR EACH ROW
EXECUTE FUNCTION public.cascade_group_course_assignment();

-- Function to assign group courses to new members
CREATE OR REPLACE FUNCTION public.assign_group_courses_to_new_member()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    -- Assign all group courses to the new member
    INSERT INTO public.student_course_assignments (
      student_id,
      course_id,
      org_id,
      assigned_by,
      source_type,
      source_id
    )
    SELECT 
      NEW.user_id,
      ogca.course_id,
      og.org_id,
      ogca.assigned_by,
      'group',
      NEW.group_id
    FROM public.org_group_course_assignments ogca
    JOIN public.org_groups og ON og.id = ogca.group_id
    WHERE ogca.group_id = NEW.group_id
    ON CONFLICT (student_id, course_id, org_id) DO NOTHING;
  END IF;
  
  RETURN NEW;
END;
$$;

-- Trigger for assigning group courses to new members
CREATE TRIGGER trigger_assign_group_courses_to_new_member
AFTER INSERT ON public.org_group_members
FOR EACH ROW
EXECUTE FUNCTION public.assign_group_courses_to_new_member();

-- Add source tracking columns to student_course_assignments if they don't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'student_course_assignments' 
    AND column_name = 'source_type'
  ) THEN
    ALTER TABLE public.student_course_assignments 
    ADD COLUMN source_type TEXT DEFAULT 'direct',
    ADD COLUMN source_id UUID;
  END IF;
END $$;