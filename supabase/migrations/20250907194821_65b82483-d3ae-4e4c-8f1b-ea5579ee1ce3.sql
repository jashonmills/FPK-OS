-- Add RLS Policies for Organization Mode Tables

-- RLS Policies for Org Courses
CREATE POLICY "org_courses_select" ON public.org_courses
  FOR SELECT USING (
    EXISTS(
      SELECT 1 FROM public.org_members m 
      WHERE m.org_id = org_courses.org_id 
      AND m.user_id = auth.uid() 
      AND m.status = 'active'
    )
  );

CREATE POLICY "org_courses_insert" ON public.org_courses
  FOR INSERT WITH CHECK (
    EXISTS(
      SELECT 1 FROM public.org_members m 
      WHERE m.org_id = org_courses.org_id 
      AND m.user_id = auth.uid() 
      AND m.role IN ('owner','instructor')
      AND m.status = 'active'
    )
  );

CREATE POLICY "org_courses_update" ON public.org_courses
  FOR UPDATE USING (
    EXISTS(
      SELECT 1 FROM public.org_members m 
      WHERE m.org_id = org_courses.org_id 
      AND m.user_id = auth.uid() 
      AND m.role IN ('owner','instructor')
      AND m.status = 'active'
    )
  );

-- RLS Policies for Org Assignments
CREATE POLICY "org_assignments_select" ON public.org_assignments
  FOR SELECT USING (
    EXISTS(
      SELECT 1 FROM public.org_members m 
      WHERE m.org_id = org_assignments.org_id 
      AND m.user_id = auth.uid() 
      AND m.status = 'active'
    )
  );

CREATE POLICY "org_assignments_insert" ON public.org_assignments
  FOR INSERT WITH CHECK (
    EXISTS(
      SELECT 1 FROM public.org_members m 
      WHERE m.org_id = org_assignments.org_id 
      AND m.user_id = auth.uid() 
      AND m.role IN ('owner','instructor')
      AND m.status = 'active'
    )
  );

CREATE POLICY "org_assignments_update" ON public.org_assignments
  FOR UPDATE USING (
    EXISTS(
      SELECT 1 FROM public.org_members m 
      WHERE m.org_id = org_assignments.org_id 
      AND m.user_id = auth.uid() 
      AND m.role IN ('owner','instructor')
      AND m.status = 'active'
    )
  );

-- RLS Policies for Assignment Targets
CREATE POLICY "org_assignment_targets_select" ON public.org_assignment_targets
  FOR SELECT USING (
    -- Students can see their own assignments
    user_id = auth.uid() OR
    -- Instructors can see all assignments in their org
    EXISTS(
      SELECT 1 FROM public.org_assignments a
      JOIN public.org_members m ON m.org_id = a.org_id
      WHERE a.id = assignment_id 
      AND m.user_id = auth.uid() 
      AND m.role IN ('owner','instructor')
      AND m.status = 'active'
    )
  );

CREATE POLICY "org_assignment_targets_insert" ON public.org_assignment_targets
  FOR INSERT WITH CHECK (
    EXISTS(
      SELECT 1 FROM public.org_assignments a
      JOIN public.org_members m ON m.org_id = a.org_id
      WHERE a.id = assignment_id 
      AND m.user_id = auth.uid() 
      AND m.role IN ('owner','instructor')
      AND m.status = 'active'
    )
  );

CREATE POLICY "org_assignment_targets_update" ON public.org_assignment_targets
  FOR UPDATE USING (
    -- Students can update their own assignments
    user_id = auth.uid() OR
    -- Instructors can update all assignments in their org
    EXISTS(
      SELECT 1 FROM public.org_assignments a
      JOIN public.org_members m ON m.org_id = a.org_id
      WHERE a.id = assignment_id 
      AND m.user_id = auth.uid() 
      AND m.role IN ('owner','instructor')
      AND m.status = 'active'
    )
  );

-- RLS Policies for Org Goals
CREATE POLICY "org_goals_select" ON public.org_goals
  FOR SELECT USING (
    EXISTS(
      SELECT 1 FROM public.org_members m 
      WHERE m.org_id = org_goals.org_id 
      AND m.user_id = auth.uid() 
      AND m.status = 'active'
    )
  );

CREATE POLICY "org_goals_insert" ON public.org_goals
  FOR INSERT WITH CHECK (
    EXISTS(
      SELECT 1 FROM public.org_members m 
      WHERE m.org_id = org_goals.org_id 
      AND m.user_id = auth.uid() 
      AND m.role IN ('owner','instructor')
      AND m.status = 'active'
    )
  );

CREATE POLICY "org_goals_update" ON public.org_goals
  FOR UPDATE USING (
    EXISTS(
      SELECT 1 FROM public.org_members m 
      WHERE m.org_id = org_goals.org_id 
      AND m.user_id = auth.uid() 
      AND m.role IN ('owner','instructor')
      AND m.status = 'active'
    )
  );

-- RLS Policies for Goal Targets
CREATE POLICY "org_goal_targets_select" ON public.org_goal_targets
  FOR SELECT USING (
    -- Students can see their own goals
    user_id = auth.uid() OR
    -- Instructors can see all goals in their org
    EXISTS(
      SELECT 1 FROM public.org_goals g
      JOIN public.org_members m ON m.org_id = g.org_id
      WHERE g.id = goal_id 
      AND m.user_id = auth.uid() 
      AND m.role IN ('owner','instructor')
      AND m.status = 'active'
    )
  );

CREATE POLICY "org_goal_targets_insert" ON public.org_goal_targets
  FOR INSERT WITH CHECK (
    EXISTS(
      SELECT 1 FROM public.org_goals g
      JOIN public.org_members m ON m.org_id = g.org_id
      WHERE g.id = goal_id 
      AND m.user_id = auth.uid() 
      AND m.role IN ('owner','instructor')
      AND m.status = 'active'
    )
  );

CREATE POLICY "org_goal_targets_update" ON public.org_goal_targets
  FOR UPDATE USING (
    -- Students can update their own progress
    user_id = auth.uid() OR
    -- Instructors can update all goals in their org
    EXISTS(
      SELECT 1 FROM public.org_goals g
      JOIN public.org_members m ON m.org_id = g.org_id
      WHERE g.id = goal_id 
      AND m.user_id = auth.uid() 
      AND m.role IN ('owner','instructor')
      AND m.status = 'active'
    )
  );

-- RLS Policies for Note Folders
CREATE POLICY "org_note_folders_select" ON public.org_note_folders
  FOR SELECT USING (
    EXISTS(
      SELECT 1 FROM public.org_members m 
      WHERE m.org_id = org_note_folders.org_id 
      AND m.user_id = auth.uid() 
      AND m.status = 'active'
    )
  );

CREATE POLICY "org_note_folders_insert" ON public.org_note_folders
  FOR INSERT WITH CHECK (
    EXISTS(
      SELECT 1 FROM public.org_members m 
      WHERE m.org_id = org_note_folders.org_id 
      AND m.user_id = auth.uid() 
      AND m.role IN ('owner','instructor')
      AND m.status = 'active'
    )
  );

CREATE POLICY "org_note_folders_update" ON public.org_note_folders
  FOR UPDATE USING (
    EXISTS(
      SELECT 1 FROM public.org_members m 
      WHERE m.org_id = org_note_folders.org_id 
      AND m.user_id = auth.uid() 
      AND m.role IN ('owner','instructor')
      AND m.status = 'active'
    )
  );

-- RLS Policies for Notes
CREATE POLICY "org_notes_select" ON public.org_notes
  FOR SELECT USING (
    -- Students can see notes assigned to them
    EXISTS(
      SELECT 1 FROM public.org_note_targets nt
      WHERE nt.note_id = org_notes.id AND nt.user_id = auth.uid()
    ) OR
    -- Instructors can see all notes in their org
    EXISTS(
      SELECT 1 FROM public.org_members m 
      WHERE m.org_id = org_notes.org_id 
      AND m.user_id = auth.uid() 
      AND m.role IN ('owner','instructor')
      AND m.status = 'active'
    )
  );

CREATE POLICY "org_notes_insert" ON public.org_notes
  FOR INSERT WITH CHECK (
    EXISTS(
      SELECT 1 FROM public.org_members m 
      WHERE m.org_id = org_notes.org_id 
      AND m.user_id = auth.uid() 
      AND m.role IN ('owner','instructor')
      AND m.status = 'active'
    )
  );

CREATE POLICY "org_notes_update" ON public.org_notes
  FOR UPDATE USING (
    EXISTS(
      SELECT 1 FROM public.org_members m 
      WHERE m.org_id = org_notes.org_id 
      AND m.user_id = auth.uid() 
      AND m.role IN ('owner','instructor')
      AND m.status = 'active'
    )
  );

-- RLS Policies for Note Targets
CREATE POLICY "org_note_targets_select" ON public.org_note_targets
  FOR SELECT USING (
    -- Students can see their own note assignments
    user_id = auth.uid() OR
    -- Instructors can see all note assignments in their org
    EXISTS(
      SELECT 1 FROM public.org_notes n
      JOIN public.org_members m ON m.org_id = n.org_id
      WHERE n.id = note_id 
      AND m.user_id = auth.uid() 
      AND m.role IN ('owner','instructor')
      AND m.status = 'active'
    )
  );

CREATE POLICY "org_note_targets_insert" ON public.org_note_targets
  FOR INSERT WITH CHECK (
    EXISTS(
      SELECT 1 FROM public.org_notes n
      JOIN public.org_members m ON m.org_id = n.org_id
      WHERE n.id = note_id 
      AND m.user_id = auth.uid() 
      AND m.role IN ('owner','instructor')
      AND m.status = 'active'
    )
  );

-- RLS Policies for Analytics Tables
CREATE POLICY "activity_log_select" ON public.activity_log
  FOR SELECT USING (
    user_id = auth.uid() OR
    (org_id IS NOT NULL AND EXISTS(
      SELECT 1 FROM public.org_members m 
      WHERE m.org_id = activity_log.org_id 
      AND m.user_id = auth.uid() 
      AND m.role IN ('owner','instructor')
      AND m.status = 'active'
    ))
  );

CREATE POLICY "activity_log_insert" ON public.activity_log
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "session_time_select" ON public.session_time
  FOR SELECT USING (
    user_id = auth.uid() OR
    (org_id IS NOT NULL AND EXISTS(
      SELECT 1 FROM public.org_members m 
      WHERE m.org_id = session_time.org_id 
      AND m.user_id = auth.uid() 
      AND m.role IN ('owner','instructor')
      AND m.status = 'active'
    ))
  );

CREATE POLICY "session_time_insert" ON public.session_time
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "session_time_update" ON public.session_time
  FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "course_progress_select" ON public.course_progress
  FOR SELECT USING (
    user_id = auth.uid() OR
    (org_id IS NOT NULL AND EXISTS(
      SELECT 1 FROM public.org_members m 
      WHERE m.org_id = course_progress.org_id 
      AND m.user_id = auth.uid() 
      AND m.role IN ('owner','instructor')
      AND m.status = 'active'
    ))
  );

CREATE POLICY "course_progress_insert" ON public.course_progress
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "course_progress_update" ON public.course_progress
  FOR UPDATE USING (user_id = auth.uid());