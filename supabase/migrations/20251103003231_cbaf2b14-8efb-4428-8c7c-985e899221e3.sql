-- Create AI Coach Analytics Table
CREATE TABLE IF NOT EXISTS public.ai_coach_analytics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  session_date DATE NOT NULL,
  study_time_minutes INTEGER DEFAULT 0,
  messages_sent INTEGER DEFAULT 0,
  topics_explored TEXT[] DEFAULT '{}',
  comprehension_score INTEGER,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, session_date)
);

-- Enable RLS
ALTER TABLE public.ai_coach_analytics ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own analytics"
  ON public.ai_coach_analytics FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own analytics"
  ON public.ai_coach_analytics FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own analytics"
  ON public.ai_coach_analytics FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own analytics"
  ON public.ai_coach_analytics FOR DELETE
  USING (auth.uid() = user_id);

-- Create index
CREATE INDEX IF NOT EXISTS idx_ai_coach_analytics_user_date 
  ON public.ai_coach_analytics(user_id, session_date DESC);

-- Create updated_at trigger
CREATE TRIGGER update_ai_coach_analytics_timestamp
  BEFORE UPDATE ON public.ai_coach_analytics
  FOR EACH ROW
  EXECUTE FUNCTION public.update_ai_coach_study_plans_updated_at();