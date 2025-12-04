-- ============================================
-- OPERATION FIRST LIGHT: BILINGUAL DATABASE LAYER  
-- Phase 1-3: Complete RPC Function Suite
-- ============================================

-- ============================================
-- PHASE 1B: ACTIVITY LOG BILINGUAL RPCs
-- ============================================

-- Function: log_incident (Bilingual)
CREATE OR REPLACE FUNCTION public.log_incident(
  p_client_id UUID,
  p_incident_data JSONB
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO public
AS $$
DECLARE
  v_family_id UUID;
  v_org_id UUID;
  v_use_new_model BOOLEAN;
  v_incident_id UUID;
BEGIN
  -- Get client context
  SELECT family_id, organization_id INTO v_family_id, v_org_id
  FROM client_access
  WHERE client_id = p_client_id AND status = 'active'
  ORDER BY granted_at DESC
  LIMIT 1;
  
  IF v_family_id IS NULL AND v_org_id IS NULL THEN
    RAISE EXCEPTION 'Client not found or access denied';
  END IF;
  
  -- Check feature flag
  IF v_family_id IS NOT NULL THEN
    SELECT COALESCE((metadata->'feature_flags'->>'use_new_client_model')::boolean, false)
    INTO v_use_new_model
    FROM families WHERE id = v_family_id;
  ELSE
    SELECT COALESCE((metadata->'feature_flags'->>'use_new_client_model')::boolean, false)
    INTO v_use_new_model
    FROM organizations WHERE id = v_org_id;
  END IF;
  
  -- Insert incident log
  INSERT INTO incident_logs (
    family_id,
    student_id,
    client_id,
    created_by,
    incident_date,
    incident_time,
    incident_type,
    severity,
    location,
    reporter_name,
    reporter_role,
    behavior_description,
    antecedent,
    consequence,
    intervention_used,
    duration_minutes,
    injuries,
    injury_details,
    parent_notified,
    notification_method,
    follow_up_required,
    follow_up_notes,
    environmental_factors,
    witnesses,
    tags,
    weather_temp_f,
    weather_temp_c,
    weather_condition,
    weather_humidity,
    weather_pressure_mb,
    weather_wind_speed,
    weather_fetched_at,
    aqi_us,
    aqi_european,
    pm25,
    pm10,
    co,
    no2,
    o3,
    so2,
    pollen_grass,
    pollen_birch,
    pollen_olive,
    pollen_ragweed,
    pollen_mugwort,
    pollen_alder,
    air_quality_fetched_at,
    attachments
  ) VALUES (
    COALESCE(v_family_id, (p_incident_data->>'family_id')::UUID),
    CASE WHEN v_use_new_model THEN NULL ELSE (p_incident_data->>'student_id')::UUID END,
    CASE WHEN v_use_new_model THEN p_client_id ELSE NULL END,
    (p_incident_data->>'created_by')::UUID,
    (p_incident_data->>'incident_date')::DATE,
    (p_incident_data->>'incident_time')::TIME,
    p_incident_data->>'incident_type',
    p_incident_data->>'severity',
    p_incident_data->>'location',
    p_incident_data->>'reporter_name',
    p_incident_data->>'reporter_role',
    p_incident_data->>'behavior_description',
    p_incident_data->>'antecedent',
    p_incident_data->>'consequence',
    p_incident_data->>'intervention_used',
    (p_incident_data->>'duration_minutes')::INTEGER,
    COALESCE((p_incident_data->>'injuries')::BOOLEAN, false),
    p_incident_data->>'injury_details',
    COALESCE((p_incident_data->>'parent_notified')::BOOLEAN, false),
    p_incident_data->>'notification_method',
    COALESCE((p_incident_data->>'follow_up_required')::BOOLEAN, false),
    p_incident_data->>'follow_up_notes',
    CASE WHEN p_incident_data->'environmental_factors' IS NOT NULL THEN 
      ARRAY(SELECT jsonb_array_elements_text(p_incident_data->'environmental_factors'))
    ELSE NULL END,
    CASE WHEN p_incident_data->'witnesses' IS NOT NULL THEN 
      ARRAY(SELECT jsonb_array_elements_text(p_incident_data->'witnesses'))
    ELSE NULL END,
    CASE WHEN p_incident_data->'tags' IS NOT NULL THEN 
      ARRAY(SELECT jsonb_array_elements_text(p_incident_data->'tags'))
    ELSE NULL END,
    (p_incident_data->>'weather_temp_f')::NUMERIC,
    (p_incident_data->>'weather_temp_c')::NUMERIC,
    p_incident_data->>'weather_condition',
    (p_incident_data->>'weather_humidity')::NUMERIC,
    (p_incident_data->>'weather_pressure_mb')::NUMERIC,
    (p_incident_data->>'weather_wind_speed')::NUMERIC,
    (p_incident_data->>'weather_fetched_at')::TIMESTAMPTZ,
    (p_incident_data->>'aqi_us')::NUMERIC,
    (p_incident_data->>'aqi_european')::NUMERIC,
    (p_incident_data->>'pm25')::NUMERIC,
    (p_incident_data->>'pm10')::NUMERIC,
    (p_incident_data->>'co')::NUMERIC,
    (p_incident_data->>'no2')::NUMERIC,
    (p_incident_data->>'o3')::NUMERIC,
    (p_incident_data->>'so2')::NUMERIC,
    (p_incident_data->>'pollen_grass')::NUMERIC,
    (p_incident_data->>'pollen_birch')::NUMERIC,
    (p_incident_data->>'pollen_olive')::NUMERIC,
    (p_incident_data->>'pollen_ragweed')::NUMERIC,
    (p_incident_data->>'pollen_mugwort')::NUMERIC,
    (p_incident_data->>'pollen_alder')::NUMERIC,
    (p_incident_data->>'air_quality_fetched_at')::TIMESTAMPTZ,
    CASE WHEN p_incident_data->'attachments' IS NOT NULL THEN 
      p_incident_data->'attachments'
    ELSE '[]'::JSONB END
  )
  RETURNING id INTO v_incident_id;
  
  -- Auto-queue for embedding
  INSERT INTO embedding_queue (
    family_id,
    organization_id,
    student_id,
    client_id,
    source_table,
    source_id,
    status
  ) VALUES (
    v_family_id,
    v_org_id,
    CASE WHEN v_use_new_model THEN NULL ELSE (p_incident_data->>'student_id')::UUID END,
    CASE WHEN v_use_new_model THEN p_client_id ELSE NULL END,
    'incident_logs',
    v_incident_id,
    'pending'
  );
  
  RETURN v_incident_id;
END;
$$;

-- Function: log_parent_observation (Bilingual)
CREATE OR REPLACE FUNCTION public.log_parent_observation(
  p_client_id UUID,
  p_log_data JSONB
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO public
AS $$
DECLARE
  v_family_id UUID;
  v_org_id UUID;
  v_use_new_model BOOLEAN;
  v_log_id UUID;
BEGIN
  -- Get client context
  SELECT family_id, organization_id INTO v_family_id, v_org_id
  FROM client_access
  WHERE client_id = p_client_id AND status = 'active'
  ORDER BY granted_at DESC
  LIMIT 1;
  
  IF v_family_id IS NULL AND v_org_id IS NULL THEN
    RAISE EXCEPTION 'Client not found or access denied';
  END IF;
  
  -- Check feature flag
  IF v_family_id IS NOT NULL THEN
    SELECT COALESCE((metadata->'feature_flags'->>'use_new_client_model')::boolean, false)
    INTO v_use_new_model
    FROM families WHERE id = v_family_id;
  ELSE
    SELECT COALESCE((metadata->'feature_flags'->>'use_new_client_model')::boolean, false)
    INTO v_use_new_model
    FROM organizations WHERE id = v_org_id;
  END IF;
  
  -- Insert parent log
  INSERT INTO parent_logs (
    family_id,
    student_id,
    client_id,
    created_by,
    log_date,
    log_time,
    reporter_name,
    location,
    activity_type,
    observation,
    mood,
    sensory_factors,
    communication_attempts,
    successes,
    challenges,
    strategies_used,
    duration_minutes,
    notes,
    tags,
    weather_temp_f,
    weather_temp_c,
    weather_condition,
    weather_humidity,
    weather_pressure_mb,
    weather_wind_speed,
    weather_fetched_at,
    aqi_us,
    aqi_european,
    pm25,
    pm10,
    co,
    no2,
    o3,
    so2,
    pollen_grass,
    pollen_birch,
    pollen_olive,
    pollen_ragweed,
    pollen_mugwort,
    pollen_alder,
    air_quality_fetched_at,
    attachments
  ) VALUES (
    COALESCE(v_family_id, (p_log_data->>'family_id')::UUID),
    CASE WHEN v_use_new_model THEN NULL ELSE (p_log_data->>'student_id')::UUID END,
    CASE WHEN v_use_new_model THEN p_client_id ELSE NULL END,
    (p_log_data->>'created_by')::UUID,
    (p_log_data->>'log_date')::DATE,
    (p_log_data->>'log_time')::TIME,
    p_log_data->>'reporter_name',
    p_log_data->>'location',
    p_log_data->>'activity_type',
    p_log_data->>'observation',
    p_log_data->>'mood',
    CASE WHEN p_log_data->'sensory_factors' IS NOT NULL THEN 
      ARRAY(SELECT jsonb_array_elements_text(p_log_data->'sensory_factors'))
    ELSE NULL END,
    p_log_data->>'communication_attempts',
    p_log_data->>'successes',
    p_log_data->>'challenges',
    p_log_data->>'strategies_used',
    (p_log_data->>'duration_minutes')::INTEGER,
    p_log_data->>'notes',
    CASE WHEN p_log_data->'tags' IS NOT NULL THEN 
      ARRAY(SELECT jsonb_array_elements_text(p_log_data->'tags'))
    ELSE NULL END,
    (p_log_data->>'weather_temp_f')::NUMERIC,
    (p_log_data->>'weather_temp_c')::NUMERIC,
    p_log_data->>'weather_condition',
    (p_log_data->>'weather_humidity')::NUMERIC,
    (p_log_data->>'weather_pressure_mb')::NUMERIC,
    (p_log_data->>'weather_wind_speed')::NUMERIC,
    (p_log_data->>'weather_fetched_at')::TIMESTAMPTZ,
    (p_log_data->>'aqi_us')::NUMERIC,
    (p_log_data->>'aqi_european')::NUMERIC,
    (p_log_data->>'pm25')::NUMERIC,
    (p_log_data->>'pm10')::NUMERIC,
    (p_log_data->>'co')::NUMERIC,
    (p_log_data->>'no2')::NUMERIC,
    (p_log_data->>'o3')::NUMERIC,
    (p_log_data->>'so2')::NUMERIC,
    (p_log_data->>'pollen_grass')::NUMERIC,
    (p_log_data->>'pollen_birch')::NUMERIC,
    (p_log_data->>'pollen_olive')::NUMERIC,
    (p_log_data->>'pollen_ragweed')::NUMERIC,
    (p_log_data->>'pollen_mugwort')::NUMERIC,
    (p_log_data->>'pollen_alder')::NUMERIC,
    (p_log_data->>'air_quality_fetched_at')::TIMESTAMPTZ,
    CASE WHEN p_log_data->'attachments' IS NOT NULL THEN 
      p_log_data->'attachments'
    ELSE '[]'::JSONB END
  )
  RETURNING id INTO v_log_id;
  
  -- Auto-queue for embedding
  INSERT INTO embedding_queue (
    family_id,
    organization_id,
    student_id,
    client_id,
    source_table,
    source_id,
    status
  ) VALUES (
    v_family_id,
    v_org_id,
    CASE WHEN v_use_new_model THEN NULL ELSE (p_log_data->>'student_id')::UUID END,
    CASE WHEN v_use_new_model THEN p_client_id ELSE NULL END,
    'parent_logs',
    v_log_id,
    'pending'
  );
  
  RETURN v_log_id;
END;
$$;

-- Function: log_educator_note (Bilingual)
CREATE OR REPLACE FUNCTION public.log_educator_note(
  p_client_id UUID,
  p_log_data JSONB
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO public
AS $$
DECLARE
  v_family_id UUID;
  v_org_id UUID;
  v_use_new_model BOOLEAN;
  v_log_id UUID;
  v_accuracy NUMERIC;
BEGIN
  -- Get client context
  SELECT family_id, organization_id INTO v_family_id, v_org_id
  FROM client_access
  WHERE client_id = p_client_id AND status = 'active'
  ORDER BY granted_at DESC
  LIMIT 1;
  
  IF v_family_id IS NULL AND v_org_id IS NULL THEN
    RAISE EXCEPTION 'Client not found or access denied';
  END IF;
  
  -- Check feature flag
  IF v_family_id IS NOT NULL THEN
    SELECT COALESCE((metadata->'feature_flags'->>'use_new_client_model')::boolean, false)
    INTO v_use_new_model
    FROM families WHERE id = v_family_id;
  ELSE
    SELECT COALESCE((metadata->'feature_flags'->>'use_new_client_model')::boolean, false)
    INTO v_use_new_model
    FROM organizations WHERE id = v_org_id;
  END IF;
  
  -- Calculate accuracy percentage
  IF (p_log_data->>'total_attempts') IS NOT NULL AND (p_log_data->>'total_attempts')::INTEGER > 0 THEN
    v_accuracy := ((p_log_data->>'correct_responses')::NUMERIC / (p_log_data->>'total_attempts')::NUMERIC) * 100;
  ELSE
    v_accuracy := NULL;
  END IF;
  
  -- Insert educator log
  INSERT INTO educator_logs (
    family_id,
    student_id,
    client_id,
    created_by,
    log_date,
    log_time,
    session_start_time,
    session_end_time,
    log_type,
    educator_name,
    educator_role,
    session_duration_minutes,
    subject_area,
    lesson_topic,
    teaching_method,
    materials_used,
    iep_goal_addressed,
    skills_practiced,
    activities_completed,
    performance_level,
    engagement_level,
    prompting_level,
    correct_responses,
    total_attempts,
    accuracy_percentage,
    progress_notes,
    behavioral_observations,
    strengths_observed,
    areas_for_improvement,
    challenges,
    modifications_used,
    next_steps,
    goals_for_next_session,
    parent_communication,
    tags,
    addressed_goal_ids,
    weather_temp_f,
    weather_temp_c,
    weather_condition,
    weather_humidity,
    weather_pressure_mb,
    weather_wind_speed,
    weather_fetched_at,
    aqi_us,
    aqi_european,
    pm25,
    pm10,
    co,
    no2,
    o3,
    so2,
    pollen_grass,
    pollen_birch,
    pollen_olive,
    pollen_ragweed,
    pollen_mugwort,
    pollen_alder,
    air_quality_fetched_at,
    attachments
  ) VALUES (
    COALESCE(v_family_id, (p_log_data->>'family_id')::UUID),
    CASE WHEN v_use_new_model THEN NULL ELSE (p_log_data->>'student_id')::UUID END,
    CASE WHEN v_use_new_model THEN p_client_id ELSE NULL END,
    (p_log_data->>'created_by')::UUID,
    (p_log_data->>'log_date')::DATE,
    (p_log_data->>'log_time')::TIME,
    (p_log_data->>'session_start_time')::TIME,
    (p_log_data->>'session_end_time')::TIME,
    p_log_data->>'log_type',
    p_log_data->>'educator_name',
    p_log_data->>'educator_role',
    (p_log_data->>'session_duration_minutes')::INTEGER,
    p_log_data->>'subject_area',
    p_log_data->>'lesson_topic',
    p_log_data->>'teaching_method',
    CASE WHEN p_log_data->'materials_used' IS NOT NULL THEN 
      ARRAY(SELECT jsonb_array_elements_text(p_log_data->'materials_used'))
    ELSE NULL END,
    p_log_data->>'iep_goal_addressed',
    CASE WHEN p_log_data->'skills_practiced' IS NOT NULL THEN 
      ARRAY(SELECT jsonb_array_elements_text(p_log_data->'skills_practiced'))
    ELSE NULL END,
    CASE WHEN p_log_data->'activities_completed' IS NOT NULL THEN 
      ARRAY(SELECT jsonb_array_elements_text(p_log_data->'activities_completed'))
    ELSE NULL END,
    p_log_data->>'performance_level',
    p_log_data->>'engagement_level',
    p_log_data->>'prompting_level',
    (p_log_data->>'correct_responses')::INTEGER,
    (p_log_data->>'total_attempts')::INTEGER,
    v_accuracy,
    p_log_data->>'progress_notes',
    p_log_data->>'behavioral_observations',
    p_log_data->>'strengths_observed',
    p_log_data->>'areas_for_improvement',
    p_log_data->>'challenges',
    CASE WHEN p_log_data->'modifications_used' IS NOT NULL THEN 
      ARRAY(SELECT jsonb_array_elements_text(p_log_data->'modifications_used'))
    ELSE NULL END,
    p_log_data->>'next_steps',
    p_log_data->>'goals_for_next_session',
    p_log_data->>'parent_communication',
    CASE WHEN p_log_data->'tags' IS NOT NULL THEN 
      ARRAY(SELECT jsonb_array_elements_text(p_log_data->'tags'))
    ELSE NULL END,
    CASE WHEN p_log_data->'addressed_goal_ids' IS NOT NULL THEN 
      ARRAY(SELECT jsonb_array_elements_text(p_log_data->'addressed_goal_ids'))
    ELSE NULL END,
    (p_log_data->>'weather_temp_f')::NUMERIC,
    (p_log_data->>'weather_temp_c')::NUMERIC,
    p_log_data->>'weather_condition',
    (p_log_data->>'weather_humidity')::NUMERIC,
    (p_log_data->>'weather_pressure_mb')::NUMERIC,
    (p_log_data->>'weather_wind_speed')::NUMERIC,
    (p_log_data->>'weather_fetched_at')::TIMESTAMPTZ,
    (p_log_data->>'aqi_us')::NUMERIC,
    (p_log_data->>'aqi_european')::NUMERIC,
    (p_log_data->>'pm25')::NUMERIC,
    (p_log_data->>'pm10')::NUMERIC,
    (p_log_data->>'co')::NUMERIC,
    (p_log_data->>'no2')::NUMERIC,
    (p_log_data->>'o3')::NUMERIC,
    (p_log_data->>'so2')::NUMERIC,
    (p_log_data->>'pollen_grass')::NUMERIC,
    (p_log_data->>'pollen_birch')::NUMERIC,
    (p_log_data->>'pollen_olive')::NUMERIC,
    (p_log_data->>'pollen_ragweed')::NUMERIC,
    (p_log_data->>'pollen_mugwort')::NUMERIC,
    (p_log_data->>'pollen_alder')::NUMERIC,
    (p_log_data->>'air_quality_fetched_at')::TIMESTAMPTZ,
    CASE WHEN p_log_data->'attachments' IS NOT NULL THEN 
      p_log_data->'attachments'
    ELSE '[]'::JSONB END
  )
  RETURNING id INTO v_log_id;
  
  -- Auto-queue for embedding
  INSERT INTO embedding_queue (
    family_id,
    organization_id,
    student_id,
    client_id,
    source_table,
    source_id,
    status
  ) VALUES (
    v_family_id,
    v_org_id,
    CASE WHEN v_use_new_model THEN NULL ELSE (p_log_data->>'student_id')::UUID END,
    CASE WHEN v_use_new_model THEN p_client_id ELSE NULL END,
    'educator_logs',
    v_log_id,
    'pending'
  );
  
  RETURN v_log_id;
END;
$$;

-- Function: log_sleep_record (Bilingual)
CREATE OR REPLACE FUNCTION public.log_sleep_record(
  p_client_id UUID,
  p_sleep_data JSONB
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO public
AS $$
DECLARE
  v_family_id UUID;
  v_org_id UUID;
  v_use_new_model BOOLEAN;
  v_sleep_id UUID;
BEGIN
  -- Get client context
  SELECT family_id, organization_id INTO v_family_id, v_org_id
  FROM client_access
  WHERE client_id = p_client_id AND status = 'active'
  ORDER BY granted_at DESC
  LIMIT 1;
  
  IF v_family_id IS NULL AND v_org_id IS NULL THEN
    RAISE EXCEPTION 'Client not found or access denied';
  END IF;
  
  -- Check feature flag
  IF v_family_id IS NOT NULL THEN
    SELECT COALESCE((metadata->'feature_flags'->>'use_new_client_model')::boolean, false)
    INTO v_use_new_model
    FROM families WHERE id = v_family_id;
  ELSE
    SELECT COALESCE((metadata->'feature_flags'->>'use_new_client_model')::boolean, false)
    INTO v_use_new_model
    FROM organizations WHERE id = v_org_id;
  END IF;
  
  -- Insert sleep record
  INSERT INTO sleep_records (
    family_id,
    student_id,
    client_id,
    created_by,
    sleep_date,
    bedtime,
    fell_asleep_time,
    wake_time,
    total_sleep_hours,
    sleep_quality_rating,
    nighttime_awakenings,
    disturbances,
    disturbance_details,
    pre_bed_activities,
    daytime_fatigue_level,
    nap_taken,
    nap_start_time,
    nap_end_time,
    nap_duration_minutes,
    fell_asleep_in_school,
    asleep_location,
    daytime_medication_taken,
    daytime_medication_details,
    daytime_notes,
    notes,
    weather_temp_f,
    weather_temp_c,
    weather_condition,
    weather_humidity,
    weather_pressure_mb,
    weather_wind_speed,
    weather_fetched_at,
    aqi_us,
    aqi_european,
    pm25,
    pm10,
    co,
    no2,
    o3,
    so2,
    pollen_grass,
    pollen_birch,
    pollen_olive,
    pollen_ragweed,
    pollen_mugwort,
    pollen_alder,
    air_quality_fetched_at
  ) VALUES (
    COALESCE(v_family_id, (p_sleep_data->>'family_id')::UUID),
    CASE WHEN v_use_new_model THEN NULL ELSE (p_sleep_data->>'student_id')::UUID END,
    CASE WHEN v_use_new_model THEN p_client_id ELSE NULL END,
    (p_sleep_data->>'created_by')::UUID,
    (p_sleep_data->>'sleep_date')::DATE,
    (p_sleep_data->>'bedtime')::TIME,
    (p_sleep_data->>'fell_asleep_time')::TIME,
    (p_sleep_data->>'wake_time')::TIME,
    (p_sleep_data->>'total_sleep_hours')::NUMERIC,
    (p_sleep_data->>'sleep_quality_rating')::INTEGER,
    (p_sleep_data->>'nighttime_awakenings')::INTEGER,
    CASE WHEN p_sleep_data->'disturbances' IS NOT NULL THEN 
      ARRAY(SELECT jsonb_array_elements_text(p_sleep_data->'disturbances'))
    ELSE NULL END,
    p_sleep_data->>'disturbance_details',
    CASE WHEN p_sleep_data->'pre_bed_activities' IS NOT NULL THEN 
      ARRAY(SELECT jsonb_array_elements_text(p_sleep_data->'pre_bed_activities'))
    ELSE NULL END,
    (p_sleep_data->>'daytime_fatigue_level')::INTEGER,
    COALESCE((p_sleep_data->>'nap_taken')::BOOLEAN, false),
    (p_sleep_data->>'nap_start_time')::TIME,
    (p_sleep_data->>'nap_end_time')::TIME,
    (p_sleep_data->>'nap_duration_minutes')::INTEGER,
    COALESCE((p_sleep_data->>'fell_asleep_in_school')::BOOLEAN, false),
    p_sleep_data->>'asleep_location',
    COALESCE((p_sleep_data->>'daytime_medication_taken')::BOOLEAN, false),
    p_sleep_data->>'daytime_medication_details',
    p_sleep_data->>'daytime_notes',
    p_sleep_data->>'notes',
    (p_sleep_data->>'weather_temp_f')::NUMERIC,
    (p_sleep_data->>'weather_temp_c')::NUMERIC,
    p_sleep_data->>'weather_condition',
    (p_sleep_data->>'weather_humidity')::NUMERIC,
    (p_sleep_data->>'weather_pressure_mb')::NUMERIC,
    (p_sleep_data->>'weather_wind_speed')::NUMERIC,
    (p_sleep_data->>'weather_fetched_at')::TIMESTAMPTZ,
    (p_sleep_data->>'aqi_us')::NUMERIC,
    (p_sleep_data->>'aqi_european')::NUMERIC,
    (p_sleep_data->>'pm25')::NUMERIC,
    (p_sleep_data->>'pm10')::NUMERIC,
    (p_sleep_data->>'co')::NUMERIC,
    (p_sleep_data->>'no2')::NUMERIC,
    (p_sleep_data->>'o3')::NUMERIC,
    (p_sleep_data->>'so2')::NUMERIC,
    (p_sleep_data->>'pollen_grass')::NUMERIC,
    (p_sleep_data->>'pollen_birch')::NUMERIC,
    (p_sleep_data->>'pollen_olive')::NUMERIC,
    (p_sleep_data->>'pollen_ragweed')::NUMERIC,
    (p_sleep_data->>'pollen_mugwort')::NUMERIC,
    (p_sleep_data->>'pollen_alder')::NUMERIC,
    (p_sleep_data->>'air_quality_fetched_at')::TIMESTAMPTZ
  )
  RETURNING id INTO v_sleep_id;
  
  -- Auto-queue for embedding
  INSERT INTO embedding_queue (
    family_id,
    organization_id,
    student_id,
    client_id,
    source_table,
    source_id,
    status
  ) VALUES (
    v_family_id,
    v_org_id,
    CASE WHEN v_use_new_model THEN NULL ELSE (p_sleep_data->>'student_id')::UUID END,
    CASE WHEN v_use_new_model THEN p_client_id ELSE NULL END,
    'sleep_records',
    v_sleep_id,
    'pending'
  );
  
  RETURN v_sleep_id;
END;
$$;

-- ============================================
-- PHASE 2A: GOAL MANAGEMENT RPCs
-- ============================================

-- Create goal_progress_history table
CREATE TABLE IF NOT EXISTS public.goal_progress_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  goal_id UUID NOT NULL REFERENCES public.goals(id) ON DELETE CASCADE,
  previous_value NUMERIC,
  new_value NUMERIC NOT NULL,
  changed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  changed_by UUID REFERENCES auth.users(id),
  notes TEXT
);

-- Enable RLS on goal_progress_history
ALTER TABLE public.goal_progress_history ENABLE ROW LEVEL SECURITY;

-- RLS Policies for goal_progress_history
CREATE POLICY "Users can view progress history for their goals"
  ON public.goal_progress_history
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.goals g
      WHERE g.id = goal_progress_history.goal_id
        AND (
          g.family_id IN (SELECT family_id FROM public.family_members WHERE user_id = auth.uid())
          OR g.organization_id IN (SELECT organization_id FROM public.organization_members WHERE user_id = auth.uid())
          OR g.client_id IN (SELECT client_id FROM public.client_access WHERE status = 'active' AND (
            family_id IN (SELECT family_id FROM public.family_members WHERE user_id = auth.uid())
            OR organization_id IN (SELECT organization_id FROM public.organization_members WHERE user_id = auth.uid())
          ))
        )
    )
  );

CREATE POLICY "Users can insert progress history for their goals"
  ON public.goal_progress_history
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.goals g
      WHERE g.id = goal_progress_history.goal_id
        AND (
          g.family_id IN (SELECT family_id FROM public.family_members WHERE user_id = auth.uid())
          OR g.organization_id IN (SELECT organization_id FROM public.organization_members WHERE user_id = auth.uid())
          OR g.client_id IN (SELECT client_id FROM public.client_access WHERE status = 'active' AND (
            family_id IN (SELECT family_id FROM public.family_members WHERE user_id = auth.uid())
            OR organization_id IN (SELECT organization_id FROM public.organization_members WHERE user_id = auth.uid())
          ))
        )
    )
  );

-- Function: create_goal (Bilingual)
CREATE OR REPLACE FUNCTION public.create_goal(
  p_client_id UUID,
  p_goal_data JSONB
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO public
AS $$
DECLARE
  v_family_id UUID;
  v_org_id UUID;
  v_use_new_model BOOLEAN;
  v_goal_id UUID;
BEGIN
  -- Get client context
  SELECT family_id, organization_id INTO v_family_id, v_org_id
  FROM client_access
  WHERE client_id = p_client_id AND status = 'active'
  ORDER BY granted_at DESC
  LIMIT 1;
  
  IF v_family_id IS NULL AND v_org_id IS NULL THEN
    RAISE EXCEPTION 'Client not found or access denied';
  END IF;
  
  -- Check feature flag
  IF v_family_id IS NOT NULL THEN
    SELECT COALESCE((metadata->'feature_flags'->>'use_new_client_model')::boolean, false)
    INTO v_use_new_model
    FROM families WHERE id = v_family_id;
  ELSE
    SELECT COALESCE((metadata->'feature_flags'->>'use_new_client_model')::boolean, false)
    INTO v_use_new_model
    FROM organizations WHERE id = v_org_id;
  END IF;
  
  -- Insert goal
  INSERT INTO goals (
    family_id,
    organization_id,
    student_id,
    client_id,
    goal_title,
    goal_description,
    goal_type,
    target_value,
    current_value,
    target_date,
    is_active,
    created_by
  ) VALUES (
    v_family_id,
    v_org_id,
    CASE WHEN v_use_new_model THEN NULL ELSE (p_goal_data->>'student_id')::UUID END,
    CASE WHEN v_use_new_model THEN p_client_id ELSE NULL END,
    p_goal_data->>'goal_title',
    p_goal_data->>'goal_description',
    p_goal_data->>'goal_type',
    (p_goal_data->>'target_value')::NUMERIC,
    COALESCE((p_goal_data->>'current_value')::NUMERIC, 0),
    (p_goal_data->>'target_date')::DATE,
    COALESCE((p_goal_data->>'is_active')::BOOLEAN, true),
    auth.uid()
  )
  RETURNING id INTO v_goal_id;
  
  -- Record initial progress
  INSERT INTO goal_progress_history (
    goal_id,
    previous_value,
    new_value,
    changed_by,
    notes
  ) VALUES (
    v_goal_id,
    NULL,
    COALESCE((p_goal_data->>'current_value')::NUMERIC, 0),
    auth.uid(),
    'Goal created'
  );
  
  RETURN v_goal_id;
END;
$$;

-- Function: get_client_goals (Bilingual)
CREATE OR REPLACE FUNCTION public.get_client_goals(
  p_client_id UUID,
  p_active_only BOOLEAN DEFAULT TRUE
)
RETURNS TABLE (
  id UUID,
  goal_title TEXT,
  goal_description TEXT,
  goal_type TEXT,
  target_value NUMERIC,
  current_value NUMERIC,
  target_date DATE,
  is_active BOOLEAN,
  created_at TIMESTAMPTZ,
  progress_percentage NUMERIC
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO public
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    g.id,
    g.goal_title,
    g.goal_description,
    g.goal_type,
    g.target_value,
    g.current_value,
    g.target_date,
    g.is_active,
    g.created_at,
    CASE 
      WHEN g.target_value > 0 THEN 
        ROUND((g.current_value / g.target_value) * 100, 1)
      ELSE 0
    END as progress_percentage
  FROM goals g
  WHERE g.client_id = p_client_id
    AND (NOT p_active_only OR g.is_active = true)
  ORDER BY g.created_at DESC;
END;
$$;

-- Function: update_goal_progress (Bilingual)
CREATE OR REPLACE FUNCTION public.update_goal_progress(
  p_goal_id UUID,
  p_new_value NUMERIC,
  p_notes TEXT DEFAULT NULL
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO public
AS $$
DECLARE
  v_old_value NUMERIC;
BEGIN
  -- Get current value
  SELECT current_value INTO v_old_value
  FROM goals
  WHERE id = p_goal_id;
  
  -- Update goal
  UPDATE goals
  SET 
    current_value = p_new_value,
    updated_at = NOW()
  WHERE id = p_goal_id;
  
  -- Record history
  INSERT INTO goal_progress_history (
    goal_id,
    previous_value,
    new_value,
    changed_by,
    notes
  ) VALUES (
    p_goal_id,
    v_old_value,
    p_new_value,
    auth.uid(),
    p_notes
  );
END;
$$;

-- Function: suggest_goals_from_insights (Bilingual)
CREATE OR REPLACE FUNCTION public.suggest_goals_from_insights(
  p_client_id UUID
)
RETURNS TABLE (
  insight_id UUID,
  insight_content TEXT,
  source_document_name TEXT,
  confidence NUMERIC,
  suggested_goal_title TEXT,
  suggested_goal_type TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO public
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    bi.id as insight_id,
    bi.insight_content,
    bd.file_name as source_document_name,
    bi.confidence,
    COALESCE(
      bi.insight_metadata->>'suggested_goal_title',
      'Suggested Goal from ' || bd.file_name
    ) as suggested_goal_title,
    COALESCE(
      bi.insight_metadata->>'goal_type',
      'general'
    ) as suggested_goal_type
  FROM bedrock_insights bi
  JOIN bedrock_documents bd ON bi.document_id = bd.id
  WHERE bi.client_id = p_client_id
    AND bi.insight_type = 'goal_suggestion'
    AND bd.status = 'complete'
  ORDER BY bi.confidence DESC, bi.created_at DESC
  LIMIT 10;
END;
$$;

-- ============================================
-- PHASE 3A: ANALYTICS RPCs
-- ============================================

-- Function: get_activity_frequency (Bilingual)
CREATE OR REPLACE FUNCTION public.get_activity_frequency(
  p_client_id UUID,
  p_start_date DATE DEFAULT NULL,
  p_end_date DATE DEFAULT NULL
)
RETURNS TABLE (
  log_type TEXT,
  log_count BIGINT,
  log_date DATE
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO public
AS $$
DECLARE
  v_start DATE;
  v_end DATE;
BEGIN
  v_start := COALESCE(p_start_date, CURRENT_DATE - INTERVAL '30 days');
  v_end := COALESCE(p_end_date, CURRENT_DATE);
  
  RETURN QUERY
  SELECT 'incident' as log_type, COUNT(*)::BIGINT as log_count, incident_date as log_date
  FROM incident_logs
  WHERE client_id = p_client_id
    AND incident_date BETWEEN v_start AND v_end
  GROUP BY incident_date
  
  UNION ALL
  
  SELECT 'parent' as log_type, COUNT(*)::BIGINT as log_count, log_date
  FROM parent_logs
  WHERE client_id = p_client_id
    AND log_date BETWEEN v_start AND v_end
  GROUP BY log_date
  
  UNION ALL
  
  SELECT 'educator' as log_type, COUNT(*)::BIGINT as log_count, log_date
  FROM educator_logs
  WHERE client_id = p_client_id
    AND log_date BETWEEN v_start AND v_end
  GROUP BY log_date
  
  UNION ALL
  
  SELECT 'sleep' as log_type, COUNT(*)::BIGINT as log_count, sleep_date as log_date
  FROM sleep_records
  WHERE client_id = p_client_id
    AND sleep_date BETWEEN v_start AND v_end
  GROUP BY sleep_date
  
  ORDER BY log_date DESC;
END;
$$;

-- Function: get_goal_progress_timeline (Bilingual)
CREATE OR REPLACE FUNCTION public.get_goal_progress_timeline(
  p_goal_id UUID,
  p_days INTEGER DEFAULT 30
)
RETURNS TABLE (
  changed_at TIMESTAMPTZ,
  value NUMERIC,
  notes TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO public
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    gph.changed_at,
    gph.new_value as value,
    gph.notes
  FROM goal_progress_history gph
  WHERE gph.goal_id = p_goal_id
    AND gph.changed_at >= NOW() - (p_days || ' days')::INTERVAL
  ORDER BY gph.changed_at ASC;
END;
$$;

-- Function: get_recent_activity (Bilingual - Unified Feed)
CREATE OR REPLACE FUNCTION public.get_recent_activity(
  p_client_id UUID,
  p_limit INTEGER DEFAULT 20
)
RETURNS TABLE (
  activity_id UUID,
  activity_type TEXT,
  activity_date DATE,
  activity_time TIME,
  title TEXT,
  description TEXT,
  created_at TIMESTAMPTZ
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO public
AS $$
BEGIN
  RETURN QUERY
  (
    SELECT 
      id as activity_id,
      'incident'::TEXT as activity_type,
      incident_date as activity_date,
      incident_time as activity_time,
      CONCAT(incident_type, ' - ', severity) as title,
      behavior_description as description,
      created_at
    FROM incident_logs
    WHERE client_id = p_client_id
  )
  UNION ALL
  (
    SELECT 
      id as activity_id,
      'parent'::TEXT as activity_type,
      log_date as activity_date,
      log_time as activity_time,
      CONCAT('Parent Log - ', activity_type) as title,
      observation as description,
      created_at
    FROM parent_logs
    WHERE client_id = p_client_id
  )
  UNION ALL
  (
    SELECT 
      id as activity_id,
      'educator'::TEXT as activity_type,
      log_date as activity_date,
      log_time as activity_time,
      CONCAT('Educator Log - ', log_type) as title,
      progress_notes as description,
      created_at
    FROM educator_logs
    WHERE client_id = p_client_id
  )
  UNION ALL
  (
    SELECT 
      id as activity_id,
      'sleep'::TEXT as activity_type,
      sleep_date as activity_date,
      bedtime as activity_time,
      CONCAT('Sleep Log - ', total_sleep_hours::TEXT, ' hours') as title,
      notes as description,
      created_at
    FROM sleep_records
    WHERE client_id = p_client_id
  )
  ORDER BY created_at DESC
  LIMIT p_limit;
END;
$$;