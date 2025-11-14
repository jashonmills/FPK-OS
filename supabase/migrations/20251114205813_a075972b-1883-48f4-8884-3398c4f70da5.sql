-- Phase 1: Repair Embedding Queue Schema (CRITICAL P0)
-- Add missing metadata column required by bedrock-analyze bridge

ALTER TABLE embedding_queue
ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}'::jsonb;

COMMENT ON COLUMN embedding_queue.metadata IS 'Additional metadata for embedding jobs, used by Bedrock pipeline to store document context';