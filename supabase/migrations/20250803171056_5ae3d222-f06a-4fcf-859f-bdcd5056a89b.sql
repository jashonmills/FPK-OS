-- Fix function search_path security warnings
-- Update all existing functions to have secure search_path

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
 RETURNS boolean
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$function$;

CREATE OR REPLACE FUNCTION public.handle_new_user_xp()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  INSERT INTO public.user_xp (user_id, total_xp, level, next_level_xp)
  VALUES (NEW.id, 0, 1, 100)
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.extract_chat_topics(session_id uuid)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
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
$function$;

CREATE OR REPLACE FUNCTION public.get_activity_heatmap(user_uuid uuid, days_back integer DEFAULT 30)
 RETURNS TABLE(activity_date date, hour_of_day integer, activity_count integer, total_duration_minutes integer)
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
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
$function$;

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path TO 'public'
AS $function$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.calculate_level_from_xp(total_xp integer)
 RETURNS TABLE(level integer, next_level_xp integer)
 LANGUAGE plpgsql
 SET search_path TO 'public'
AS $function$
DECLARE
  current_level integer := 1;
  xp_needed integer := 100;
  cumulative_xp integer := 0;
BEGIN
  WHILE cumulative_xp + xp_needed <= total_xp LOOP
    cumulative_xp := cumulative_xp + xp_needed;
    current_level := current_level + 1;
    -- XP needed for next level increases by 50 each level
    xp_needed := 100 + (current_level - 1) * 50;
  END LOOP;
  
  RETURN QUERY SELECT current_level, xp_needed - (total_xp - cumulative_xp);
END;
$function$;

CREATE OR REPLACE FUNCTION public.log_threshold_changes()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  IF TG_OP = 'INSERT' THEN
    INSERT INTO public.threshold_audit_log (action, threshold_id, user_id, changes)
    VALUES ('create', NEW.id, NEW.created_by, to_jsonb(NEW));
    RETURN NEW;
  ELSIF TG_OP = 'UPDATE' THEN
    INSERT INTO public.threshold_audit_log (action, threshold_id, user_id, changes)
    VALUES ('update', NEW.id, NEW.created_by, jsonb_build_object(
      'old', to_jsonb(OLD),
      'new', to_jsonb(NEW)
    ));
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    INSERT INTO public.threshold_audit_log (action, threshold_id, user_id, changes)
    VALUES ('delete', OLD.id, OLD.created_by, to_jsonb(OLD));
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$function$;

CREATE OR REPLACE FUNCTION public.update_threshold_updated_at()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path TO 'public'
AS $function$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  INSERT INTO public.profiles (
    id, 
    full_name, 
    display_name
  )
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data ->> 'full_name', ''),
    COALESCE(new.raw_user_meta_data ->> 'display_name', '')
  );
  RETURN new;
END;
$function$;