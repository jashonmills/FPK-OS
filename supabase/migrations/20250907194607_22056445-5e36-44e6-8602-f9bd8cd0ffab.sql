-- Organization Mode Complete Schema and RLS Policies

-- First, create the core organization tables
CREATE TABLE IF NOT EXISTS public.org_courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  level TEXT,
  published BOOLEAN DEFAULT false,
  deleted_at TIMESTAMPTZ,
  created_by UUID NOT NULL REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.org_assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  due_at TIMESTAMPTZ,
  course_id UUID REFERENCES public.org_courses(id),
  grading JSONB DEFAULT '{"type": "passfail"}'::jsonb,
  created_by UUID NOT NULL REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.org_assignment_targets (
  assignment_id UUID REFERENCES public.org_assignments(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id),
  status TEXT NOT NULL DEFAULT 'not_started' CHECK (status IN ('not_started', 'in_progress', 'submitted', 'graded')),
  submitted_at TIMESTAMPTZ,
  score NUMERIC,
  feedback TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  PRIMARY KEY(assignment_id, user_id)
);

CREATE TABLE IF NOT EXISTS public.org_goals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  priority TEXT CHECK(priority IN ('low','medium','high')) DEFAULT 'medium',
  notes TEXT,
  created_by UUID NOT NULL REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.org_goal_targets (
  goal_id UUID REFERENCES public.org_goals(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id),
  progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed', 'paused')),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  PRIMARY KEY(goal_id, user_id)
);

CREATE TABLE IF NOT EXISTS public.org_note_folders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  created_by UUID NOT NULL REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.org_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  folder_id UUID REFERENCES public.org_note_folders(id),
  title TEXT NOT NULL,
  content TEXT,
  created_by UUID NOT NULL REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.org_note_targets (
  note_id UUID REFERENCES public.org_notes(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  PRIMARY KEY(note_id, user_id)
);

-- Activity and progress tracking tables
CREATE TABLE IF NOT EXISTS public.activity_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id),
  event TEXT NOT NULL,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.session_time (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id),
  minutes INTEGER NOT NULL DEFAULT 0,
  day DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(org_id, user_id, day)
);

CREATE TABLE IF NOT EXISTS public.course_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE,
  course_id UUID REFERENCES public.org_courses(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id),
  percent INTEGER DEFAULT 0 CHECK (percent >= 0 AND percent <= 100),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(org_id, course_id, user_id)
);

-- Update org_invites table to ensure proper structure
ALTER TABLE public.org_invites 
ADD COLUMN IF NOT EXISTS uses_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS expires_at TIMESTAMPTZ;

-- Add branding column to organizations if it doesn't exist
ALTER TABLE public.organizations 
ADD COLUMN IF NOT EXISTS branding JSONB DEFAULT '{}'::jsonb;

-- Add updated_at triggers
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at triggers to all tables
DROP TRIGGER IF EXISTS update_org_courses_updated_at ON public.org_courses;
CREATE TRIGGER update_org_courses_updated_at 
    BEFORE UPDATE ON public.org_courses 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_org_assignments_updated_at ON public.org_assignments;
CREATE TRIGGER update_org_assignments_updated_at 
    BEFORE UPDATE ON public.org_assignments 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_org_assignment_targets_updated_at ON public.org_assignment_targets;
CREATE TRIGGER update_org_assignment_targets_updated_at 
    BEFORE UPDATE ON public.org_assignment_targets 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_org_goals_updated_at ON public.org_goals;
CREATE TRIGGER update_org_goals_updated_at 
    BEFORE UPDATE ON public.org_goals 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_org_goal_targets_updated_at ON public.org_goal_targets;
CREATE TRIGGER update_org_goal_targets_updated_at 
    BEFORE UPDATE ON public.org_goal_targets 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_org_note_folders_updated_at ON public.org_note_folders;
CREATE TRIGGER update_org_note_folders_updated_at 
    BEFORE UPDATE ON public.org_note_folders 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_org_notes_updated_at ON public.org_notes;
CREATE TRIGGER update_org_notes_updated_at 
    BEFORE UPDATE ON public.org_notes 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- RLS Policies for Organizations
DROP POLICY IF EXISTS "org_owner_update" ON public.organizations;
CREATE POLICY "org_owner_update" ON public.organizations
  FOR UPDATE USING (auth.uid() = owner_id);

DROP POLICY IF EXISTS "org_member_read" ON public.organizations;
CREATE POLICY "org_member_read" ON public.organizations
  FOR SELECT USING (
    EXISTS(
      SELECT 1 FROM public.org_members m 
      WHERE m.org_id = id AND m.user_id = auth.uid() AND m.status = 'active'
    )
  );

-- RLS Policies for Org Invites
DROP POLICY IF EXISTS "org_invites_insert" ON public.org_invites;
CREATE POLICY "org_invites_insert" ON public.org_invites
  FOR INSERT WITH CHECK (
    EXISTS(
      SELECT 1 FROM public.org_members 
      WHERE org_id = org_invites.org_id 
      AND user_id = auth.uid() 
      AND role IN ('owner','instructor')
      AND status = 'active'
    )
  );

DROP POLICY IF EXISTS "org_invites_select" ON public.org_invites;
CREATE POLICY "org_invites_select" ON public.org_invites
  FOR SELECT USING (
    EXISTS(
      SELECT 1 FROM public.org_members 
      WHERE org_id = org_invites.org_id 
      AND user_id = auth.uid() 
      AND role IN ('owner','instructor')
      AND status = 'active'
    )
  );

-- RLS Policies for Org Courses
ALTER TABLE public.org_courses ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "org_courses_select" ON public.org_courses;
CREATE POLICY "org_courses_select" ON public.org_courses
  FOR SELECT USING (
    EXISTS(
      SELECT 1 FROM public.org_members m 
      WHERE m.org_id = org_courses.org_id 
      AND m.user_id = auth.uid() 
      AND m.status = 'active'
    )
  );

DROP POLICY IF EXISTS "org_courses_insert" ON public.org_courses;
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

DROP POLICY IF EXISTS "org_courses_update" ON public.org_courses;
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
ALTER TABLE public.org_assignments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "org_assignments_select" ON public.org_assignments;
CREATE POLICY "org_assignments_select" ON public.org_assignments
  FOR SELECT USING (
    EXISTS(
      SELECT 1 FROM public.org_members m 
      WHERE m.org_id = org_assignments.org_id 
      AND m.user_id = auth.uid() 
      AND m.status = 'active'
    )
  );

DROP POLICY IF EXISTS "org_assignments_insert" ON public.org_assignments;
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

DROP POLICY IF EXISTS "org_assignments_update" ON public.org_assignments;
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
ALTER TABLE public.org_assignment_targets ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "org_assignment_targets_select" ON public.org_assignment_targets;
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

DROP POLICY IF EXISTS "org_assignment_targets_insert" ON public.org_assignment_targets;
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

DROP POLICY IF EXISTS "org_assignment_targets_update" ON public.org_assignment_targets;
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

-- Continue with other tables...
-- RLS Policies for Org Goals
ALTER TABLE public.org_goals ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "org_goals_select" ON public.org_goals;
CREATE POLICY "org_goals_select" ON public.org_goals
  FOR SELECT USING (
    EXISTS(
      SELECT 1 FROM public.org_members m 
      WHERE m.org_id = org_goals.org_id 
      AND m.user_id = auth.uid() 
      AND m.status = 'active'
    )
  );

DROP POLICY IF EXISTS "org_goals_insert" ON public.org_goals;
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

DROP POLICY IF EXISTS "org_goals_update" ON public.org_goals;
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
ALTER TABLE public.org_goal_targets ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "org_goal_targets_select" ON public.org_goal_targets;
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

DROP POLICY IF EXISTS "org_goal_targets_insert" ON public.org_goal_targets;
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

DROP POLICY IF EXISTS "org_goal_targets_update" ON public.org_goal_targets;
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
ALTER TABLE public.org_note_folders ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "org_note_folders_select" ON public.org_note_folders;
CREATE POLICY "org_note_folders_select" ON public.org_note_folders
  FOR SELECT USING (
    EXISTS(
      SELECT 1 FROM public.org_members m 
      WHERE m.org_id = org_note_folders.org_id 
      AND m.user_id = auth.uid() 
      AND m.status = 'active'
    )
  );

DROP POLICY IF EXISTS "org_note_folders_insert" ON public.org_note_folders;
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

DROP POLICY IF EXISTS "org_note_folders_update" ON public.org_note_folders;
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
ALTER TABLE public.org_notes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "org_notes_select" ON public.org_notes;
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

DROP POLICY IF EXISTS "org_notes_insert" ON public.org_notes;
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

DROP POLICY IF EXISTS "org_notes_update" ON public.org_notes;
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
ALTER TABLE public.org_note_targets ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "org_note_targets_select" ON public.org_note_targets;
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

DROP POLICY IF EXISTS "org_note_targets_insert" ON public.org_note_targets;
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
ALTER TABLE public.activity_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.session_time ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_progress ENABLE ROW LEVEL SECURITY;

-- Activity Log policies
DROP POLICY IF EXISTS "activity_log_select" ON public.activity_log;
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

DROP POLICY IF EXISTS "activity_log_insert" ON public.activity_log;
CREATE POLICY "activity_log_insert" ON public.activity_log
  FOR INSERT WITH CHECK (user_id = auth.uid());

-- Session Time policies
DROP POLICY IF EXISTS "session_time_select" ON public.session_time;
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

DROP POLICY IF EXISTS "session_time_insert" ON public.session_time;
CREATE POLICY "session_time_insert" ON public.session_time
  FOR INSERT WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "session_time_update" ON public.session_time;
CREATE POLICY "session_time_update" ON public.session_time
  FOR UPDATE USING (user_id = auth.uid());

-- Course Progress policies
DROP POLICY IF EXISTS "course_progress_select" ON public.course_progress;
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

DROP POLICY IF EXISTS "course_progress_insert" ON public.course_progress;
CREATE POLICY "course_progress_insert" ON public.course_progress
  FOR INSERT WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "course_progress_update" ON public.course_progress;
CREATE POLICY "course_progress_update" ON public.course_progress
  FOR UPDATE USING (user_id = auth.uid());

-- Create RPC functions
CREATE OR REPLACE FUNCTION public.org_create_invite(
  p_org_id UUID,
  p_role TEXT,
  p_max_uses INTEGER DEFAULT 100,
  p_expires_interval INTERVAL DEFAULT '30 days'::interval
) RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_code TEXT;
  v_invite_id UUID;
BEGIN
  -- Check if user has permission to create invites
  IF NOT EXISTS (
    SELECT 1 FROM public.org_members 
    WHERE org_id = p_org_id 
    AND user_id = auth.uid() 
    AND role IN ('owner', 'instructor')
    AND status = 'active'
  ) THEN
    RAISE EXCEPTION 'Insufficient permissions to create invite';
  END IF;
  
  -- Generate unique code
  v_code := 'inv_' || encode(gen_random_bytes(16), 'hex');
  
  -- Create invite
  INSERT INTO public.org_invites (
    org_id, code, role, max_uses, expires_at, created_by
  ) VALUES (
    p_org_id, v_code, p_role, p_max_uses, 
    CASE WHEN p_expires_interval IS NOT NULL THEN now() + p_expires_interval ELSE NULL END,
    auth.uid()
  ) RETURNING id INTO v_invite_id;
  
  RETURN v_code;
END;
$$;

CREATE OR REPLACE FUNCTION public.org_change_plan(
  p_org_id UUID,
  p_plan TEXT
) RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Check if user is owner
  IF NOT EXISTS (
    SELECT 1 FROM public.organizations 
    WHERE id = p_org_id AND owner_id = auth.uid()
  ) THEN
    RAISE EXCEPTION 'Only organization owners can change plans';
  END IF;
  
  -- Validate plan
  IF p_plan NOT IN ('basic', 'standard', 'premium', 'beta') THEN
    RAISE EXCEPTION 'Invalid plan type';
  END IF;
  
  -- Update organization
  UPDATE public.organizations 
  SET plan = p_plan, updated_at = now()
  WHERE id = p_org_id;
END;
$$;

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_org_courses_org_id ON public.org_courses(org_id);
CREATE INDEX IF NOT EXISTS idx_org_assignments_org_id ON public.org_assignments(org_id);
CREATE INDEX IF NOT EXISTS idx_org_assignment_targets_assignment_id ON public.org_assignment_targets(assignment_id);
CREATE INDEX IF NOT EXISTS idx_org_assignment_targets_user_id ON public.org_assignment_targets(user_id);
CREATE INDEX IF NOT EXISTS idx_org_goals_org_id ON public.org_goals(org_id);
CREATE INDEX IF NOT EXISTS idx_org_goal_targets_goal_id ON public.org_goal_targets(goal_id);
CREATE INDEX IF NOT EXISTS idx_org_goal_targets_user_id ON public.org_goal_targets(user_id);
CREATE INDEX IF NOT EXISTS idx_org_note_folders_org_id ON public.org_note_folders(org_id);
CREATE INDEX IF NOT EXISTS idx_org_notes_org_id ON public.org_notes(org_id);
CREATE INDEX IF NOT EXISTS idx_org_notes_folder_id ON public.org_notes(folder_id);
CREATE INDEX IF NOT EXISTS idx_org_note_targets_note_id ON public.org_note_targets(note_id);
CREATE INDEX IF NOT EXISTS idx_org_note_targets_user_id ON public.org_note_targets(user_id);
CREATE INDEX IF NOT EXISTS idx_activity_log_org_id ON public.activity_log(org_id);
CREATE INDEX IF NOT EXISTS idx_activity_log_user_id ON public.activity_log(user_id);
CREATE INDEX IF NOT EXISTS idx_session_time_org_id ON public.session_time(org_id);
CREATE INDEX IF NOT EXISTS idx_course_progress_org_id ON public.course_progress(org_id);