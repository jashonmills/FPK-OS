-- PHASE 2: Circuit Breaker & Telemetry Tables

-- Table to track extraction failures for circuit breaker
CREATE TABLE IF NOT EXISTS extraction_circuit_breaker (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  file_type TEXT NOT NULL,
  failure_count INTEGER DEFAULT 0,
  consecutive_failures INTEGER DEFAULT 0,
  last_failure_at TIMESTAMPTZ,
  last_success_at TIMESTAMPTZ,
  is_disabled BOOLEAN DEFAULT false,
  disabled_until TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(file_type)
);

-- Table for enhanced extraction telemetry
CREATE TABLE IF NOT EXISTS extraction_telemetry (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id UUID REFERENCES documents(id) ON DELETE CASCADE,
  family_id UUID REFERENCES families(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  file_type TEXT NOT NULL,
  file_size_kb NUMERIC NOT NULL,
  extraction_method TEXT NOT NULL, -- 'claude_vision', 'ocr_fallback', 'manual'
  model_used TEXT, -- e.g., 'claude-3-5-haiku-20241022'
  success BOOLEAN NOT NULL,
  error_type TEXT, -- 'timeout', 'file_too_large', 'api_error', etc.
  error_message TEXT,
  extraction_time_ms INTEGER,
  api_cost_estimate NUMERIC, -- estimated cost in cents
  extracted_length INTEGER,
  retry_count INTEGER DEFAULT 0,
  circuit_breaker_triggered BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Index for fast queries
CREATE INDEX idx_extraction_telemetry_family ON extraction_telemetry(family_id, created_at DESC);
CREATE INDEX idx_extraction_telemetry_success ON extraction_telemetry(success, created_at DESC);
CREATE INDEX idx_extraction_telemetry_file_type ON extraction_telemetry(file_type, success);

-- Function to update circuit breaker on failure
CREATE OR REPLACE FUNCTION update_circuit_breaker(
  p_file_type TEXT,
  p_success BOOLEAN
) RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF p_success THEN
    -- Reset consecutive failures on success
    INSERT INTO extraction_circuit_breaker (file_type, consecutive_failures, last_success_at)
    VALUES (p_file_type, 0, now())
    ON CONFLICT (file_type) 
    DO UPDATE SET
      consecutive_failures = 0,
      last_success_at = now(),
      is_disabled = false,
      disabled_until = NULL,
      updated_at = now();
  ELSE
    -- Increment failures
    INSERT INTO extraction_circuit_breaker (file_type, failure_count, consecutive_failures, last_failure_at)
    VALUES (p_file_type, 1, 1, now())
    ON CONFLICT (file_type)
    DO UPDATE SET
      failure_count = extraction_circuit_breaker.failure_count + 1,
      consecutive_failures = extraction_circuit_breaker.consecutive_failures + 1,
      last_failure_at = now(),
      -- Disable if 3+ consecutive failures
      is_disabled = CASE 
        WHEN extraction_circuit_breaker.consecutive_failures + 1 >= 3 THEN true
        ELSE extraction_circuit_breaker.is_disabled
      END,
      disabled_until = CASE
        WHEN extraction_circuit_breaker.consecutive_failures + 1 >= 3 THEN now() + INTERVAL '30 minutes'
        ELSE extraction_circuit_breaker.disabled_until
      END,
      updated_at = now();
  END IF;
END;
$$;

-- Function to check if extraction is allowed for file type
CREATE OR REPLACE FUNCTION is_extraction_allowed(p_file_type TEXT)
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COALESCE(
    NOT EXISTS (
      SELECT 1 FROM extraction_circuit_breaker
      WHERE file_type = p_file_type
        AND is_disabled = true
        AND (disabled_until IS NULL OR disabled_until > now())
    ),
    true
  );
$$;

-- View for extraction analytics
CREATE OR REPLACE VIEW extraction_analytics AS
SELECT
  DATE(created_at) as date,
  file_type,
  COUNT(*) as total_attempts,
  COUNT(*) FILTER (WHERE success = true) as successful,
  COUNT(*) FILTER (WHERE success = false) as failed,
  ROUND(AVG(extraction_time_ms) / 1000.0, 2) as avg_time_seconds,
  SUM(api_cost_estimate) as total_cost_cents,
  COUNT(*) FILTER (WHERE circuit_breaker_triggered = true) as circuit_breaker_hits
FROM extraction_telemetry
GROUP BY DATE(created_at), file_type
ORDER BY date DESC, file_type;