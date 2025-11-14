-- Operation Clean Slate: Purge all ghost queue items
-- All 58 items reference deleted records from legacy tables
-- This creates a clean slate for the Bedrock intelligence pipeline

DELETE FROM embedding_queue;