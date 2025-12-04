-- Recreate the queue_for_embedding function with proper conditional logic
CREATE OR REPLACE FUNCTION public.queue_for_embedding()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  should_queue BOOLEAN := FALSE;
BEGIN
  -- Check if we should queue based on operation type and table
  IF TG_OP = 'INSERT' THEN
    should_queue := TRUE;
  ELSIF TG_OP = 'UPDATE' THEN
    -- Check table-specific fields using IF-ELSIF to avoid evaluating non-existent fields
    IF TG_TABLE_NAME = 'parent_logs' THEN
      should_queue := (OLD.observation IS DISTINCT FROM NEW.observation OR
                      OLD.notes IS DISTINCT FROM NEW.notes);
    ELSIF TG_TABLE_NAME = 'educator_logs' THEN
      should_queue := (OLD.progress_notes IS DISTINCT FROM NEW.progress_notes OR
                      OLD.behavioral_observations IS DISTINCT FROM NEW.behavioral_observations);
    ELSIF TG_TABLE_NAME = 'incident_logs' THEN
      should_queue := (OLD.behavior_description IS DISTINCT FROM NEW.behavior_description OR
                      OLD.antecedent IS DISTINCT FROM NEW.antecedent);
    ELSIF TG_TABLE_NAME = 'sleep_records' THEN
      should_queue := (OLD.disturbance_details IS DISTINCT FROM NEW.disturbance_details OR
                      OLD.notes IS DISTINCT FROM NEW.notes);
    ELSIF TG_TABLE_NAME = 'documents' THEN
      should_queue := (OLD.extracted_content IS DISTINCT FROM NEW.extracted_content);
    END IF;
  END IF;

  -- Queue if needed
  IF should_queue THEN
    INSERT INTO public.embedding_queue (family_id, student_id, source_table, source_id)
    VALUES (NEW.family_id, NEW.student_id, TG_TABLE_NAME, NEW.id)
    ON CONFLICT DO NOTHING;
  END IF;
  
  RETURN NEW;
END;
$function$;