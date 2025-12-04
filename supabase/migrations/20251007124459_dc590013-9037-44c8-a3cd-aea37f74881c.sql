-- Create function to generate activation token
CREATE OR REPLACE FUNCTION public.generate_activation_token()
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  token TEXT;
BEGIN
  -- Generate a 12-character uppercase hex token
  LOOP
    token := UPPER(substring(md5(random()::text || clock_timestamp()::text) from 1 for 12));
    -- Ensure uniqueness
    EXIT WHEN NOT EXISTS (
      SELECT 1 FROM public.org_students 
      WHERE activation_token = token 
      AND token_expires_at > now()
    );
  END LOOP;
  
  RETURN token;
END;
$$;