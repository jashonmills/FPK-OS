-- Fix RLS policies for all organization tables

-- RLS Policies for org_assignment_targets
DROP POLICY IF EXISTS "Students can view their assignment targets" ON public.org_assignment_targets;
DROP POLICY IF EXISTS "Students can update their assignment targets" ON public.org_assignment_targets;
DROP POLICY IF EXISTS "Org leaders can manage assignment targets" ON public.org_assignment_targets;

CREATE POLICY "Students can view their assignment targets" ON public.org_assignment_targets
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Students can update their assignment targets" ON public.org_assignment_targets
  FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Org leaders can manage assignment targets" ON public.org_assignment_targets
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.org_assignments a
      INNER JOIN public.org_members m ON m.org_id = a.org_id
      WHERE a.id = org_assignment_targets.assignment_id 
      AND m.user_id = auth.uid() 
      AND m.role IN ('owner', 'instructor') 
      AND m.status = 'active'
    )
  );

-- RLS Policies for org_goals
DROP POLICY IF EXISTS "Org members can view goals" ON public.org_goals;
DROP POLICY IF EXISTS "Org leaders can manage goals" ON public.org_goals;

CREATE POLICY "Org members can view goals" ON public.org_goals
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.org_members 
      WHERE org_id = org_goals.org_id AND user_id = auth.uid() AND status = 'active'
    )
  );

CREATE POLICY "Org leaders can manage goals" ON public.org_goals
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.org_members 
      WHERE org_id = org_goals.org_id AND user_id = auth.uid() 
      AND role IN ('owner', 'instructor') AND status = 'active'
    )
  );

-- RLS Policies for org_goal_targets
DROP POLICY IF EXISTS "Students can view their goal targets" ON public.org_goal_targets;
DROP POLICY IF EXISTS "Students can update their goal progress" ON public.org_goal_targets;
DROP POLICY IF EXISTS "Org leaders can manage goal targets" ON public.org_goal_targets;

CREATE POLICY "Students can view their goal targets" ON public.org_goal_targets
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Students can update their goal progress" ON public.org_goal_targets
  FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Org leaders can manage goal targets" ON public.org_goal_targets
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.org_goals g
      INNER JOIN public.org_members m ON m.org_id = g.org_id
      WHERE g.id = org_goal_targets.goal_id 
      AND m.user_id = auth.uid() 
      AND m.role IN ('owner', 'instructor') 
      AND m.status = 'active'
    )
  );

-- RLS Policies for org_note_folders
DROP POLICY IF EXISTS "Org members can view note folders" ON public.org_note_folders;
DROP POLICY IF EXISTS "Org leaders can manage note folders" ON public.org_note_folders;

CREATE POLICY "Org members can view note folders" ON public.org_note_folders
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.org_members 
      WHERE org_id = org_note_folders.org_id AND user_id = auth.uid() AND status = 'active'
    )
  );

CREATE POLICY "Org leaders can manage note folders" ON public.org_note_folders
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.org_members 
      WHERE org_id = org_note_folders.org_id AND user_id = auth.uid() 
      AND role IN ('owner', 'instructor') AND status = 'active'
    )
  );

-- RLS Policies for org_notes
DROP POLICY IF EXISTS "Org members can view notes" ON public.org_notes;
DROP POLICY IF EXISTS "Org leaders can manage notes" ON public.org_notes;

CREATE POLICY "Org members can view notes" ON public.org_notes
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.org_members 
      WHERE org_id = org_notes.org_id AND user_id = auth.uid() AND status = 'active'
    ) OR
    EXISTS (
      SELECT 1 FROM public.org_note_targets 
      WHERE note_id = org_notes.id AND user_id = auth.uid()
    )
  );

CREATE POLICY "Org leaders can manage notes" ON public.org_notes
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.org_members 
      WHERE org_id = org_notes.org_id AND user_id = auth.uid() 
      AND role IN ('owner', 'instructor') AND status = 'active'
    )
  );

-- RLS Policies for org_note_targets
DROP POLICY IF EXISTS "Students can view their assigned notes" ON public.org_note_targets;
DROP POLICY IF EXISTS "Org leaders can manage note targets" ON public.org_note_targets;

CREATE POLICY "Students can view their assigned notes" ON public.org_note_targets
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Org leaders can manage note targets" ON public.org_note_targets
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.org_notes n
      INNER JOIN public.org_members m ON m.org_id = n.org_id
      WHERE n.id = org_note_targets.note_id 
      AND m.user_id = auth.uid() 
      AND m.role IN ('owner', 'instructor') 
      AND m.status = 'active'
    )
  );

-- RLS Policies for org_invites
DROP POLICY IF EXISTS "Anyone can view valid invites" ON public.org_invites;
DROP POLICY IF EXISTS "Org leaders can create invites" ON public.org_invites;
DROP POLICY IF EXISTS "Org leaders can manage their invites" ON public.org_invites;

CREATE POLICY "Anyone can view valid invites" ON public.org_invites
  FOR SELECT USING (
    (expires_at IS NULL OR expires_at > now()) AND uses_count < max_uses
  );

CREATE POLICY "Org leaders can create invites" ON public.org_invites
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.org_members 
      WHERE org_id = org_invites.org_id AND user_id = auth.uid() 
      AND role IN ('owner', 'instructor') AND status = 'active'
    )
  );

CREATE POLICY "Org leaders can manage their invites" ON public.org_invites
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.org_members 
      WHERE org_id = org_invites.org_id AND user_id = auth.uid() 
      AND role IN ('owner', 'instructor') AND status = 'active'
    )
  );