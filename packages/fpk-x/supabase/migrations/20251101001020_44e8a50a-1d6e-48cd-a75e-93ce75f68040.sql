-- Drop existing triggers if they exist (silently)
DROP TRIGGER IF EXISTS trigger_queue_parent_log_embedding ON public.parent_logs;
DROP TRIGGER IF EXISTS trigger_queue_educator_log_embedding ON public.educator_logs;
DROP TRIGGER IF EXISTS trigger_queue_incident_log_embedding ON public.incident_logs;
DROP TRIGGER IF EXISTS trigger_queue_sleep_record_embedding ON public.sleep_records;
DROP TRIGGER IF EXISTS trigger_queue_document_embedding ON public.documents;

-- Recreate all embedding queue triggers
CREATE TRIGGER trigger_queue_parent_log_embedding
  AFTER INSERT OR UPDATE ON public.parent_logs
  FOR EACH ROW
  EXECUTE FUNCTION public.queue_for_embedding();

CREATE TRIGGER trigger_queue_educator_log_embedding
  AFTER INSERT OR UPDATE ON public.educator_logs
  FOR EACH ROW
  EXECUTE FUNCTION public.queue_for_embedding();

CREATE TRIGGER trigger_queue_incident_log_embedding
  AFTER INSERT OR UPDATE ON public.incident_logs
  FOR EACH ROW
  EXECUTE FUNCTION public.queue_for_embedding();

CREATE TRIGGER trigger_queue_sleep_record_embedding
  AFTER INSERT OR UPDATE ON public.sleep_records
  FOR EACH ROW
  EXECUTE FUNCTION public.queue_for_embedding();

CREATE TRIGGER trigger_queue_document_embedding
  AFTER INSERT OR UPDATE ON public.documents
  FOR EACH ROW
  EXECUTE FUNCTION public.queue_for_embedding();