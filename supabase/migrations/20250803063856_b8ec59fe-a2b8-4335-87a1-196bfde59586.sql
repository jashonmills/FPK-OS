-- Create table for tracking milestone completions for analytics
CREATE TABLE public.goal_milestone_completions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  goal_id UUID NOT NULL,
  milestone_id TEXT NOT NULL,
  milestone_title TEXT NOT NULL,
  completed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  completion_time_seconds INTEGER,
  context_data JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.goal_milestone_completions ENABLE ROW LEVEL SECURITY;

-- Create policies for milestone completions
CREATE POLICY "Users can view their own milestone completions" 
ON public.goal_milestone_completions 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own milestone completions" 
ON public.goal_milestone_completions 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Create index for better performance
CREATE INDEX idx_goal_milestone_completions_user_goal ON public.goal_milestone_completions(user_id, goal_id);
CREATE INDEX idx_goal_milestone_completions_completed_at ON public.goal_milestone_completions(completed_at DESC);