-- Add estimated_tokens column to analysis_queue for smart batching
ALTER TABLE public.analysis_queue 
ADD COLUMN IF NOT EXISTS estimated_tokens INTEGER DEFAULT 0;