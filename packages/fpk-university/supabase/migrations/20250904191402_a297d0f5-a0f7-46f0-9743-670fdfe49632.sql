-- Update RLS policies to allow admins to access user analytics data

-- Allow admins to read analytics metrics for all users
CREATE POLICY "Admins can view all analytics metrics" 
ON public.analytics_metrics 
FOR SELECT 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Allow admins to read study sessions for all users
ALTER TABLE public.study_sessions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own study sessions" 
ON public.study_sessions 
FOR SELECT 
USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all study sessions" 
ON public.study_sessions 
FOR SELECT 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Allow admins to read chat sessions for all users
CREATE POLICY "Admins can view all chat sessions" 
ON public.chat_sessions 
FOR SELECT 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Allow admins to read reading sessions for all users
ALTER TABLE public.reading_sessions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own reading sessions" 
ON public.reading_sessions 
FOR SELECT 
USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all reading sessions" 
ON public.reading_sessions 
FOR SELECT 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Allow admins to read daily activities for all users
CREATE POLICY "Admins can view all daily activities" 
ON public.daily_activities 
FOR SELECT 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Allow admins to read user XP data
ALTER TABLE public.user_xp ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own XP" 
ON public.user_xp 
FOR SELECT 
USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all user XP" 
ON public.user_xp 
FOR SELECT 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Allow admins to read achievements for all users
CREATE POLICY "Admins can view all user achievements" 
ON public.achievements 
FOR SELECT 
USING (has_role(auth.uid(), 'admin'::app_role));