-- Create ingestion_jobs table to track overall ingestion requests
CREATE TABLE IF NOT EXISTS public.ingestion_jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  function_name TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'running' CHECK (status IN ('pending', 'running', 'completed', 'failed')),
  total_documents INTEGER DEFAULT 0,
  successful_documents INTEGER DEFAULT 0,
  failed_documents INTEGER DEFAULT 0,
  started_at TIMESTAMPTZ DEFAULT now(),
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  metadata JSONB DEFAULT '{}'::jsonb
);

-- Create ingestion_errors table to track specific failures
CREATE TABLE IF NOT EXISTS public.ingestion_errors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id UUID REFERENCES public.ingestion_jobs(id) ON DELETE CASCADE,
  source_url TEXT,
  error_type TEXT NOT NULL,
  error_message TEXT NOT NULL,
  error_stack TEXT,
  occurred_at TIMESTAMPTZ DEFAULT now(),
  metadata JSONB DEFAULT '{}'::jsonb
);

-- Enable RLS
ALTER TABLE public.ingestion_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ingestion_errors ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Admins can manage ingestion jobs" ON public.ingestion_jobs;
DROP POLICY IF EXISTS "Admins can manage ingestion errors" ON public.ingestion_errors;

-- RLS Policies for ingestion_jobs
CREATE POLICY "Admins can manage ingestion jobs"
  ON public.ingestion_jobs
  FOR ALL
  USING (has_role(auth.uid(), 'admin'));

-- RLS Policies for ingestion_errors
CREATE POLICY "Admins can manage ingestion errors"
  ON public.ingestion_errors
  FOR ALL
  USING (has_role(auth.uid(), 'admin'));

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_ingestion_jobs_status ON public.ingestion_jobs(status);
CREATE INDEX IF NOT EXISTS idx_ingestion_jobs_created_at ON public.ingestion_jobs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_ingestion_errors_job_id ON public.ingestion_errors(job_id);
CREATE INDEX IF NOT EXISTS idx_ingestion_errors_occurred_at ON public.ingestion_errors(occurred_at DESC);