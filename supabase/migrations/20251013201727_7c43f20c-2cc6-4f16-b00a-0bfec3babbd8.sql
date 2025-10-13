-- Add source column to coach_sessions
ALTER TABLE public.coach_sessions 
ADD COLUMN IF NOT EXISTS source TEXT DEFAULT 'fpk_university';

-- Add source column to ai_credit_transactions
ALTER TABLE public.ai_credit_transactions 
ADD COLUMN IF NOT EXISTS source TEXT DEFAULT 'fpk_university';

-- Add source column to socratic_sessions
ALTER TABLE public.socratic_sessions 
ADD COLUMN IF NOT EXISTS source TEXT DEFAULT 'fpk_university';

-- Add source column to socratic_turns
ALTER TABLE public.socratic_turns 
ADD COLUMN IF NOT EXISTS source TEXT DEFAULT 'fpk_university';

-- Create index for efficient filtering
CREATE INDEX IF NOT EXISTS idx_coach_sessions_source ON public.coach_sessions(user_id, source);
CREATE INDEX IF NOT EXISTS idx_socratic_sessions_source ON public.socratic_sessions(user_id, source);
CREATE INDEX IF NOT EXISTS idx_ai_credit_transactions_source ON public.ai_credit_transactions(user_id, source);

-- Update existing analytics functions to support source filtering
CREATE OR REPLACE FUNCTION public.get_coach_streak(p_user_id UUID, p_source TEXT DEFAULT NULL)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_streak INTEGER := 0;
  v_check_date DATE := CURRENT_DATE;
  v_has_activity BOOLEAN;
BEGIN
  LOOP
    SELECT EXISTS(
      SELECT 1 FROM socratic_sessions
      WHERE user_id = p_user_id
      AND DATE(created_at) = v_check_date
      AND (p_source IS NULL OR source = p_source)
    ) INTO v_has_activity;
    
    EXIT WHEN NOT v_has_activity;
    
    v_streak := v_streak + 1;
    v_check_date := v_check_date - INTERVAL '1 day';
    
    EXIT WHEN v_streak > 365;
  END LOOP;
  
  RETURN v_streak;
END;
$$;

CREATE OR REPLACE FUNCTION public.get_coach_mastery_score(p_user_id UUID, p_source TEXT DEFAULT NULL)
RETURNS NUMERIC
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_avg_score NUMERIC;
BEGIN
  SELECT COALESCE(AVG(
    CASE 
      WHEN array_length(score_history, 1) > 0 THEN
        (SELECT AVG(s::NUMERIC) FROM unnest(score_history) s)
      ELSE 0
    END
  ), 0)
  INTO v_avg_score
  FROM socratic_sessions
  WHERE user_id = p_user_id
  AND (p_source IS NULL OR source = p_source);
  
  RETURN ROUND(v_avg_score, 1);
END;
$$;

CREATE OR REPLACE FUNCTION public.get_coach_learning_time(p_user_id UUID, p_source TEXT DEFAULT NULL)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_total_minutes INTEGER;
BEGIN
  SELECT COALESCE(
    (SELECT COUNT(*) * 5 FROM socratic_turns st
     JOIN socratic_sessions ss ON ss.id = st.session_id
     WHERE ss.user_id = p_user_id
     AND (p_source IS NULL OR ss.source = p_source)),
    0
  )
  INTO v_total_minutes;
  
  RETURN v_total_minutes;
END;
$$;

CREATE OR REPLACE FUNCTION public.get_coach_topics(p_user_id UUID, p_source TEXT DEFAULT NULL)
RETURNS TEXT[]
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_topics TEXT[];
BEGIN
  SELECT ARRAY_AGG(DISTINCT topic)
  INTO v_topics
  FROM socratic_sessions
  WHERE user_id = p_user_id
  AND topic IS NOT NULL
  AND (p_source IS NULL OR source = p_source);
  
  RETURN COALESCE(v_topics, ARRAY[]::TEXT[]);
END;
$$;

CREATE OR REPLACE FUNCTION public.get_coach_mode_ratio(p_user_id UUID, p_source TEXT DEFAULT NULL)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_socratic_count INTEGER;
  v_total_sessions INTEGER;
  v_ratio JSONB;
BEGIN
  SELECT COUNT(*) INTO v_socratic_count
  FROM socratic_sessions
  WHERE user_id = p_user_id
  AND (p_source IS NULL OR source = p_source);
  
  SELECT COUNT(*) INTO v_total_sessions
  FROM coach_sessions
  WHERE user_id = p_user_id
  AND (p_source IS NULL OR source = p_source);
  
  v_total_sessions := v_total_sessions + v_socratic_count;
  
  v_ratio := jsonb_build_object(
    'socratic', v_socratic_count,
    'freeChat', v_total_sessions - v_socratic_count,
    'socraticPercent', CASE 
      WHEN v_total_sessions > 0 THEN ROUND((v_socratic_count::NUMERIC / v_total_sessions) * 100)
      ELSE 0
    END,
    'total', v_total_sessions
  );
  
  RETURN v_ratio;
END;
$$;