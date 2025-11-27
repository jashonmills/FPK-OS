-- Create embedding jobs table for progress tracking
CREATE TABLE IF NOT EXISTS public.kb_embedding_jobs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  status TEXT NOT NULL DEFAULT 'pending',
  total_documents INTEGER NOT NULL DEFAULT 0,
  processed_documents INTEGER NOT NULL DEFAULT 0,
  successful_embeddings INTEGER NOT NULL DEFAULT 0,
  failed_embeddings INTEGER NOT NULL DEFAULT 0,
  current_document_title TEXT,
  error_message TEXT,
  started_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id)
);

-- Enable RLS
ALTER TABLE public.kb_embedding_jobs ENABLE ROW LEVEL SECURITY;

-- Policy for admins to view all jobs
CREATE POLICY "Admins can view all embedding jobs"
ON public.kb_embedding_jobs
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);

-- Policy for system to manage jobs
CREATE POLICY "System can manage embedding jobs"
ON public.kb_embedding_jobs
FOR ALL
USING (true)
WITH CHECK (true);

-- Add index for faster queries
CREATE INDEX idx_kb_embedding_jobs_status ON public.kb_embedding_jobs(status);
CREATE INDEX idx_kb_embedding_jobs_created_at ON public.kb_embedding_jobs(created_at DESC);