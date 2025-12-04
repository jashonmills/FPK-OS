-- Add new feature flags for timesheet and help center
INSERT INTO feature_flags (name, description, enabled)
VALUES 
  ('FEATURE_TIMESHEET', 'Enable My Timesheet page and functionality', true),
  ('FEATURE_HELP_CENTER', 'Enable Help Center and Onboarding Tour', true)
ON CONFLICT (name) DO NOTHING;