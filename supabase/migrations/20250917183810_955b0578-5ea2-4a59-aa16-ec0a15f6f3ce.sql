-- Step 1 Complete: Add RLS policies for the remaining 5 tables

-- RLS policies for incident_response_actions
CREATE POLICY "Admins can manage incident response actions"
ON public.incident_response_actions
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- RLS policies for org_goal_targets  
CREATE POLICY "Org members can view org goal targets"
ON public.org_goal_targets
FOR SELECT
USING (EXISTS (
  SELECT 1 FROM public.org_members om
  WHERE om.org_id = org_goal_targets.org_id
  AND om.user_id = auth.uid()
  AND om.status = 'active'
));

CREATE POLICY "Org leaders can manage org goal targets"
ON public.org_goal_targets
FOR ALL
USING (EXISTS (
  SELECT 1 FROM public.org_members om
  WHERE om.org_id = org_goal_targets.org_id
  AND om.user_id = auth.uid()
  AND om.role IN ('owner', 'instructor')
  AND om.status = 'active'
))
WITH CHECK (EXISTS (
  SELECT 1 FROM public.org_members om
  WHERE om.org_id = org_goal_targets.org_id
  AND om.user_id = auth.uid()
  AND om.role IN ('owner', 'instructor')
  AND om.status = 'active'
));

-- RLS policies for org_note_folders
CREATE POLICY "Org members can view org note folders"
ON public.org_note_folders
FOR SELECT
USING (EXISTS (
  SELECT 1 FROM public.org_members om
  WHERE om.org_id = org_note_folders.org_id
  AND om.user_id = auth.uid()
  AND om.status = 'active'
));

CREATE POLICY "Org leaders can manage org note folders"
ON public.org_note_folders
FOR ALL
USING (EXISTS (
  SELECT 1 FROM public.org_members om
  WHERE om.org_id = org_note_folders.org_id
  AND om.user_id = auth.uid()
  AND om.role IN ('owner', 'instructor')
  AND om.status = 'active'
))
WITH CHECK (EXISTS (
  SELECT 1 FROM public.org_members om
  WHERE om.org_id = org_note_folders.org_id
  AND om.user_id = auth.uid()
  AND om.role IN ('owner', 'instructor')
  AND om.status = 'active'
));

-- RLS policies for org_note_targets
CREATE POLICY "Org members can view org note targets"
ON public.org_note_targets
FOR SELECT
USING (EXISTS (
  SELECT 1 FROM public.org_members om
  WHERE om.org_id = org_note_targets.org_id
  AND om.user_id = auth.uid()
  AND om.status = 'active'
));

CREATE POLICY "Org leaders can manage org note targets"
ON public.org_note_targets
FOR ALL
USING (EXISTS (
  SELECT 1 FROM public.org_members om
  WHERE om.org_id = org_note_targets.org_id
  AND om.user_id = auth.uid()
  AND om.role IN ('owner', 'instructor')
  AND om.status = 'active'
))
WITH CHECK (EXISTS (
  SELECT 1 FROM public.org_members om
  WHERE om.org_id = org_note_targets.org_id
  AND om.user_id = auth.uid()
  AND om.role IN ('owner', 'instructor')
  AND om.status = 'active'
));

-- RLS policies for session_time
CREATE POLICY "Users can manage their own session time"
ON public.session_time
FOR ALL
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Admins can view all session time data"
ON public.session_time
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));