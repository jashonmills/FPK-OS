-- Add TTS Provider Feature Flags for runtime control
INSERT INTO phoenix_feature_flags (feature_name, is_enabled, description, configuration)
VALUES 
  (
    'tts_provider_google',
    true,
    'Enable Google Cloud TTS as primary provider',
    '{"priority": 1, "voices": {"betty": "en-US-Wavenet-F", "al": "en-US-Wavenet-D", "nite_owl": "en-US-Wavenet-E"}}'::jsonb
  ),
  (
    'tts_provider_elevenlabs',
    true,
    'Enable ElevenLabs TTS as fallback provider',
    '{"priority": 2, "voices": {"betty": "uYXf8XasLslADfZ2MB4u", "al": "wo6udizrrtpIxWGp2qJk", "nite_owl": "wo6udizrrtpIxWGp2qJk"}}'::jsonb
  ),
  (
    'tts_provider_openai',
    false,
    'Enable OpenAI TTS as fallback provider',
    '{"priority": 3, "voices": {"betty": "nova", "al": "onyx", "nite_owl": "shimmer"}}'::jsonb
  )
ON CONFLICT (feature_name) DO UPDATE
SET 
  description = EXCLUDED.description,
  configuration = EXCLUDED.configuration,
  updated_at = NOW();