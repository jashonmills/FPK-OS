-- Create UAT testers allowlist table
CREATE TABLE public.uat_testers (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email text NOT NULL UNIQUE,
  role text NOT NULL DEFAULT 'tester',
  invited_by uuid REFERENCES auth.users(id),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  is_active boolean NOT NULL DEFAULT true
);

-- Enable RLS
ALTER TABLE public.uat_testers ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Admins can manage UAT testers" 
ON public.uat_testers 
FOR ALL 
USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can view their own UAT status" 
ON public.uat_testers 
FOR SELECT 
USING (auth.email() = email);

-- Create user feedback table
CREATE TABLE public.user_feedback (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users(id),
  feedback_type text NOT NULL CHECK (feedback_type IN ('bug', 'ux_suggestion', 'confusing_step', 'feature_request')),
  title text NOT NULL,
  description text NOT NULL,
  screenshot_url text,
  page_url text,
  status text NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'in_review', 'resolved', 'ignored')),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  resolved_at timestamp with time zone,
  resolved_by uuid REFERENCES auth.users(id)
);

-- Enable RLS
ALTER TABLE public.user_feedback ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can create their own feedback" 
ON public.user_feedback 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own feedback" 
ON public.user_feedback 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all feedback" 
ON public.user_feedback 
FOR ALL 
USING (has_role(auth.uid(), 'admin'));

-- Create trigger for updated_at
CREATE TRIGGER update_user_feedback_updated_at
BEFORE UPDATE ON public.user_feedback
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create UAT session tracking table
CREATE TABLE public.uat_sessions (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users(id),
  session_goals jsonb NOT NULL DEFAULT '[]',
  completed_goals jsonb NOT NULL DEFAULT '[]',
  feedback_submitted boolean NOT NULL DEFAULT false,
  session_start timestamp with time zone NOT NULL DEFAULT now(),
  last_activity timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.uat_sessions ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can manage their own UAT sessions" 
ON public.uat_sessions 
FOR ALL 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all UAT sessions" 
ON public.uat_sessions 
FOR SELECT 
USING (has_role(auth.uid(), 'admin'));