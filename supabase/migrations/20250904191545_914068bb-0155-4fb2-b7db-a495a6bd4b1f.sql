-- Add admin access policies for analytics data (only create if not exists)

-- Check and add admin policy for analytics metrics
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'analytics_metrics' AND policyname = 'Admins can view all analytics metrics'
  ) THEN
    EXECUTE 'CREATE POLICY "Admins can view all analytics metrics" ON public.analytics_metrics FOR SELECT USING (has_role(auth.uid(), ''admin''::app_role))';
  END IF;
END $$;

-- Check and add admin policy for study sessions
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'study_sessions' AND policyname = 'Admins can view all study sessions'
  ) THEN
    EXECUTE 'CREATE POLICY "Admins can view all study sessions" ON public.study_sessions FOR SELECT USING (has_role(auth.uid(), ''admin''::app_role))';
  END IF;
END $$;

-- Check and add admin policy for chat sessions
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'chat_sessions' AND policyname = 'Admins can view all chat sessions'
  ) THEN
    EXECUTE 'CREATE POLICY "Admins can view all chat sessions" ON public.chat_sessions FOR SELECT USING (has_role(auth.uid(), ''admin''::app_role))';
  END IF;
END $$;

-- Check and add admin policy for reading sessions
DO $$
BEGIN
  -- Enable RLS if not already enabled
  IF NOT EXISTS (
    SELECT 1 FROM pg_class c 
    JOIN pg_namespace n ON n.oid = c.relnamespace 
    WHERE c.relname = 'reading_sessions' AND n.nspname = 'public' AND c.relrowsecurity = true
  ) THEN
    EXECUTE 'ALTER TABLE public.reading_sessions ENABLE ROW LEVEL SECURITY';
  END IF;
  
  -- Add user policy if not exists
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'reading_sessions' AND policyname = 'Users can view their own reading sessions'
  ) THEN
    EXECUTE 'CREATE POLICY "Users can view their own reading sessions" ON public.reading_sessions FOR SELECT USING (auth.uid() = user_id)';
  END IF;
  
  -- Add admin policy if not exists
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'reading_sessions' AND policyname = 'Admins can view all reading sessions'
  ) THEN
    EXECUTE 'CREATE POLICY "Admins can view all reading sessions" ON public.reading_sessions FOR SELECT USING (has_role(auth.uid(), ''admin''::app_role))';
  END IF;
END $$;

-- Check and add admin policy for daily activities
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'daily_activities' AND policyname = 'Admins can view all daily activities'
  ) THEN
    EXECUTE 'CREATE POLICY "Admins can view all daily activities" ON public.daily_activities FOR SELECT USING (has_role(auth.uid(), ''admin''::app_role))';
  END IF;
END $$;

-- Check and add user XP policies
DO $$
BEGIN
  -- Enable RLS if not already enabled
  IF NOT EXISTS (
    SELECT 1 FROM pg_class c 
    JOIN pg_namespace n ON n.oid = c.relnamespace 
    WHERE c.relname = 'user_xp' AND n.nspname = 'public' AND c.relrowsecurity = true
  ) THEN
    EXECUTE 'ALTER TABLE public.user_xp ENABLE ROW LEVEL SECURITY';
  END IF;
  
  -- Add user policy if not exists
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'user_xp' AND policyname = 'Users can view their own XP'
  ) THEN
    EXECUTE 'CREATE POLICY "Users can view their own XP" ON public.user_xp FOR SELECT USING (auth.uid() = user_id)';
  END IF;
  
  -- Add admin policy if not exists
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'user_xp' AND policyname = 'Admins can view all user XP'
  ) THEN
    EXECUTE 'CREATE POLICY "Admins can view all user XP" ON public.user_xp FOR SELECT USING (has_role(auth.uid(), ''admin''::app_role))';
  END IF;
END $$;

-- Check and add admin policy for achievements
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'achievements' AND policyname = 'Admins can view all user achievements'
  ) THEN
    EXECUTE 'CREATE POLICY "Admins can view all user achievements" ON public.achievements FOR SELECT USING (has_role(auth.uid(), ''admin''::app_role))';
  END IF;
END $$;