-- Phase 2: AI Coach Portal - Create coach_sessions table

-- Create coach_sessions table for authenticated AI Coach users
CREATE TABLE IF NOT EXISTS public.coach_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  session_title text DEFAULT 'New Coaching Session',
  session_data jsonb DEFAULT '{"messages": []}'::jsonb,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

-- Enable RLS on coach_sessions
ALTER TABLE public.coach_sessions ENABLE ROW LEVEL SECURITY;

-- RLS Policy: AI coach users can manage their own sessions
CREATE POLICY "AI coach users can manage their sessions"
  ON public.coach_sessions
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_roles.user_id = auth.uid()
      AND user_roles.role = 'ai_coach_user'
    )
    AND user_id = auth.uid()
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_roles.user_id = auth.uid()
      AND user_roles.role = 'ai_coach_user'
    )
    AND user_id = auth.uid()
  );

-- Create updated_at trigger for coach_sessions
CREATE TRIGGER update_coach_sessions_updated_at
  BEFORE UPDATE ON public.coach_sessions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for faster lookups
CREATE INDEX IF NOT EXISTS idx_coach_sessions_user_id 
  ON public.coach_sessions(user_id);

CREATE INDEX IF NOT EXISTS idx_coach_sessions_created_at 
  ON public.coach_sessions(created_at DESC);