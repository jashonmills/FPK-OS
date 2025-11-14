-- OPERATION PHOENIX: Database Schema Update for OpenAI Embeddings
-- Update vector dimension from 384 to 1536 to match text-embedding-3-small model

-- 1. Update the vector dimension to match OpenAI's embedding size
ALTER TABLE family_data_embeddings 
ALTER COLUMN embedding TYPE vector(1536);

-- 2. Clear all previously generated fake embeddings
DELETE FROM family_data_embeddings;

-- 3. Reset the entire queue to retry all items with the new embedding engine
UPDATE embedding_queue 
SET status = 'pending' 
WHERE status IN ('failed', 'processing');