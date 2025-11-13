-- PHASE 1: DEMOLITION & RESCUE MIGRATION (Fixed)
-- Step 1.1: Rescue stuck jobs from legacy queue (Zero Data Loss)

-- Create recovery jobs for any families with failed/stuck documents
INSERT INTO analysis_jobs (family_id, status, total_documents, job_type, metadata)
SELECT DISTINCT 
  family_id, 
  'pending', 
  COUNT(*), 
  'recovery', 
  jsonb_build_object('recovered_from_legacy', true, 'recovery_timestamp', NOW())
FROM document_processing_queue 
WHERE status IN ('failed', 'queued', 'processing')
GROUP BY family_id;

-- Move all stuck jobs into the modern queue (using 'pending' status)
INSERT INTO analysis_queue (document_id, family_id, job_id, status, priority, estimated_tokens)
SELECT 
  dpq.document_id, 
  dpq.family_id, 
  aj.id, 
  'pending', 
  2, 
  5000
FROM document_processing_queue dpq
JOIN analysis_jobs aj ON dpq.family_id = aj.family_id AND aj.job_type = 'recovery'
WHERE dpq.status IN ('failed', 'queued', 'processing');

-- Step 1.3: Drop the legacy queue table
DROP TABLE IF EXISTS document_processing_queue CASCADE;