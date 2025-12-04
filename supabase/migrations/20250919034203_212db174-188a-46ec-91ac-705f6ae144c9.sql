-- Fix RLS security issues for new tables

-- Enable RLS on new tables
ALTER TABLE public.org_course_imports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.org_course_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.org_course_assignments_new ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.xp_events_new ENABLE ROW LEVEL SECURITY;

-- RLS policies for org_course_imports
CREATE POLICY "Org members can view org imports" ON public.org_course_imports
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.org_members 
      WHERE org_members.org_id = org_course_imports.org_id 
      AND org_members.user_id = auth.uid() 
      AND org_members.status = 'active'
    )
  );

CREATE POLICY "Org instructors can create imports" ON public.org_course_imports
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.org_members 
      WHERE org_members.org_id = org_course_imports.org_id 
      AND org_members.user_id = auth.uid() 
      AND org_members.status = 'active'
      AND org_members.role IN ('owner', 'instructor')
    )
    AND created_by = auth.uid()
  );

CREATE POLICY "System can update imports" ON public.org_course_imports
  FOR UPDATE USING (true);

-- RLS policies for org_course_versions
CREATE POLICY "Org members can view course versions" ON public.org_course_versions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.org_courses oc
      JOIN public.org_members om ON om.org_id = oc.org_id
      WHERE oc.id = org_course_versions.org_course_id
      AND om.user_id = auth.uid()
      AND om.status = 'active'
    )
  );

CREATE POLICY "Org instructors can create versions" ON public.org_course_versions
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.org_courses oc
      JOIN public.org_members om ON om.org_id = oc.org_id
      WHERE oc.id = org_course_versions.org_course_id
      AND om.user_id = auth.uid()
      AND om.status = 'active'
      AND om.role IN ('owner', 'instructor')
    )
    AND created_by = auth.uid()
  );

-- RLS policies for org_course_assignments_new
CREATE POLICY "Org members can view assignments" ON public.org_course_assignments_new
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.org_members 
      WHERE org_members.org_id = org_course_assignments_new.org_id 
      AND org_members.user_id = auth.uid() 
      AND org_members.status = 'active'
    )
  );

CREATE POLICY "Org instructors can manage assignments" ON public.org_course_assignments_new
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.org_members 
      WHERE org_members.org_id = org_course_assignments_new.org_id 
      AND org_members.user_id = auth.uid() 
      AND org_members.status = 'active'
      AND org_members.role IN ('owner', 'instructor')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.org_members 
      WHERE org_members.org_id = org_course_assignments_new.org_id 
      AND org_members.user_id = auth.uid() 
      AND org_members.status = 'active'
      AND org_members.role IN ('owner', 'instructor')
    )
    AND created_by = auth.uid()
  );

-- RLS policies for xp_events_new
CREATE POLICY "Users can view their own XP events" ON public.xp_events_new
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can create their own XP events" ON public.xp_events_new
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Org members can view org XP events" ON public.xp_events_new
  FOR SELECT USING (
    scope = 'org' AND org_id IS NOT NULL AND
    EXISTS (
      SELECT 1 FROM public.org_members 
      WHERE org_members.org_id = xp_events_new.org_id 
      AND org_members.user_id = auth.uid() 
      AND org_members.status = 'active'
    )
  );

CREATE POLICY "System can create XP events" ON public.xp_events_new
  FOR INSERT WITH CHECK (true);

-- Admins can view everything
CREATE POLICY "Admins can view all imports" ON public.org_course_imports
  FOR SELECT USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can view all versions" ON public.org_course_versions
  FOR SELECT USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can view all assignments" ON public.org_course_assignments_new
  FOR SELECT USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can view all XP events" ON public.xp_events_new
  FOR SELECT USING (has_role(auth.uid(), 'admin'::app_role));