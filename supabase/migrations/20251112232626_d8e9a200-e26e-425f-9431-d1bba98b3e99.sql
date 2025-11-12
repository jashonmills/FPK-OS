-- Enable realtime for document processing queue
ALTER PUBLICATION supabase_realtime ADD TABLE public.document_processing_queue;

-- Enable realtime for AI provider health
ALTER PUBLICATION supabase_realtime ADD TABLE public.ai_provider_health;