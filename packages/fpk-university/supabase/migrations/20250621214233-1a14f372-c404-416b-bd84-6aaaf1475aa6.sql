
-- Add missing columns and tables for comprehensive analytics tracking

-- Add topic tracking to chat sessions
ALTER TABLE chat_sessions ADD COLUMN IF NOT EXISTS topics jsonb DEFAULT '[]'::jsonb;

-- Create knowledge base usage tracking table
CREATE TABLE IF NOT EXISTS knowledge_base_usage (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id),
  query text NOT NULL,
  result_count integer DEFAULT 0,
  source_type text NOT NULL, -- 'search', 'chat', 'browse'
  created_at timestamp with time zone DEFAULT now()
);

-- Enable RLS on knowledge_base_usage
ALTER TABLE knowledge_base_usage ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for knowledge_base_usage
CREATE POLICY "Users can view their own knowledge base usage" 
  ON knowledge_base_usage FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own knowledge base usage records" 
  ON knowledge_base_usage FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Create daily activity tracking table
CREATE TABLE IF NOT EXISTS daily_activities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id),
  activity_date date NOT NULL DEFAULT CURRENT_DATE,
  activity_type text NOT NULL, -- 'study', 'reading', 'chat', 'notes', 'goals'
  duration_minutes integer DEFAULT 0,
  sessions_count integer DEFAULT 1,
  created_at timestamp with time zone DEFAULT now(),
  UNIQUE(user_id, activity_date, activity_type)
);

-- Enable RLS on daily_activities
ALTER TABLE daily_activities ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for daily_activities
CREATE POLICY "Users can view their own daily activities" 
  ON daily_activities FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own daily activities" 
  ON daily_activities FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own daily activities" 
  ON daily_activities FOR UPDATE 
  USING (auth.uid() = user_id);

-- Add search tracking columns to existing tables if they don't exist
ALTER TABLE reading_sessions ADD COLUMN IF NOT EXISTS search_query text;
ALTER TABLE reading_sessions ADD COLUMN IF NOT EXISTS book_category text;

-- Create function to extract topics from chat messages using AI
CREATE OR REPLACE FUNCTION extract_chat_topics(session_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  topics jsonb := '[]'::jsonb;
  message_content text;
BEGIN
  -- Simple keyword-based topic extraction (can be enhanced with AI later)
  FOR message_content IN 
    SELECT content FROM chat_messages 
    WHERE chat_messages.session_id = extract_chat_topics.session_id
  LOOP
    -- Basic topic detection based on keywords
    IF message_content ILIKE '%study%' OR message_content ILIKE '%learning%' THEN
      topics := topics || '["Learning Strategies"]'::jsonb;
    END IF;
    IF message_content ILIKE '%memory%' OR message_content ILIKE '%remember%' THEN
      topics := topics || '["Memory Improvement"]'::jsonb;
    END IF;
    IF message_content ILIKE '%focus%' OR message_content ILIKE '%concentration%' THEN
      topics := topics || '["Focus & Concentration"]'::jsonb;
    END IF;
    IF message_content ILIKE '%time%' OR message_content ILIKE '%schedule%' THEN
      topics := topics || '["Time Management"]'::jsonb;
    END IF;
    IF message_content ILIKE '%technique%' OR message_content ILIKE '%method%' THEN
      topics := topics || '["Study Techniques"]'::jsonb;
    END IF;
  END LOOP;
  
  -- Remove duplicates and return
  RETURN (SELECT jsonb_agg(DISTINCT topic) FROM jsonb_array_elements_text(topics) AS topic);
END;
$$;

-- Create function to get user activity heatmap data
CREATE OR REPLACE FUNCTION get_activity_heatmap(user_uuid uuid, days_back integer DEFAULT 30)
RETURNS TABLE(
  activity_date date,
  hour_of_day integer,
  activity_count integer,
  total_duration_minutes integer
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  WITH activity_hours AS (
    -- Study sessions
    SELECT 
      DATE(created_at) as activity_date,
      EXTRACT(hour FROM created_at)::integer as hour_of_day,
      1 as activity_count,
      COALESCE(session_duration_seconds / 60, 0)::integer as duration_minutes
    FROM study_sessions 
    WHERE user_id = user_uuid 
      AND created_at >= CURRENT_DATE - INTERVAL '%s days' % days_back
    
    UNION ALL
    
    -- Reading sessions
    SELECT 
      DATE(session_start) as activity_date,
      EXTRACT(hour FROM session_start)::integer as hour_of_day,
      1 as activity_count,
      COALESCE(duration_seconds / 60, 0)::integer as duration_minutes
    FROM reading_sessions 
    WHERE user_id = user_uuid 
      AND session_start >= CURRENT_DATE - INTERVAL '%s days' % days_back
    
    UNION ALL
    
    -- Chat sessions
    SELECT 
      DATE(created_at) as activity_date,
      EXTRACT(hour FROM created_at)::integer as hour_of_day,
      1 as activity_count,
      5 as duration_minutes -- Estimate 5 minutes per chat session
    FROM chat_sessions 
    WHERE user_id = user_uuid 
      AND created_at >= CURRENT_DATE - INTERVAL '%s days' % days_back
  )
  SELECT 
    ah.activity_date,
    ah.hour_of_day,
    COUNT(*)::integer as activity_count,
    SUM(ah.duration_minutes)::integer as total_duration_minutes
  FROM activity_hours ah
  GROUP BY ah.activity_date, ah.hour_of_day
  ORDER BY ah.activity_date DESC, ah.hour_of_day;
END;
$$;

-- Update existing chat sessions with topics (one-time migration)
UPDATE chat_sessions 
SET topics = extract_chat_topics(id) 
WHERE topics IS NULL OR topics = '[]'::jsonb;
