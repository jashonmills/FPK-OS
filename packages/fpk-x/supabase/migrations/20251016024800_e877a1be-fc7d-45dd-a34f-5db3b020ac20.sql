-- Enable the IEP Blueprint assessment
UPDATE feature_flags 
SET is_enabled = true, 
    rollout_percentage = 100,
    updated_at = now()
WHERE flag_key = 'enable-assessment-iep';