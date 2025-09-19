-- Create tables for the SCORM import system

-- Table to track SCORM imports with detailed processing status
CREATE TABLE public.scorm_imports (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  org_id UUID NOT NULL,
  user_id UUID NOT NULL,
  file_url TEXT NOT NULL,
  file_name TEXT NOT NULL,
  file_size BIGINT,
  status TEXT NOT NULL DEFAULT 'uploading' CHECK (status IN ('uploading', 'validating', 'extracting', 'mapping', 'converting', 'building_preview', 'ready', 'partial', 'failed')),
  steps_log JSONB NOT NULL DEFAULT '[]'::jsonb,
  warnings_json JSONB DEFAULT '[]'::jsonb,
  error_message TEXT,
  manifest_data JSONB,
  mapped_structure JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE,
  progress_percentage INTEGER DEFAULT 0 CHECK (progress_percentage >= 0 AND progress_percentage <= 100)
);

-- Enable RLS on scorm_imports
ALTER TABLE public.scorm_imports ENABLE ROW LEVEL SECURITY;

-- RLS policies for scorm_imports
CREATE POLICY "Users can create imports in their org"
  ON public.scorm_imports FOR INSERT
  WITH CHECK (
    user_id = auth.uid() AND 
    EXISTS (
      SELECT 1 FROM public.org_members 
      WHERE org_id = scorm_imports.org_id 
      AND user_id = auth.uid() 
      AND status = 'active'
    )
  );

CREATE POLICY "Users can view imports in their org"
  ON public.scorm_imports FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.org_members 
      WHERE org_id = scorm_imports.org_id 
      AND user_id = auth.uid() 
      AND status = 'active'
    )
  );

CREATE POLICY "Users can update their own imports"
  ON public.scorm_imports FOR UPDATE
  USING (user_id = auth.uid());

-- Extend org_courses table with new import-related fields if they don't exist
DO $$
BEGIN
  -- Add processing_status if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'org_courses' AND column_name = 'processing_status') THEN
    ALTER TABLE public.org_courses ADD COLUMN processing_status TEXT DEFAULT 'draft' CHECK (processing_status IN ('draft', 'processing', 'ready', 'error'));
  END IF;

  -- Add source if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'org_courses' AND column_name = 'source') THEN
    ALTER TABLE public.org_courses ADD COLUMN source JSONB DEFAULT '{"type": "manual"}'::jsonb;
  END IF;

  -- Add import_id if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'org_courses' AND column_name = 'import_id') THEN
    ALTER TABLE public.org_courses ADD COLUMN import_id UUID REFERENCES public.scorm_imports(id);
  END IF;
END
$$;