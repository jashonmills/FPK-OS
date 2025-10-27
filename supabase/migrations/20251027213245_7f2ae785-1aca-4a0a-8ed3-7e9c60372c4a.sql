-- Fix search_path for expire_old_bans function
CREATE OR REPLACE FUNCTION public.expire_old_bans()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE user_bans
  SET status = 'expired'
  WHERE status = 'active'
  AND expires_at < now();
END;
$$;