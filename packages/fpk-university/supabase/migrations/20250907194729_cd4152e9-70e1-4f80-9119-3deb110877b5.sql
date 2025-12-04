-- Organization Mode Tables and Policies (Corrected)

-- First, create the core organization tables that don't exist yet
CREATE TABLE IF NOT EXISTS public.org_courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  level TEXT,
  published BOOLEAN DEFAULT false,
  deleted_at TIMESTAMPTZ,
  created_by UUID NOT NULL,
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
  created_by UUID NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.org_assignment_targets (
  assignment_id UUID REFERENCES public.org_assignments(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
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
  created_by UUID NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.org_goal_targets (
  goal_id UUID REFERENCES public.org_goals(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
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
  created_by UUID NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.org_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  folder_id UUID REFERENCES public.org_note_folders(id),
  title TEXT NOT NULL,
  content TEXT,
  created_by UUID NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.org_note_targets (
  note_id UUID REFERENCES public.org_notes(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  PRIMARY KEY(note_id, user_id)
);

-- Activity and progress tracking tables
CREATE TABLE IF NOT EXISTS public.activity_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  event TEXT NOT NULL,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.session_time (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  minutes INTEGER NOT NULL DEFAULT 0,
  day DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(org_id, user_id, day)
);

CREATE TABLE IF NOT EXISTS public.course_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE,
  course_id UUID REFERENCES public.org_courses(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  percent INTEGER DEFAULT 0 CHECK (percent >= 0 AND percent <= 100),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(org_id, course_id, user_id)
);

-- Add branding column to organizations if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'organizations' 
        AND column_name = 'branding'
    ) THEN
        ALTER TABLE public.organizations ADD COLUMN branding JSONB DEFAULT '{}'::jsonb;
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
ALTER TABLE public.activity_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.session_time ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_progress ENABLE ROW LEVEL SECURITY;

-- RLS Policies for Organizations (update existing)
DROP POLICY IF EXISTS "org_owner_update" ON public.organizations;
CREATE POLICY "org_owner_update" ON public.organizations
  FOR UPDATE USING (auth.uid() = owner_id);

DROP POLICY IF EXISTS "org_member_read" ON public.organizations;
CREATE POLICY "org_member_read" ON public.organizations
  FOR SELECT USING (
    EXISTS(
      SELECT 1 FROM public.org_members m 
      WHERE m.org_id = organizations.id AND m.user_id = auth.uid() AND m.status = 'active'
    )
  );

-- RLS Policies for Org Invites (update existing)
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