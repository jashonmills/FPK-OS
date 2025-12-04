-- ============================================================================
-- PHASE 1: DATABASE FOUNDATION - Multi-Tenant Logging System
-- ============================================================================

-- ============================================================================
-- 1. EXPAND EDUCATOR_LOGS TABLE
-- ============================================================================
ALTER TABLE public.educator_logs
ADD COLUMN IF NOT EXISTS log_time TEXT,
ADD COLUMN IF NOT EXISTS session_start_time TEXT,
ADD COLUMN IF NOT EXISTS session_end_time TEXT,
ADD COLUMN IF NOT EXISTS subject_area TEXT,
ADD COLUMN IF NOT EXISTS lesson_topic TEXT,
ADD COLUMN IF NOT EXISTS teaching_method TEXT,
ADD COLUMN IF NOT EXISTS materials_used TEXT[],
ADD COLUMN IF NOT EXISTS skills_practiced TEXT[],
ADD COLUMN IF NOT EXISTS performance_level TEXT,
ADD COLUMN IF NOT EXISTS engagement_level TEXT,
ADD COLUMN IF NOT EXISTS prompting_level TEXT,
ADD COLUMN IF NOT EXISTS correct_responses NUMERIC,
ADD COLUMN IF NOT EXISTS total_attempts NUMERIC,
ADD COLUMN IF NOT EXISTS accuracy_percentage NUMERIC,
ADD COLUMN IF NOT EXISTS strengths_observed TEXT,
ADD COLUMN IF NOT EXISTS areas_for_improvement TEXT,
ADD COLUMN IF NOT EXISTS next_steps TEXT,
ADD COLUMN IF NOT EXISTS iep_goal_addressed TEXT,
ADD COLUMN IF NOT EXISTS modifications_used TEXT[],
ADD COLUMN IF NOT EXISTS attachments JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS tags TEXT[],
ADD COLUMN IF NOT EXISTS weather_condition TEXT,
ADD COLUMN IF NOT EXISTS weather_temp_f NUMERIC,
ADD COLUMN IF NOT EXISTS weather_temp_c NUMERIC,
ADD COLUMN IF NOT EXISTS weather_humidity NUMERIC,
ADD COLUMN IF NOT EXISTS weather_pressure_mb NUMERIC,
ADD COLUMN IF NOT EXISTS weather_wind_speed NUMERIC,
ADD COLUMN IF NOT EXISTS weather_fetched_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS aqi_us INTEGER,
ADD COLUMN IF NOT EXISTS pm25 NUMERIC,
ADD COLUMN IF NOT EXISTS pm10 NUMERIC;

-- ============================================================================
-- 2. CREATE INCIDENT_LOGS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.incident_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  family_id UUID REFERENCES public.families(id) ON DELETE CASCADE NOT NULL,
  student_id UUID REFERENCES public.students(id) ON DELETE CASCADE NOT NULL,
  
  incident_date DATE NOT NULL,
  incident_time TEXT NOT NULL,
  incident_type TEXT NOT NULL,
  severity TEXT NOT NULL,
  location TEXT NOT NULL,
  reporter_name TEXT NOT NULL,
  reporter_role TEXT NOT NULL,
  
  behavior_description TEXT NOT NULL,
  antecedent TEXT,
  consequence TEXT,
  intervention_used TEXT,
  environmental_factors TEXT[],
  
  duration_minutes NUMERIC,
  injuries BOOLEAN DEFAULT false,
  injury_details TEXT,
  witnesses TEXT[],
  
  parent_notified BOOLEAN DEFAULT false,
  notification_method TEXT,
  follow_up_required BOOLEAN DEFAULT false,
  follow_up_notes TEXT,
  
  weather_condition TEXT,
  weather_temp_f NUMERIC,
  weather_temp_c NUMERIC,
  weather_humidity NUMERIC,
  weather_pressure_mb NUMERIC,
  weather_wind_speed NUMERIC,
  weather_fetched_at TIMESTAMPTZ,
  aqi_us INTEGER,
  pm25 NUMERIC,
  pm10 NUMERIC,
  
  attachments JSONB DEFAULT '[]'::jsonb,
  tags TEXT[],
  created_by UUID NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.incident_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Family members can view incident logs"
ON public.incident_logs FOR SELECT
USING (is_family_member(auth.uid(), family_id));

CREATE POLICY "Family members can insert incident logs"
ON public.incident_logs FOR INSERT
WITH CHECK (is_family_member(auth.uid(), family_id) AND created_by = auth.uid());

CREATE POLICY "Creator or owner can update incident logs"
ON public.incident_logs FOR UPDATE
USING (created_by = auth.uid() OR is_family_owner(auth.uid(), family_id));

CREATE POLICY "Owner can delete incident logs"
ON public.incident_logs FOR DELETE
USING (is_family_owner(auth.uid(), family_id));

-- ============================================================================
-- 3. CREATE PARENT_LOGS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.parent_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  family_id UUID REFERENCES public.families(id) ON DELETE CASCADE NOT NULL,
  student_id UUID REFERENCES public.students(id) ON DELETE CASCADE NOT NULL,
  
  log_date DATE NOT NULL,
  log_time TEXT NOT NULL,
  reporter_name TEXT NOT NULL,
  location TEXT NOT NULL,
  activity_type TEXT NOT NULL,
  
  observation TEXT NOT NULL,
  mood TEXT,
  sensory_factors TEXT[],
  communication_attempts TEXT,
  
  successes TEXT,
  challenges TEXT,
  strategies_used TEXT,
  
  duration_minutes NUMERIC,
  
  weather_condition TEXT,
  weather_temp_f NUMERIC,
  weather_temp_c NUMERIC,
  weather_humidity NUMERIC,
  weather_pressure_mb NUMERIC,
  weather_wind_speed NUMERIC,
  weather_fetched_at TIMESTAMPTZ,
  aqi_us INTEGER,
  pm25 NUMERIC,
  pm10 NUMERIC,
  
  attachments JSONB DEFAULT '[]'::jsonb,
  notes TEXT,
  tags TEXT[],
  created_by UUID NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.parent_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Family members can view parent logs"
ON public.parent_logs FOR SELECT
USING (is_family_member(auth.uid(), family_id));

CREATE POLICY "Family members can insert parent logs"
ON public.parent_logs FOR INSERT
WITH CHECK (is_family_member(auth.uid(), family_id) AND created_by = auth.uid());

CREATE POLICY "Creator or owner can update parent logs"
ON public.parent_logs FOR UPDATE
USING (created_by = auth.uid() OR is_family_owner(auth.uid(), family_id));

CREATE POLICY "Owner can delete parent logs"
ON public.parent_logs FOR DELETE
USING (is_family_owner(auth.uid(), family_id));

-- ============================================================================
-- 4. CREATE SLEEP_RECORDS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.sleep_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  family_id UUID REFERENCES public.families(id) ON DELETE CASCADE NOT NULL,
  student_id UUID REFERENCES public.students(id) ON DELETE CASCADE NOT NULL,
  
  sleep_date DATE NOT NULL,
  bedtime TEXT NOT NULL,
  wake_time TEXT NOT NULL,
  total_sleep_hours NUMERIC,
  sleep_quality_rating INTEGER CHECK (sleep_quality_rating BETWEEN 1 AND 5),
  
  nighttime_awakenings INTEGER DEFAULT 0,
  sleep_disturbances TEXT[],
  disturbance_details TEXT,
  
  daytime_fatigue_level INTEGER CHECK (daytime_fatigue_level BETWEEN 1 AND 5),
  nap_taken BOOLEAN DEFAULT false,
  nap_duration_minutes INTEGER,
  nap_time TEXT,
  
  pre_bed_activities TEXT[],
  sleep_medication BOOLEAN DEFAULT false,
  medication_details TEXT,
  notes TEXT,
  
  created_by UUID NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.sleep_records ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Family members can view sleep records"
ON public.sleep_records FOR SELECT
USING (is_family_member(auth.uid(), family_id));

CREATE POLICY "Family members can insert sleep records"
ON public.sleep_records FOR INSERT
WITH CHECK (is_family_member(auth.uid(), family_id) AND created_by = auth.uid());

CREATE POLICY "Creator or owner can update sleep records"
ON public.sleep_records FOR UPDATE
USING (created_by = auth.uid() OR is_family_owner(auth.uid(), family_id));

CREATE POLICY "Owner can delete sleep records"
ON public.sleep_records FOR DELETE
USING (is_family_owner(auth.uid(), family_id));

-- ============================================================================
-- 5. CREATE NOTIFICATIONS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  reference_id UUID,
  reference_table TEXT,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own notifications"
ON public.notifications FOR SELECT
USING (user_id = auth.uid());

CREATE POLICY "Users can update their own notifications"
ON public.notifications FOR UPDATE
USING (user_id = auth.uid());

-- ============================================================================
-- 6. CREATE NOTIFICATION TRIGGER FUNCTION
-- ============================================================================
CREATE OR REPLACE FUNCTION notify_family_members()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.notifications (user_id, type, title, message, reference_id, reference_table)
  SELECT fm.user_id, TG_ARGV[0], TG_ARGV[1], TG_ARGV[2], NEW.id, TG_TABLE_NAME
  FROM public.family_members fm
  WHERE fm.family_id = NEW.family_id
    AND fm.user_id != NEW.created_by;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- 7. ATTACH NOTIFICATION TRIGGERS
-- ============================================================================
DROP TRIGGER IF EXISTS notify_new_incident ON public.incident_logs;
CREATE TRIGGER notify_new_incident
AFTER INSERT ON public.incident_logs
FOR EACH ROW EXECUTE FUNCTION notify_family_members('incident_log', 'New Incident Report', 'A new incident was logged');

DROP TRIGGER IF EXISTS notify_new_parent_log ON public.parent_logs;
CREATE TRIGGER notify_new_parent_log
AFTER INSERT ON public.parent_logs
FOR EACH ROW EXECUTE FUNCTION notify_family_members('parent_log', 'New Parent Log', 'A new observation was recorded');

DROP TRIGGER IF EXISTS notify_new_educator_log ON public.educator_logs;
CREATE TRIGGER notify_new_educator_log
AFTER INSERT ON public.educator_logs
FOR EACH ROW EXECUTE FUNCTION notify_family_members('educator_log', 'New Educator Log', 'A new educator session was logged');

DROP TRIGGER IF EXISTS notify_new_sleep_record ON public.sleep_records;
CREATE TRIGGER notify_new_sleep_record
AFTER INSERT ON public.sleep_records
FOR EACH ROW EXECUTE FUNCTION notify_family_members('sleep_record', 'New Sleep Record', 'A new sleep record was added');

-- ============================================================================
-- 8. CREATE UPDATED_AT TRIGGERS
-- ============================================================================
DROP TRIGGER IF EXISTS update_incident_logs_updated_at ON public.incident_logs;
CREATE TRIGGER update_incident_logs_updated_at
BEFORE UPDATE ON public.incident_logs
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_parent_logs_updated_at ON public.parent_logs;
CREATE TRIGGER update_parent_logs_updated_at
BEFORE UPDATE ON public.parent_logs
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_sleep_records_updated_at ON public.sleep_records;
CREATE TRIGGER update_sleep_records_updated_at
BEFORE UPDATE ON public.sleep_records
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================================================
-- 9. CREATE STORAGE BUCKET FOR LOG IMAGES
-- ============================================================================
INSERT INTO storage.buckets (id, name, public)
VALUES ('log-images', 'log-images', true)
ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- 10. CREATE STORAGE POLICIES
-- ============================================================================
CREATE POLICY "Anyone can view log images"
ON storage.objects FOR SELECT
USING (bucket_id = 'log-images');

CREATE POLICY "Authenticated users can upload log images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'log-images' AND auth.uid() IS NOT NULL);

CREATE POLICY "Users can delete their own log images"
ON storage.objects FOR DELETE
USING (bucket_id = 'log-images' AND auth.uid() IS NOT NULL);