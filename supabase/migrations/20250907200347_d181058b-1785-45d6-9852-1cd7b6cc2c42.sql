-- FPK University Organization Mode: Complete Database Setup

-- Create org_courses table
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

-- Create org_assignments table  
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

-- Create org_assignment_targets table
CREATE TABLE IF NOT EXISTS public.org_assignment_targets (
  assignment_id UUID REFERENCES public.org_assignments(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id),
  status TEXT NOT NULL DEFAULT 'not_started' CHECK (status IN ('not_started', 'in_progress', 'submitted', 'graded')),
  submitted_at TIMESTAMPTZ,
  score NUMERIC,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  PRIMARY KEY(assignment_id, user_id)
);

-- Create org_goals table
CREATE TABLE IF NOT EXISTS public.org_goals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  priority TEXT CHECK(priority IN ('low','medium','high')) DEFAULT 'medium',
  category TEXT,
  created_by UUID NOT NULL REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create org_goal_targets table
CREATE TABLE IF NOT EXISTS public.org_goal_targets (
  goal_id UUID REFERENCES public.org_goals(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id),
  progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed', 'paused')),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  PRIMARY KEY(goal_id, user_id)
);

-- Create org_note_folders table
CREATE TABLE IF NOT EXISTS public.org_note_folders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  parent_id UUID REFERENCES public.org_note_folders(id),
  created_by UUID NOT NULL REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create org_notes table
CREATE TABLE IF NOT EXISTS public.org_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  folder_id UUID REFERENCES public.org_note_folders(id),
  title TEXT NOT NULL,
  content TEXT,
  visibility_scope TEXT DEFAULT 'instructor-visible' CHECK (visibility_scope IN ('student-only', 'instructor-visible', 'org-public')),
  is_private BOOLEAN DEFAULT false,
  tags TEXT[],
  created_by UUID NOT NULL REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create org_note_targets table
CREATE TABLE IF NOT EXISTS public.org_note_targets (
  note_id UUID REFERENCES public.org_notes(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  PRIMARY KEY(note_id, user_id)
);

-- Ensure org_invites table exists with proper structure
CREATE TABLE IF NOT EXISTS public.org_invites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  code TEXT UNIQUE NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('student', 'instructor')),
  max_uses INTEGER DEFAULT 100,
  uses_count INTEGER DEFAULT 0,
  expires_at TIMESTAMPTZ,
  created_by UUID NOT NULL REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Add uses_count column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'org_invites' AND column_name = 'uses_count') THEN
    ALTER TABLE public.org_invites ADD COLUMN uses_count INTEGER DEFAULT 0;
  END IF;
END $$;

-- Enable RLS on all new tables
ALTER TABLE public.org_courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.org_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.org_assignment_targets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.org_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.org_goal_targets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.org_note_folders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.org_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.org_note_targets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.org_invites ENABLE ROW LEVEL SECURITY;

-- RLS Policies for org_courses
CREATE POLICY "Org members can view courses" ON public.org_courses
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.org_members 
      WHERE org_id = org_courses.org_id AND user_id = auth.uid() AND status = 'active'
    )
  );

CREATE POLICY "Org leaders can manage courses" ON public.org_courses
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.org_members 
      WHERE org_id = org_courses.org_id AND user_id = auth.uid() 
      AND role IN ('owner', 'instructor') AND status = 'active'
    )
  );

-- RLS Policies for org_assignments
CREATE POLICY "Org members can view assignments" ON public.org_assignments
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.org_members 
      WHERE org_id = org_assignments.org_id AND user_id = auth.uid() AND status = 'active'
    )
  );

CREATE POLICY "Org leaders can manage assignments" ON public.org_assignments
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.org_members 
      WHERE org_id = org_assignments.org_id AND user_id = auth.uid() 
      AND role IN ('owner', 'instructor') AND status = 'active'
    )
  );

CREATE POLICY "Org leaders can update assignments" ON public.org_assignments
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.org_members 
      WHERE org_id = org_assignments.org_id AND user_id = auth.uid() 
      AND role IN ('owner', 'instructor') AND status = 'active'
    )
  );

-- RLS Policies for org_assignment_targets
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

-- Add missing RLS policies for organizations table
CREATE POLICY "Org owners can update their organizations" ON public.organizations
  FOR UPDATE USING (owner_id = auth.uid());

CREATE POLICY "Org members can read their organizations" ON public.organizations
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.org_members 
      WHERE org_id = organizations.id AND user_id = auth.uid() AND status = 'active'
    )
  );

-- Create RPC function: org_create_invite
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

-- Create RPC function: org_change_plan
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

-- Create triggers for updated_at columns
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_org_courses_updated_at BEFORE UPDATE ON public.org_courses FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_org_assignments_updated_at BEFORE UPDATE ON public.org_assignments FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_org_assignment_targets_updated_at BEFORE UPDATE ON public.org_assignment_targets FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_org_goals_updated_at BEFORE UPDATE ON public.org_goals FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_org_goal_targets_updated_at BEFORE UPDATE ON public.org_goal_targets FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_org_note_folders_updated_at BEFORE UPDATE ON public.org_note_folders FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_org_notes_updated_at BEFORE UPDATE ON public.org_notes FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();