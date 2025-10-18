-- Enable Mission Control Analytics
UPDATE feature_flags 
SET is_enabled = true, 
    rollout_percentage = 100,
    updated_at = now()
WHERE flag_key = 'enable-ai-analysis-pipeline';