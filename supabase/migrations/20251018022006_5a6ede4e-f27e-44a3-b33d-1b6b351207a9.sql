-- Add user to Mission Control target list
UPDATE feature_flags 
SET target_users = '["7871ccee-9185-4c22-9eb8-d1acdc3f02ab"]'::jsonb,
    updated_at = now()
WHERE flag_key = 'enable-ai-analysis-pipeline';