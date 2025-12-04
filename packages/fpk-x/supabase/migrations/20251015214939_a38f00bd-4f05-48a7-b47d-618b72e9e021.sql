-- Populate feature_flags table with comprehensive flag configuration
-- Existing production features are enabled by default (is_enabled: true, rollout_percentage: 100)
-- Beta/experimental features are disabled by default (is_enabled: false, rollout_percentage: 0)

-- Core AI Features (All enabled - already in production)
INSERT INTO feature_flags (flag_key, flag_name, is_enabled, rollout_percentage, description) VALUES
('enable-ai-chat-assistant', 'AI Chat Assistant', true, 100, 'AI chat assistant widget with conversation support'),
('enable-ai-document-analysis', 'AI Document Analysis', true, 100, 'AI document text extraction and analysis'),
('enable-ai-daily-briefing', 'AI Daily Briefing', true, 100, 'AI-generated daily briefings on student progress'),
('enable-ai-trigger-analysis', 'AI Trigger Analysis', true, 100, 'AI incident trigger pattern analysis'),
('enable-ai-goal-suggestions', 'AI Goal Suggestions', true, 100, 'AI-suggested goal activities and recommendations'),
('enable-ai-resource-pack', 'AI Resource Pack', true, 100, 'Generate AI resource packs from documents'),
('enable-neurodiversity-background', 'Neurodiversity Background', true, 100, 'Generate neurodiversity background summaries')
ON CONFLICT (flag_key) DO UPDATE SET
  is_enabled = EXCLUDED.is_enabled,
  rollout_percentage = EXCLUDED.rollout_percentage,
  description = EXCLUDED.description;

-- Advanced Analytics Charts (Existing features - keep enabled)
INSERT INTO feature_flags (flag_key, flag_name, is_enabled, rollout_percentage, description) VALUES
('enable-chart-library-access', 'Chart Library Access', true, 100, 'Access to full analytics chart library'),
('enable-activity-log-chart', 'Activity Log Chart', true, 100, 'Daily activity counts visualization'),
('enable-mood-distribution-chart', 'Mood Distribution Chart', true, 100, 'Weekly mood distribution analysis'),
('enable-incident-frequency-chart', 'Incident Frequency Chart', true, 100, 'Incident frequency over time'),
('enable-intervention-effectiveness-chart', 'Intervention Effectiveness', true, 100, 'Intervention effectiveness tracking'),
('enable-behavior-function-analysis', 'Behavior Function Analysis', true, 100, 'Behavior function hypothesis analysis'),
('enable-iep-goal-tracker', 'IEP Goal Tracker', true, 100, 'IEP goal and service progress tracking'),
('enable-academic-fluency-trends', 'Academic Fluency Trends', true, 100, 'Academic fluency trends over time'),
('enable-social-interaction-funnel', 'Social Interaction Funnel', true, 100, 'Social interaction progression funnel'),
('enable-sensory-profile-heatmap', 'Sensory Profile Heatmap', true, 100, 'Sensory sensitivities heatmap visualization'),
('enable-prompting-level-fading', 'Prompting Level Fading', true, 100, 'Prompting level reduction tracking'),
('enable-sleep-behavior-correlation', 'Sleep Behavior Correlation', true, 100, 'Sleep quality vs behavior correlation'),
('enable-sleep-chart', 'Sleep Chart', true, 100, 'Sleep patterns and quality visualization'),
('enable-strategy-effectiveness', 'Strategy Effectiveness', true, 100, 'Teaching strategy effectiveness analysis'),
('enable-goal-progress-cards', 'Goal Progress Cards', true, 100, 'Visual goal progress tracking cards')
ON CONFLICT (flag_key) DO UPDATE SET
  is_enabled = EXCLUDED.is_enabled,
  rollout_percentage = EXCLUDED.rollout_percentage,
  description = EXCLUDED.description;

-- Integrations (Beta features - disabled by default)
INSERT INTO feature_flags (flag_key, flag_name, is_enabled, rollout_percentage, description) VALUES
('enable-garmin-integration', 'Garmin Integration', false, 0, 'Garmin wearable device integration (Beta)'),
('enable-garmin-demo', 'Garmin Demo', false, 0, 'Garmin simulator demo page (Beta)'),
('enable-live-data-hub', 'Live Data Hub', false, 0, 'Real-time biometric data hub (Beta)'),
('enable-google-calendar-sync', 'Google Calendar Sync', true, 100, 'Google Calendar synchronization'),
('enable-weather-integration', 'Weather Integration', true, 100, 'Automatic weather data for logs'),
('enable-biometric-alerts', 'Biometric Alerts', false, 0, 'Real-time biometric threshold alerts (Beta)')
ON CONFLICT (flag_key) DO UPDATE SET
  is_enabled = EXCLUDED.is_enabled,
  rollout_percentage = EXCLUDED.rollout_percentage,
  description = EXCLUDED.description;

-- Admin Features (Enabled for admins)
INSERT INTO feature_flags (flag_key, flag_name, is_enabled, rollout_percentage, description) VALUES
('enable-knowledge-base-manager', 'Knowledge Base Manager', true, 100, 'Admin knowledge base content management'),
('enable-kb-diagnostics', 'KB Diagnostics', true, 100, 'Knowledge base diagnostics and testing'),
('enable-stripe-admin', 'Stripe Admin', true, 100, 'Stripe integration admin dashboard'),
('enable-test-data-clearing', 'Test Data Clearing', true, 100, 'Clear test data functionality for admins')
ON CONFLICT (flag_key) DO UPDATE SET
  is_enabled = EXCLUDED.is_enabled,
  rollout_percentage = EXCLUDED.rollout_percentage,
  description = EXCLUDED.description;