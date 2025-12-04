-- Enhanced Analytics Infrastructure for Slide-Level and Behavioral Tracking

-- Slide-level tracking table
CREATE TABLE public.slide_analytics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  course_id TEXT NOT NULL,
  lesson_id TEXT,
  slide_id TEXT NOT NULL,
  slide_title TEXT,
  event_type TEXT NOT NULL, -- 'view_start', 'view_end', 'interaction', 'completion'
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  duration_seconds INTEGER DEFAULT 0,
  interaction_data JSONB DEFAULT '{}',
  completion_status TEXT DEFAULT 'not_started', -- 'not_started', 'in_progress', 'completed'
  attention_score NUMERIC DEFAULT 0, -- 0-100 attention level
  cognitive_load_indicator NUMERIC DEFAULT 0, -- 0-100 difficulty perception
  metadata JSONB DEFAULT '{}'
);

-- Behavioral analytics table
CREATE TABLE public.behavioral_analytics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  session_id TEXT NOT NULL,
  behavior_type TEXT NOT NULL, -- 'attention_pattern', 'self_regulation', 'learning_style', 'energy_level'
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  behavior_data JSONB NOT NULL DEFAULT '{}',
  context_metadata JSONB DEFAULT '{}', -- course, lesson, slide context
  pattern_indicators JSONB DEFAULT '{}' -- detected patterns
);

-- Adaptive learning paths table
CREATE TABLE public.adaptive_learning_paths (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  learning_profile JSONB NOT NULL DEFAULT '{}', -- detected learning preferences
  path_recommendations JSONB NOT NULL DEFAULT '[]',
  effectiveness_score NUMERIC DEFAULT 0, -- how well this path works for user
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  is_active BOOLEAN DEFAULT true
);

-- Real-time recommendations table  
CREATE TABLE public.ai_recommendations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  recommendation_type TEXT NOT NULL, -- 'content_adjustment', 'break_suggestion', 'difficulty_change', 'format_change'
  recommendation_data JSONB NOT NULL DEFAULT '{}',
  trigger_context JSONB NOT NULL DEFAULT '{}', -- what caused this recommendation
  applied_at TIMESTAMP WITH TIME ZONE,
  effectiveness_rating INTEGER, -- user feedback 1-5
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE
);

-- Enhanced lesson progress with granular tracking
CREATE TABLE public.lesson_progress_detailed (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  course_id TEXT NOT NULL,
  lesson_id TEXT NOT NULL,
  slide_id TEXT,
  progress_percentage NUMERIC DEFAULT 0,
  time_spent_seconds INTEGER DEFAULT 0,
  interaction_count INTEGER DEFAULT 0,
  attention_metrics JSONB DEFAULT '{}',
  learning_velocity NUMERIC DEFAULT 0, -- slides per minute
  difficulty_perception NUMERIC DEFAULT 0, -- user's perceived difficulty
  completion_quality JSONB DEFAULT '{}', -- quality indicators
  last_interaction_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, course_id, lesson_id, slide_id)
);

-- Indexes for performance
CREATE INDEX idx_slide_analytics_user_course ON slide_analytics(user_id, course_id);
CREATE INDEX idx_slide_analytics_timestamp ON slide_analytics(timestamp);
CREATE INDEX idx_behavioral_analytics_user_session ON behavioral_analytics(user_id, session_id);
CREATE INDEX idx_behavioral_analytics_type ON behavioral_analytics(behavior_type);
CREATE INDEX idx_adaptive_paths_user ON adaptive_learning_paths(user_id);
CREATE INDEX idx_ai_recommendations_user ON ai_recommendations(user_id);
CREATE INDEX idx_lesson_progress_detailed_user_course ON lesson_progress_detailed(user_id, course_id);

-- Enable RLS
ALTER TABLE slide_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE behavioral_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE adaptive_learning_paths ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE lesson_progress_detailed ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can manage their own slide analytics" ON slide_analytics
FOR ALL USING (user_id = auth.uid());

CREATE POLICY "Users can manage their own behavioral analytics" ON behavioral_analytics  
FOR ALL USING (user_id = auth.uid());

CREATE POLICY "Users can view their own learning paths" ON adaptive_learning_paths
FOR ALL USING (user_id = auth.uid());

CREATE POLICY "Users can view their own recommendations" ON ai_recommendations
FOR ALL USING (user_id = auth.uid());

CREATE POLICY "Users can manage their detailed progress" ON lesson_progress_detailed
FOR ALL USING (user_id = auth.uid());

-- Admin policies
CREATE POLICY "Admins can view all analytics" ON slide_analytics
FOR SELECT USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can view all behavioral data" ON behavioral_analytics
FOR SELECT USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can view all learning paths" ON adaptive_learning_paths
FOR SELECT USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can manage all recommendations" ON ai_recommendations
FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can view all detailed progress" ON lesson_progress_detailed
FOR SELECT USING (has_role(auth.uid(), 'admin'::app_role));