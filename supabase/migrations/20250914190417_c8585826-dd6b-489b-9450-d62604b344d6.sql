-- Create comprehensive analytics tables for interactive courses

-- Interactive course enrollments and progress
CREATE TABLE IF NOT EXISTS public.interactive_course_enrollments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  course_id TEXT NOT NULL,
  course_title TEXT NOT NULL,
  enrolled_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  last_accessed_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  completion_percentage INTEGER DEFAULT 0,
  completed_at TIMESTAMP WITH TIME ZONE,
  total_time_spent_minutes INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Interactive lesson progress and analytics  
CREATE TABLE IF NOT EXISTS public.interactive_lesson_analytics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  course_id TEXT NOT NULL,
  lesson_id INTEGER NOT NULL,
  lesson_title TEXT NOT NULL,
  started_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE,
  time_spent_seconds INTEGER DEFAULT 0,
  completion_method TEXT DEFAULT 'manual', -- 'manual', 'automatic', 'skipped'
  engagement_score NUMERIC DEFAULT 0, -- 0-100 based on interaction patterns
  scroll_depth_percentage INTEGER DEFAULT 0,
  interactions_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Detailed course session tracking
CREATE TABLE IF NOT EXISTS public.interactive_course_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  course_id TEXT NOT NULL,
  lesson_id INTEGER,
  session_start TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  session_end TIMESTAMP WITH TIME ZONE,
  duration_seconds INTEGER DEFAULT 0,
  page_views INTEGER DEFAULT 1,
  interactions jsonb DEFAULT '[]',
  session_type TEXT DEFAULT 'lesson', -- 'overview', 'lesson', 'completion'
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Learning path and sequence analytics
CREATE TABLE IF NOT EXISTS public.interactive_learning_paths (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  course_id TEXT NOT NULL,
  lesson_sequence jsonb NOT NULL, -- Array of lesson IDs in order completed
  optimal_path jsonb, -- Recommended sequence based on analytics
  difficulty_adjustments jsonb DEFAULT '{}', -- User-specific difficulty modifications
  learning_velocity NUMERIC DEFAULT 1.0, -- Lessons per hour
  preferred_session_length_minutes INTEGER DEFAULT 30,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Course content effectiveness metrics
CREATE TABLE IF NOT EXISTS public.interactive_content_metrics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  course_id TEXT NOT NULL,
  lesson_id INTEGER NOT NULL,
  metric_type TEXT NOT NULL, -- 'completion_rate', 'avg_time', 'engagement', 'dropout_rate'  
  metric_value NUMERIC NOT NULL,
  sample_size INTEGER DEFAULT 1,
  date_calculated DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- User learning preferences and patterns
CREATE TABLE IF NOT EXISTS public.interactive_learning_preferences (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  preferred_learning_speed TEXT DEFAULT 'normal', -- 'slow', 'normal', 'fast'
  preferred_session_duration_minutes INTEGER DEFAULT 30,
  learning_style_indicators jsonb DEFAULT '{}',
  optimal_study_times jsonb DEFAULT '[]', -- Hours of day when most active
  difficulty_preferences jsonb DEFAULT '{}',
  engagement_patterns jsonb DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_interactive_course_enrollments_user_id ON public.interactive_course_enrollments(user_id);
CREATE INDEX IF NOT EXISTS idx_interactive_course_enrollments_course_id ON public.interactive_course_enrollments(course_id);
CREATE INDEX IF NOT EXISTS idx_interactive_lesson_analytics_user_course ON public.interactive_lesson_analytics(user_id, course_id);
CREATE INDEX IF NOT EXISTS idx_interactive_lesson_analytics_lesson ON public.interactive_lesson_analytics(course_id, lesson_id);
CREATE INDEX IF NOT EXISTS idx_interactive_course_sessions_user_id ON public.interactive_course_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_interactive_learning_paths_user_id ON public.interactive_learning_paths(user_id);
CREATE INDEX IF NOT EXISTS idx_interactive_content_metrics_course_lesson ON public.interactive_content_metrics(course_id, lesson_id);

-- Enable RLS on all tables
ALTER TABLE public.interactive_course_enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.interactive_lesson_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.interactive_course_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.interactive_learning_paths ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.interactive_content_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.interactive_learning_preferences ENABLE ROW LEVEL SECURITY;

-- RLS Policies for interactive_course_enrollments
CREATE POLICY "Users can view their own course enrollments" ON public.interactive_course_enrollments
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own course enrollments" ON public.interactive_course_enrollments
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own course enrollments" ON public.interactive_course_enrollments
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all course enrollments" ON public.interactive_course_enrollments
  FOR SELECT USING (has_role(auth.uid(), 'admin'::app_role));

-- RLS Policies for interactive_lesson_analytics
CREATE POLICY "Users can view their own lesson analytics" ON public.interactive_lesson_analytics
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own lesson analytics" ON public.interactive_lesson_analytics
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own lesson analytics" ON public.interactive_lesson_analytics
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all lesson analytics" ON public.interactive_lesson_analytics
  FOR SELECT USING (has_role(auth.uid(), 'admin'::app_role));

-- RLS Policies for interactive_course_sessions
CREATE POLICY "Users can manage their own course sessions" ON public.interactive_course_sessions
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all course sessions" ON public.interactive_course_sessions
  FOR SELECT USING (has_role(auth.uid(), 'admin'::app_role));

-- RLS Policies for interactive_learning_paths
CREATE POLICY "Users can manage their own learning paths" ON public.interactive_learning_paths
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all learning paths" ON public.interactive_learning_paths
  FOR SELECT USING (has_role(auth.uid(), 'admin'::app_role));

-- RLS Policies for interactive_content_metrics
CREATE POLICY "Anyone can view content metrics" ON public.interactive_content_metrics
  FOR SELECT USING (true);

CREATE POLICY "System can manage content metrics" ON public.interactive_content_metrics
  FOR ALL USING (true) WITH CHECK (true);

-- RLS Policies for interactive_learning_preferences
CREATE POLICY "Users can manage their own learning preferences" ON public.interactive_learning_preferences
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all learning preferences" ON public.interactive_learning_preferences
  FOR SELECT USING (has_role(auth.uid(), 'admin'::app_role));

-- Create trigger for updating updated_at columns
CREATE OR REPLACE FUNCTION public.update_interactive_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_interactive_course_enrollments_updated_at
  BEFORE UPDATE ON public.interactive_course_enrollments
  FOR EACH ROW EXECUTE FUNCTION public.update_interactive_updated_at();

CREATE TRIGGER update_interactive_lesson_analytics_updated_at
  BEFORE UPDATE ON public.interactive_lesson_analytics
  FOR EACH ROW EXECUTE FUNCTION public.update_interactive_updated_at();

CREATE TRIGGER update_interactive_learning_paths_updated_at
  BEFORE UPDATE ON public.interactive_learning_paths
  FOR EACH ROW EXECUTE FUNCTION public.update_interactive_updated_at();

CREATE TRIGGER update_interactive_learning_preferences_updated_at
  BEFORE UPDATE ON public.interactive_learning_preferences
  FOR EACH ROW EXECUTE FUNCTION public.update_interactive_updated_at();