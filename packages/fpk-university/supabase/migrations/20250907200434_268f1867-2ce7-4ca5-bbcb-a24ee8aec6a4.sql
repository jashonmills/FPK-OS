-- FPK University Organization Mode: Complete Database Setup (Fixed)

-- Drop existing policies that might conflict
DROP POLICY IF EXISTS "Org members can view assignments" ON public.org_assignments;
DROP POLICY IF EXISTS "Org leaders can manage assignments" ON public.org_assignments;
DROP POLICY IF EXISTS "Org leaders can update assignments" ON public.org_assignments;

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

-- RLS Policies for org_courses
DROP POLICY IF EXISTS "Org members can view courses" ON public.org_courses;
DROP POLICY IF EXISTS "Org leaders can manage courses" ON public.org_courses;
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

-- RLS Policies for org_assignments (recreate after dropping)
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