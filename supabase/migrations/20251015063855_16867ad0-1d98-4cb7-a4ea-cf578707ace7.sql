-- Add V2 Dialogue Engine feature flag (DISABLED by default for safe rollout)
INSERT INTO public.phoenix_feature_flags (feature_name, is_enabled, configuration, description)
VALUES (
  'v2_dialogue_engine_enabled',
  false, -- ← CRITICAL: Disabled by default for zero-risk deployment
  '{
    "provider": "claude_opus",
    "ssml_enabled": true,
    "fallback_to_v1": true,
    "voices": {
      "betty": "en-US-Wavenet-F",
      "al": "en-US-Wavenet-D"
    }
  }'::jsonb,
  'Enable V2 Live Dialogue Engine with Claude Opus scriptwriter and SSML multi-speaker audio. When disabled, system falls back to V1 co-response.'
)
ON CONFLICT (feature_name) DO NOTHING;