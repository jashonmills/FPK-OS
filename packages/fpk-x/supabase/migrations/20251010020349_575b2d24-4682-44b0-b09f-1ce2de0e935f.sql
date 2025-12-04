-- Add columns to families table for trial chart system
ALTER TABLE public.families
ADD COLUMN IF NOT EXISTS suggested_charts_config JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS special_chart_trial_ends_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS initial_doc_analysis_status TEXT DEFAULT 'pending' CHECK (initial_doc_analysis_status IN ('pending', 'in_progress', 'complete'));