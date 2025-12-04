-- Create user tour progress tracking table
CREATE TABLE IF NOT EXISTS public.user_tour_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  has_seen_dashboard_tour BOOLEAN DEFAULT false,
  has_seen_activities_tour BOOLEAN DEFAULT false,
  has_seen_goals_tour BOOLEAN DEFAULT false,
  has_seen_analytics_tour BOOLEAN DEFAULT false,
  has_seen_settings_tour BOOLEAN DEFAULT false,
  has_seen_documents_tour BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id)
);

-- Enable RLS
ALTER TABLE public.user_tour_progress ENABLE ROW LEVEL SECURITY;

-- Users can view their own tour progress
CREATE POLICY "Users can view their own tour progress"
ON public.user_tour_progress
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Users can insert their own tour progress
CREATE POLICY "Users can insert their own tour progress"
ON public.user_tour_progress
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Users can update their own tour progress
CREATE POLICY "Users can update their own tour progress"
ON public.user_tour_progress
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id);

-- Trigger to update updated_at
CREATE OR REPLACE FUNCTION update_tour_progress_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_user_tour_progress_updated_at
  BEFORE UPDATE ON public.user_tour_progress
  FOR EACH ROW
  EXECUTE FUNCTION update_tour_progress_updated_at();