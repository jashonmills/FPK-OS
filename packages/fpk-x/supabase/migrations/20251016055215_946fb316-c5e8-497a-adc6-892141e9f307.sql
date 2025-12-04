-- Reset the initial document analysis status for re-analysis
UPDATE families 
SET initial_doc_analysis_status = 'pending'
WHERE id = 'e5c4f130-ffcb-4a0c-8dbc-d8089eb6f976';