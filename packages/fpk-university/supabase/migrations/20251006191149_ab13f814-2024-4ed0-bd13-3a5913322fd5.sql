-- Enable pgcrypto extension for secure random byte generation
-- This fixes the "function gen_random_bytes(integer) does not exist" error
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Verify the extension is enabled
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_extension WHERE extname = 'pgcrypto'
  ) THEN
    RAISE EXCEPTION 'pgcrypto extension could not be enabled';
  END IF;
END $$;