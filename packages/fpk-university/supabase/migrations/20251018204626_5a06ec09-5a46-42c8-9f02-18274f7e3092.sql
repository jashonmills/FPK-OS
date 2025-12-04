-- Drop the existing check constraint
ALTER TABLE kb_scraping_jobs 
DROP CONSTRAINT IF EXISTS kb_scraping_jobs_job_type_check;

-- Update existing rows to valid values
UPDATE kb_scraping_jobs 
SET job_type = 'general'
WHERE job_type IN ('web_scrape', 'academic_search');

-- Add unique constraint for embeddings (drop first if exists)
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'kb_embeddings_document_chunk_unique'
  ) THEN
    ALTER TABLE kb_embeddings 
    ADD CONSTRAINT kb_embeddings_document_chunk_unique 
    UNIQUE (document_id, chunk_index);
  END IF;
END $$;

-- Add the new check constraint with all allowed values
ALTER TABLE kb_scraping_jobs
ADD CONSTRAINT kb_scraping_jobs_job_type_check 
CHECK (job_type IN (
  'academic_tier_1',
  'academic_tier_2', 
  'academic_tier_3',
  'clinical_tier_1',
  'clinical_tier_2',
  'clinical_tier_3',
  'specialized_tier_4',
  'specialized_tier_5',
  'general'
));