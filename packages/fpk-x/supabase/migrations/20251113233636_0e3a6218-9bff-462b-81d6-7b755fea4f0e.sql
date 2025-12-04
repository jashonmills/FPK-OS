-- Add job_id column to track async Document AI operations
ALTER TABLE bedrock_documents 
ADD COLUMN job_id TEXT;

-- Create index for efficient job_id lookups
CREATE INDEX idx_bedrock_documents_job_id ON bedrock_documents(job_id);

-- Add comment for documentation
COMMENT ON COLUMN bedrock_documents.job_id IS 'Google Document AI batch process operation name for tracking async jobs';