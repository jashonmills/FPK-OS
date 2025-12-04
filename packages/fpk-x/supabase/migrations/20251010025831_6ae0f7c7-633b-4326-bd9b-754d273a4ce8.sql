-- Enable pg_net extension for HTTP requests
CREATE EXTENSION IF NOT EXISTS pg_net;

-- Create function to trigger document analysis
CREATE OR REPLACE FUNCTION public.trigger_document_analysis()
RETURNS TRIGGER AS $$
DECLARE
  request_id bigint;
  supabase_url text;
  service_role_key text;
BEGIN
  -- Only trigger if the document has extracted_content
  IF NEW.extracted_content IS NOT NULL THEN
    -- Get the Supabase URL and service role key from secrets
    supabase_url := current_setting('app.settings.supabase_url', true);
    service_role_key := current_setting('app.settings.service_role_key', true);
    
    -- If settings aren't available, use environment approach
    IF supabase_url IS NULL THEN
      supabase_url := 'https://pnxwemmpxldriwaomiey.supabase.co';
    END IF;
    
    -- Make async HTTP POST request to analyze-document function
    SELECT net.http_post(
      url := supabase_url || '/functions/v1/analyze-document',
      headers := jsonb_build_object(
        'Content-Type', 'application/json',
        'Authorization', 'Bearer ' || COALESCE(service_role_key, '')
      ),
      body := jsonb_build_object('document_id', NEW.id)
    ) INTO request_id;
    
    RAISE LOG 'Document analysis triggered for document_id: %, request_id: %', NEW.id, request_id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger on documents table
DROP TRIGGER IF EXISTS on_document_inserted ON public.documents;
CREATE TRIGGER on_document_inserted
  AFTER INSERT ON public.documents
  FOR EACH ROW
  EXECUTE FUNCTION public.trigger_document_analysis();