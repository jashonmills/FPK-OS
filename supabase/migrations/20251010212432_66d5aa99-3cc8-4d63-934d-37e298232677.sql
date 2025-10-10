-- Create ingestion_jobs table to track all knowledge base ingestion runs
CREATE TABLE IF NOT EXISTS public.ingestion_jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  function_name TEXT NOT NULL,
  started_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE,
  status TEXT NOT NULL DEFAULT 'running' CHECK (status IN ('running', 'completed', 'failed')),
  total_documents INTEGER DEFAULT 0,
  successful_documents INTEGER DEFAULT 0,
  failed_documents INTEGER DEFAULT 0,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create ingestion_errors table to capture detailed failure information
CREATE TABLE IF NOT EXISTS public.ingestion_errors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id UUID REFERENCES public.ingestion_jobs(id) ON DELETE CASCADE,
  source_url TEXT,
  error_type TEXT NOT NULL,
  error_message TEXT NOT NULL,
  error_stack TEXT,
  occurred_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  metadata JSONB DEFAULT '{}'::jsonb
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_ingestion_jobs_function_name ON public.ingestion_jobs(function_name);
CREATE INDEX IF NOT EXISTS idx_ingestion_jobs_status ON public.ingestion_jobs(status);
CREATE INDEX IF NOT EXISTS idx_ingestion_jobs_started_at ON public.ingestion_jobs(started_at DESC);
CREATE INDEX IF NOT EXISTS idx_ingestion_errors_job_id ON public.ingestion_errors(job_id);
CREATE INDEX IF NOT EXISTS idx_ingestion_errors_error_type ON public.ingestion_errors(error_type);

-- Enable RLS
ALTER TABLE public.ingestion_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ingestion_errors ENABLE ROW LEVEL SECURITY;

-- Create RLS policies (admin-only access)
CREATE POLICY "Admins can manage ingestion jobs"
  ON public.ingestion_jobs
  FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can manage ingestion errors"
  ON public.ingestion_errors
  FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));