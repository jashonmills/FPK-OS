-- Create trigger to automatically delete documents when student is deactivated
CREATE OR REPLACE FUNCTION public.cleanup_student_documents()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Only run if is_active changed from true to false
  IF OLD.is_active = true AND NEW.is_active = false THEN
    -- Delete related records first
    DELETE FROM document_analysis_status
    WHERE document_id IN (
      SELECT id FROM documents WHERE student_id = NEW.id
    );

    DELETE FROM document_metrics
    WHERE document_id IN (
      SELECT id FROM documents WHERE student_id = NEW.id
    );

    DELETE FROM ai_insights
    WHERE document_id IN (
      SELECT id FROM documents WHERE student_id = NEW.id
    );

    DELETE FROM document_chart_mapping
    WHERE document_id IN (
      SELECT id FROM documents WHERE student_id = NEW.id
    );

    -- Delete storage files
    PERFORM storage.delete_objects(
      'family-documents',
      ARRAY(
        SELECT file_path FROM documents WHERE student_id = NEW.id
      )
    );

    -- Delete documents
    DELETE FROM documents WHERE student_id = NEW.id;

    RAISE NOTICE 'Cleaned up documents for deactivated student %', NEW.id;
  END IF;

  RETURN NEW;
END;
$$;

-- Create trigger on students table
DROP TRIGGER IF EXISTS trigger_cleanup_student_documents ON students;
CREATE TRIGGER trigger_cleanup_student_documents
  AFTER UPDATE ON students
  FOR EACH ROW
  EXECUTE FUNCTION public.cleanup_student_documents();