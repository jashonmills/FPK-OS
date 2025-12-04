-- Phase 1: Performance Logging Table
CREATE TABLE IF NOT EXISTS public.phoenix_performance_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID REFERENCES public.phoenix_conversations(id) ON DELETE CASCADE,
  message_id UUID REFERENCES public.phoenix_messages(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Timing Metrics (in milliseconds)
  total_duration INTEGER NOT NULL,
  time_to_first_token INTEGER,
  intent_detection_duration INTEGER,
  context_loading_duration INTEGER,
  llm_response_duration INTEGER,
  governor_check_duration INTEGER,
  tts_generation_duration INTEGER,
  
  -- Metadata
  persona persona_type NOT NULL,
  intent message_intent,
  feature_flags_snapshot JSONB DEFAULT '{}'::jsonb,
  error_occurred BOOLEAN DEFAULT false,
  error_message TEXT,
  intent_was_misinterpreted BOOLEAN DEFAULT false,
  correction_message TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Phase 2: User Feedback Table
CREATE TABLE IF NOT EXISTS public.phoenix_user_feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID REFERENCES public.phoenix_conversations(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  message_id UUID REFERENCES public.phoenix_messages(id) ON DELETE CASCADE,
  
  feedback_type TEXT NOT NULL CHECK (feedback_type IN ('escape_hatch', 'correction', 'confusion', 'repetition', 'frustration')),
  user_message TEXT NOT NULL,
  previous_ai_message TEXT,
  persona_before_feedback persona_type,
  session_turn_count INTEGER,
  context JSONB DEFAULT '{}'::jsonb,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Phase 3: Nite Owl Events Table
CREATE TABLE IF NOT EXISTS public.phoenix_nite_owl_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID REFERENCES public.phoenix_conversations(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  message_id UUID REFERENCES public.phoenix_messages(id) ON DELETE CASCADE,
  
  trigger_reason TEXT NOT NULL CHECK (trigger_reason IN ('random_timer', 'struggle_detected', 'manual_override')),
  socratic_turn_count INTEGER,
  turns_since_last_nite_owl INTEGER,
  user_frustration_score NUMERIC(3,2),
  context_snapshot JSONB DEFAULT '{}'::jsonb,
  
  was_helpful BOOLEAN,
  user_continued_after BOOLEAN,
  session_ended_after BOOLEAN,
  time_to_next_message_ms INTEGER,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Phase 5: Feature Usage Table
CREATE TABLE IF NOT EXISTS public.phoenix_feature_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID REFERENCES public.phoenix_conversations(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  message_id UUID REFERENCES public.phoenix_messages(id) ON DELETE CASCADE,
  
  feature_name TEXT NOT NULL,
  was_enabled BOOLEAN NOT NULL,
  was_triggered BOOLEAN NOT NULL,
  was_executed BOOLEAN NOT NULL,
  was_successful BOOLEAN,
  error_message TEXT,
  execution_duration_ms INTEGER,
  config_snapshot JSONB DEFAULT '{}'::jsonb,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on all tables
ALTER TABLE public.phoenix_performance_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.phoenix_user_feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.phoenix_nite_owl_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.phoenix_feature_usage ENABLE ROW LEVEL SECURITY;

-- RLS Policies for phoenix_performance_logs
CREATE POLICY "Users can view their own performance logs"
  ON public.phoenix_performance_logs
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Admins can view all performance logs"
  ON public.phoenix_performance_logs
  FOR SELECT
  TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "System can insert performance logs"
  ON public.phoenix_performance_logs
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- RLS Policies for phoenix_user_feedback
CREATE POLICY "Users can view their own feedback"
  ON public.phoenix_user_feedback
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Admins can view all feedback"
  ON public.phoenix_user_feedback
  FOR SELECT
  TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "System can insert feedback"
  ON public.phoenix_user_feedback
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- RLS Policies for phoenix_nite_owl_events
CREATE POLICY "Users can view their own nite owl events"
  ON public.phoenix_nite_owl_events
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Admins can view all nite owl events"
  ON public.phoenix_nite_owl_events
  FOR SELECT
  TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "System can manage nite owl events"
  ON public.phoenix_nite_owl_events
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- RLS Policies for phoenix_feature_usage
CREATE POLICY "Users can view their own feature usage"
  ON public.phoenix_feature_usage
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Admins can view all feature usage"
  ON public.phoenix_feature_usage
  FOR SELECT
  TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "System can insert feature usage"
  ON public.phoenix_feature_usage
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Create indexes for performance
CREATE INDEX idx_perf_logs_user_created ON public.phoenix_performance_logs(user_id, created_at DESC);
CREATE INDEX idx_perf_logs_conversation ON public.phoenix_performance_logs(conversation_id, created_at DESC);
CREATE INDEX idx_feedback_user_created ON public.phoenix_user_feedback(user_id, created_at DESC);
CREATE INDEX idx_nite_owl_user_created ON public.phoenix_nite_owl_events(user_id, created_at DESC);
CREATE INDEX idx_feature_usage_name ON public.phoenix_feature_usage(feature_name, created_at DESC);