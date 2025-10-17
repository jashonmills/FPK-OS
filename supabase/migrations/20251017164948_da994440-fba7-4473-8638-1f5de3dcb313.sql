-- Create analysis jobs table for tracking background re-analysis tasks
CREATE TABLE IF NOT EXISTS public.analysis_jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  family_id UUID NOT NULL REFERENCES public.families(id) ON DELETE CASCADE,
  job_type TEXT NOT NULL DEFAULT 're-analysis',
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
  total_documents INTEGER NOT NULL DEFAULT 0,
  processed_documents INTEGER NOT NULL DEFAULT 0,
  failed_documents INTEGER NOT NULL DEFAULT 0,
  started_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  error_message TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create document analysis status table for real-time progress updates
CREATE TABLE IF NOT EXISTS public.document_analysis_status (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id UUID NOT NULL REFERENCES public.analysis_jobs(id) ON DELETE CASCADE,
  document_id UUID NOT NULL REFERENCES public.documents(id) ON DELETE CASCADE,
  family_id UUID NOT NULL REFERENCES public.families(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'extracting', 'analyzing', 'complete', 'failed')),
  document_name TEXT NOT NULL,
  metrics_extracted INTEGER DEFAULT 0,
  insights_extracted INTEGER DEFAULT 0,
  error_message TEXT,
  started_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.analysis_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.document_analysis_status ENABLE ROW LEVEL SECURITY;

-- RLS Policies for analysis_jobs
CREATE POLICY "Family members can view their analysis jobs"
  ON public.analysis_jobs FOR SELECT
  USING (is_family_member(auth.uid(), family_id));

CREATE POLICY "Family members can insert analysis jobs"
  ON public.analysis_jobs FOR INSERT
  WITH CHECK (is_family_member(auth.uid(), family_id));

CREATE POLICY "System can update analysis jobs"
  ON public.analysis_jobs FOR UPDATE
  USING (is_family_member(auth.uid(), family_id));

-- RLS Policies for document_analysis_status
CREATE POLICY "Family members can view analysis status"
  ON public.document_analysis_status FOR SELECT
  USING (is_family_member(auth.uid(), family_id));

CREATE POLICY "System can insert analysis status"
  ON public.document_analysis_status FOR INSERT
  WITH CHECK (is_family_member(auth.uid(), family_id));

CREATE POLICY "System can update analysis status"
  ON public.document_analysis_status FOR UPDATE
  USING (is_family_member(auth.uid(), family_id));

-- Enable realtime for live progress updates
ALTER PUBLICATION supabase_realtime ADD TABLE public.analysis_jobs;
ALTER PUBLICATION supabase_realtime ADD TABLE public.document_analysis_status;

-- Create indexes for performance
CREATE INDEX idx_analysis_jobs_family_id ON public.analysis_jobs(family_id);
CREATE INDEX idx_analysis_jobs_status ON public.analysis_jobs(status);
CREATE INDEX idx_document_analysis_status_job_id ON public.document_analysis_status(job_id);
CREATE INDEX idx_document_analysis_status_family_id ON public.document_analysis_status(family_id);