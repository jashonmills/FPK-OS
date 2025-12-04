-- ========================================
-- UNIVERSAL ANALYTICS DASHBOARD SCHEMA
-- ========================================

-- Create goals table for universal goal tracking
CREATE TABLE public.goals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  family_id UUID REFERENCES public.families(id) ON DELETE CASCADE NOT NULL,
  student_id UUID REFERENCES public.students(id) ON DELETE CASCADE NOT NULL,
  goal_title TEXT NOT NULL,
  goal_description TEXT,
  goal_type TEXT NOT NULL CHECK (goal_type IN ('academic', 'behavioral', 'social', 'life_skill')),
  target_value NUMERIC,
  current_value NUMERIC DEFAULT 0,
  unit TEXT,
  start_date DATE DEFAULT CURRENT_DATE,
  target_date DATE,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.goals ENABLE ROW LEVEL SECURITY;

-- RLS Policies for goals
CREATE POLICY "Family members can manage their goals"
  ON public.goals FOR ALL
  USING (public.is_family_member(auth.uid(), family_id))
  WITH CHECK (public.is_family_member(auth.uid(), family_id));

-- Indexes for goals
CREATE INDEX idx_goals_family ON public.goals(family_id);
CREATE INDEX idx_goals_student ON public.goals(student_id);
CREATE INDEX idx_goals_active ON public.goals(is_active) WHERE is_active = true;

-- Trigger for updated_at on goals
CREATE TRIGGER update_goals_updated_at 
  BEFORE UPDATE ON public.goals
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ========================================
-- ANALYTICS SQL FUNCTIONS
-- ========================================

-- Function 1: Get daily log counts for the last N days
CREATE OR REPLACE FUNCTION public.get_daily_log_counts(
  p_family_id UUID,
  p_student_id UUID,
  p_days INTEGER DEFAULT 30
)
RETURNS TABLE (
  log_date DATE,
  incident_count BIGINT,
  parent_count BIGINT,
  educator_count BIGINT,
  total_count BIGINT
) 
LANGUAGE plpgsql
STABLE 
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  WITH date_series AS (
    SELECT generate_series(
      CURRENT_DATE - (p_days || ' days')::INTERVAL,
      CURRENT_DATE,
      '1 day'::INTERVAL
    )::DATE AS log_date
  ),
  incident_counts AS (
    SELECT incident_date AS log_date, COUNT(*) AS count
    FROM public.incident_logs
    WHERE family_id = p_family_id AND student_id = p_student_id
      AND incident_date >= CURRENT_DATE - (p_days || ' days')::INTERVAL
    GROUP BY incident_date
  ),
  parent_counts AS (
    SELECT log_date, COUNT(*) AS count
    FROM public.parent_logs
    WHERE family_id = p_family_id AND student_id = p_student_id
      AND log_date >= CURRENT_DATE - (p_days || ' days')::INTERVAL
    GROUP BY log_date
  ),
  educator_counts AS (
    SELECT log_date, COUNT(*) AS count
    FROM public.educator_logs
    WHERE family_id = p_family_id AND student_id = p_student_id
      AND log_date >= CURRENT_DATE - (p_days || ' days')::INTERVAL
    GROUP BY log_date
  )
  SELECT 
    ds.log_date,
    COALESCE(ic.count, 0) AS incident_count,
    COALESCE(pc.count, 0) AS parent_count,
    COALESCE(ec.count, 0) AS educator_count,
    COALESCE(ic.count, 0) + COALESCE(pc.count, 0) + COALESCE(ec.count, 0) AS total_count
  FROM date_series ds
  LEFT JOIN incident_counts ic ON ds.log_date = ic.log_date
  LEFT JOIN parent_counts pc ON ds.log_date = pc.log_date
  LEFT JOIN educator_counts ec ON ds.log_date = ec.log_date
  ORDER BY ds.log_date;
END;
$$;

-- Function 2: Get weekly mood distribution
CREATE OR REPLACE FUNCTION public.get_weekly_mood_counts(
  p_family_id UUID,
  p_student_id UUID
)
RETURNS TABLE (
  day_of_week TEXT,
  day_order INTEGER,
  mood TEXT,
  count BIGINT
)
LANGUAGE plpgsql
STABLE 
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    TRIM(TO_CHAR(log_date, 'Day')) AS day_of_week,
    CAST(TO_CHAR(log_date, 'D') AS INTEGER) AS day_order,
    mood,
    COUNT(*) AS count
  FROM public.parent_logs
  WHERE family_id = p_family_id 
    AND student_id = p_student_id
    AND log_date >= CURRENT_DATE - INTERVAL '7 days'
    AND mood IS NOT NULL
  GROUP BY TRIM(TO_CHAR(log_date, 'Day')), CAST(TO_CHAR(log_date, 'D') AS INTEGER), mood
  ORDER BY CAST(TO_CHAR(log_date, 'D') AS INTEGER), mood;
END;
$$;

-- Function 3: Get intervention effectiveness data
CREATE OR REPLACE FUNCTION public.get_intervention_effectiveness_data(
  p_family_id UUID,
  p_student_id UUID,
  p_days INTEGER DEFAULT 30
)
RETURNS TABLE (
  log_date DATE,
  incident_count BIGINT,
  intervention_count BIGINT
)
LANGUAGE plpgsql
STABLE 
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  WITH date_series AS (
    SELECT generate_series(
      CURRENT_DATE - (p_days || ' days')::INTERVAL,
      CURRENT_DATE,
      '1 day'::INTERVAL
    )::DATE AS log_date
  ),
  daily_incidents AS (
    SELECT incident_date AS log_date, COUNT(*) AS count
    FROM public.incident_logs
    WHERE family_id = p_family_id AND student_id = p_student_id
      AND incident_date >= CURRENT_DATE - (p_days || ' days')::INTERVAL
    GROUP BY incident_date
  ),
  daily_interventions AS (
    SELECT incident_date AS log_date, COUNT(*) AS count
    FROM public.incident_logs
    WHERE family_id = p_family_id AND student_id = p_student_id
      AND incident_date >= CURRENT_DATE - (p_days || ' days')::INTERVAL
      AND intervention_used IS NOT NULL
    GROUP BY incident_date
  )
  SELECT 
    ds.log_date,
    COALESCE(di.count, 0) AS incident_count,
    COALESCE(dint.count, 0) AS intervention_count
  FROM date_series ds
  LEFT JOIN daily_incidents di ON ds.log_date = di.log_date
  LEFT JOIN daily_interventions dint ON ds.log_date = dint.log_date
  ORDER BY ds.log_date;
END;
$$;

-- Function 4: Get sleep summary data
CREATE OR REPLACE FUNCTION public.get_sleep_summary_data(
  p_family_id UUID,
  p_student_id UUID,
  p_days INTEGER DEFAULT 30
)
RETURNS TABLE (
  sleep_date DATE,
  total_sleep_hours NUMERIC,
  sleep_quality_rating INTEGER,
  nap_taken BOOLEAN
)
LANGUAGE plpgsql
STABLE 
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    sleep_date,
    total_sleep_hours,
    sleep_quality_rating,
    nap_taken
  FROM public.sleep_records
  WHERE family_id = p_family_id 
    AND student_id = p_student_id
    AND sleep_date >= CURRENT_DATE - (p_days || ' days')::INTERVAL
  ORDER BY sleep_date;
END;
$$;