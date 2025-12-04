-- Create table for document processing history
CREATE TABLE IF NOT EXISTS public.document_processing_history (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  document_id UUID NOT NULL REFERENCES public.bedrock_documents(id) ON DELETE CASCADE,
  family_id UUID NOT NULL,
  user_id UUID NOT NULL,
  action_type TEXT NOT NULL, -- 'upload', 're-classify', 're-analyze', 'delete'
  old_category TEXT,
  new_category TEXT,
  old_processor_id TEXT,
  new_processor_id TEXT,
  status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'completed', 'failed'
  error_message TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.document_processing_history ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Family members can view processing history"
  ON public.document_processing_history
  FOR SELECT
  USING (is_family_member(auth.uid(), family_id));

CREATE POLICY "Family members can insert processing history"
  ON public.document_processing_history
  FOR INSERT
  WITH CHECK (is_family_member(auth.uid(), family_id) AND user_id = auth.uid());

-- Create index for faster queries
CREATE INDEX idx_document_processing_history_document_id 
  ON public.document_processing_history(document_id);

CREATE INDEX idx_document_processing_history_family_id 
  ON public.document_processing_history(family_id);

CREATE INDEX idx_document_processing_history_created_at 
  ON public.document_processing_history(created_at DESC);