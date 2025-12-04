
-- Create goal_reminders table for managing user reminder preferences
CREATE TABLE public.goal_reminders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  goal_id UUID REFERENCES public.goals(id) ON DELETE CASCADE,
  reminder_type TEXT NOT NULL CHECK (reminder_type IN ('daily', 'weekly', 'custom', 'deadline')),
  reminder_time TIME,
  reminder_days INTEGER[], -- Array of weekdays (0=Sun, 6=Sat) for weekly reminders
  is_active BOOLEAN NOT NULL DEFAULT true,
  message TEXT,
  next_reminder_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add RLS policies for goal_reminders
ALTER TABLE public.goal_reminders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own goal reminders" 
  ON public.goal_reminders 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own goal reminders" 
  ON public.goal_reminders 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own goal reminders" 
  ON public.goal_reminders 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own goal reminders" 
  ON public.goal_reminders 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Add trigger for updated_at
CREATE TRIGGER update_goal_reminders_updated_at
  BEFORE UPDATE ON public.goal_reminders
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Add indexes for performance
CREATE INDEX idx_goal_reminders_user_id ON public.goal_reminders(user_id);
CREATE INDEX idx_goal_reminders_goal_id ON public.goal_reminders(goal_id);
CREATE INDEX idx_goal_reminders_next_reminder ON public.goal_reminders(next_reminder_at) WHERE is_active = true;
