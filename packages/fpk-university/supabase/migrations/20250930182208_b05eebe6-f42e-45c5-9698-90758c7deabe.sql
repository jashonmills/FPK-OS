-- Enhanced Socratic Study Coach Tables
CREATE TABLE IF NOT EXISTS public.socratic_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  org_id UUID,
  topic TEXT NOT NULL,
  objective TEXT NOT NULL,
  rubric JSONB NOT NULL DEFAULT '{"levels": [0, 1, 2, 3], "descriptions": {"0": "Off-topic or blank", "1": "Partial understanding with major gaps", "2": "Mostly correct with minor gaps", "3": "Fully correct and ready to advance"}}'::jsonb,
  state TEXT NOT NULL DEFAULT 'ASK' CHECK (state IN ('ASK', 'WAIT', 'EVALUATE', 'NUDGE', 'NEXT', 'COMPLETED')),
  score_history INTEGER[] NOT NULL DEFAULT '{}',
  current_question TEXT,
  nudge_count INTEGER NOT NULL DEFAULT 0,
  started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.socratic_turns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES public.socratic_sessions(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('coach', 'student', 'system')),
  content TEXT NOT NULL,
  score INTEGER CHECK (score >= 0 AND score <= 3),
  misconception TEXT,
  tag TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_socratic_sessions_user ON public.socratic_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_socratic_sessions_org ON public.socratic_sessions(org_id);
CREATE INDEX IF NOT EXISTS idx_socratic_turns_session ON public.socratic_turns(session_id);

-- RLS Policies
ALTER TABLE public.socratic_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.socratic_turns ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS socratic_sessions_user_all ON public.socratic_sessions;
DROP POLICY IF EXISTS socratic_sessions_org_view ON public.socratic_sessions;
DROP POLICY IF EXISTS socratic_turns_user_view ON public.socratic_turns;
DROP POLICY IF EXISTS socratic_turns_user_insert ON public.socratic_turns;
DROP POLICY IF EXISTS socratic_sessions_admin_all ON public.socratic_sessions;
DROP POLICY IF EXISTS socratic_turns_admin_all ON public.socratic_turns;

-- Users can manage their own sessions
CREATE POLICY socratic_sessions_user_all 
ON public.socratic_sessions 
FOR ALL 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Org members can view org sessions
CREATE POLICY socratic_sessions_org_view 
ON public.socratic_sessions 
FOR SELECT 
USING (
  org_id IS NOT NULL AND 
  user_is_org_member_safe(org_id, auth.uid())
);

-- Users can view turns for their sessions
CREATE POLICY socratic_turns_user_view 
ON public.socratic_turns 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.socratic_sessions 
    WHERE id = session_id AND user_id = auth.uid()
  )
);

-- Users can create turns for their sessions
CREATE POLICY socratic_turns_user_insert 
ON public.socratic_turns 
FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.socratic_sessions 
    WHERE id = session_id AND user_id = auth.uid()
  )
);

-- Admins can view all
CREATE POLICY socratic_sessions_admin_all 
ON public.socratic_sessions 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY socratic_turns_admin_all 
ON public.socratic_turns 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role));