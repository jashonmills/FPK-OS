-- Restrict Mission Control to targeted users only
UPDATE feature_flags 
SET is_enabled = true,
    rollout_percentage = 0,
    target_users = '[]'::jsonb,
    updated_at = now()
WHERE flag_key = 'enable-ai-analysis-pipeline';