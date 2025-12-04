-- Reset the initial doc analysis status for the family
-- This allows the first-look-analysis to run again

UPDATE families
SET initial_doc_analysis_status = 'pending'
WHERE id = 'e5c4f130-ffcb-4a0c-8dbc-d8089eb6f976';

-- Clear the previous partial data (goals, metrics, etc.) that may have been created with errors
DELETE FROM goals
WHERE family_id = 'e5c4f130-ffcb-4a0c-8dbc-d8089eb6f976'
AND created_at > '2025-10-16T05:30:00';

DELETE FROM document_metrics
WHERE family_id = 'e5c4f130-ffcb-4a0c-8dbc-d8089eb6f976'
AND created_at > '2025-10-16T05:30:00';

DELETE FROM progress_tracking
WHERE family_id = 'e5c4f130-ffcb-4a0c-8dbc-d8089eb6f976'
AND created_at > '2025-10-16T05:30:00';