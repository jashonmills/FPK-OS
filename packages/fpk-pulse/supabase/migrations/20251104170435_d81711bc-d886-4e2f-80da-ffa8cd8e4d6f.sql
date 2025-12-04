-- Create active_time_sessions table for tracking who's currently clocked in
CREATE TABLE public.active_time_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  project_id uuid REFERENCES public.projects(id) ON DELETE CASCADE NOT NULL,
  task_id uuid REFERENCES public.tasks(id) ON DELETE SET NULL,
  start_time timestamptz NOT NULL DEFAULT now(),
  last_heartbeat timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- Enable RLS
ALTER TABLE public.active_time_sessions ENABLE ROW LEVEL SECURITY;

-- Users can manage their own sessions
CREATE POLICY "Users can insert own sessions"
  ON public.active_time_sessions FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own sessions"
  ON public.active_time_sessions FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own sessions"
  ON public.active_time_sessions FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- All authenticated users can view all sessions (needed for admin dashboard)
CREATE POLICY "All authenticated users can view sessions"
  ON public.active_time_sessions FOR SELECT
  TO authenticated
  USING (true);

-- Create indexes for performance
CREATE INDEX idx_active_sessions_user ON public.active_time_sessions(user_id);
CREATE INDEX idx_active_sessions_heartbeat ON public.active_time_sessions(last_heartbeat);

-- Enable realtime for both tables
ALTER PUBLICATION supabase_realtime ADD TABLE public.active_time_sessions;
ALTER PUBLICATION supabase_realtime ADD TABLE public.time_entries;