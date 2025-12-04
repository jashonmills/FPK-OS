-- Create embedding queue table
CREATE TABLE IF NOT EXISTS public.embedding_queue (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  family_id UUID NOT NULL REFERENCES public.families(id) ON DELETE CASCADE,
  student_id UUID REFERENCES public.students(id) ON DELETE CASCADE,
  source_table TEXT NOT NULL,
  source_id UUID NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
  error_message TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  processed_at TIMESTAMPTZ
);

-- Create index for efficient queue processing
CREATE INDEX IF NOT EXISTS idx_embedding_queue_status ON public.embedding_queue(status, created_at);
CREATE INDEX IF NOT EXISTS idx_embedding_queue_family ON public.embedding_queue(family_id, status);

-- Enable RLS
ALTER TABLE public.embedding_queue ENABLE ROW LEVEL SECURITY;

-- RLS policies for embedding queue
CREATE POLICY "Users can view their family's embedding queue"
  ON public.embedding_queue FOR SELECT
  USING (
    family_id IN (
      SELECT family_id FROM public.family_members WHERE user_id = auth.uid()
    )
  );

-- Function to queue items for embedding
CREATE OR REPLACE FUNCTION public.queue_for_embedding()
RETURNS TRIGGER AS $$
BEGIN
  -- Only queue if this is an insert or significant update
  IF (TG_OP = 'INSERT') OR 
     (TG_OP = 'UPDATE' AND (
       OLD.observation IS DISTINCT FROM NEW.observation OR
       OLD.behavior_description IS DISTINCT FROM NEW.behavior_description OR
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
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create triggers on all relevant tables
DROP TRIGGER IF EXISTS trigger_queue_incident_log_embedding ON public.incident_logs;
CREATE TRIGGER trigger_queue_incident_log_embedding
  AFTER INSERT OR UPDATE ON public.incident_logs
  FOR EACH ROW
  EXECUTE FUNCTION public.queue_for_embedding();

DROP TRIGGER IF EXISTS trigger_queue_parent_log_embedding ON public.parent_logs;
CREATE TRIGGER trigger_queue_parent_log_embedding
  AFTER INSERT OR UPDATE ON public.parent_logs
  FOR EACH ROW
  EXECUTE FUNCTION public.queue_for_embedding();

DROP TRIGGER IF EXISTS trigger_queue_educator_log_embedding ON public.educator_logs;
CREATE TRIGGER trigger_queue_educator_log_embedding
  AFTER INSERT OR UPDATE ON public.educator_logs
  FOR EACH ROW
  EXECUTE FUNCTION public.queue_for_embedding();

DROP TRIGGER IF EXISTS trigger_queue_sleep_record_embedding ON public.sleep_records;
CREATE TRIGGER trigger_queue_sleep_record_embedding
  AFTER INSERT OR UPDATE ON public.sleep_records
  FOR EACH ROW
  EXECUTE FUNCTION public.queue_for_embedding();

DROP TRIGGER IF EXISTS trigger_queue_document_embedding ON public.documents;
CREATE TRIGGER trigger_queue_document_embedding
  AFTER INSERT OR UPDATE ON public.documents
  FOR EACH ROW
  EXECUTE FUNCTION public.queue_for_embedding();