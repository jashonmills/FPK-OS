-- Fix queue_for_embedding function to remove reference to non-existent behavior_description column

CREATE OR REPLACE FUNCTION public.queue_for_embedding()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $function$
BEGIN
  -- Only queue if this is an insert or significant update
  IF (TG_OP = 'INSERT') OR 
     (TG_OP = 'UPDATE' AND (
       OLD.observation IS DISTINCT FROM NEW.observation OR
       OLD.progress_notes IS DISTINCT FROM NEW.progress_notes OR
       OLD.extracted_content IS DISTINCT FROM NEW.extracted_content OR
       OLD.notes IS DISTINCT FROM NEW.notes
     )) THEN
    
    INSERT INTO public.embedding_queue (family_id, student_id, source_table, source_id)
    VALUES (NEW.family_id, NEW.student_id, TG_TABLE_NAME, NEW.id)
    ON CONFLICT DO NOTHING;
  END IF;
  
  RETURN NEW;
END;
$function$;