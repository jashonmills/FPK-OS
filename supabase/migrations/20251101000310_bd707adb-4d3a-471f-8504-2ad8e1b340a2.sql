-- Fix queue_for_embedding to only check fields that exist in parent_logs
-- This function is used by multiple tables, so we need to be careful

CREATE OR REPLACE FUNCTION public.queue_for_embedding()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $function$
BEGIN
  -- Only queue if this is an insert or significant update
  IF (TG_OP = 'INSERT') OR 
     (TG_OP = 'UPDATE' AND (
       (TG_TABLE_NAME = 'parent_logs' AND (
         OLD.observation IS DISTINCT FROM NEW.observation OR
         OLD.notes IS DISTINCT FROM NEW.notes
       )) OR
       (TG_TABLE_NAME = 'educator_logs' AND (
         OLD.progress_notes IS DISTINCT FROM NEW.progress_notes OR
         OLD.notes IS DISTINCT FROM NEW.notes
       )) OR
       (TG_TABLE_NAME = 'incident_logs' AND (
         OLD.behavior_description IS DISTINCT FROM NEW.behavior_description OR
         OLD.notes IS DISTINCT FROM NEW.notes
       )) OR
       (TG_TABLE_NAME = 'documents' AND (
         OLD.extracted_content IS DISTINCT FROM NEW.extracted_content
       ))
     )) THEN
    
    INSERT INTO public.embedding_queue (family_id, student_id, source_table, source_id)
    VALUES (NEW.family_id, NEW.student_id, TG_TABLE_NAME, NEW.id)
    ON CONFLICT DO NOTHING;
  END IF;
  
  RETURN NEW;
END;
$function$;