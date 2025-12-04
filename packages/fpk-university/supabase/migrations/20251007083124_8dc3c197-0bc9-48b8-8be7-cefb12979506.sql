-- Fix security warning: Add search_path to generate_activation_token function
CREATE OR REPLACE FUNCTION public.generate_activation_token()
RETURNS TEXT
LANGUAGE plpgsql
SET search_path = public
AS $$
DECLARE
  token TEXT;
BEGIN
  -- Generate a secure random token (12 characters, URL-safe)
  token := UPPER(SUBSTRING(MD5(RANDOM()::TEXT || CLOCK_TIMESTAMP()::TEXT) FROM 1 FOR 12));
  RETURN token;
END;
$$;