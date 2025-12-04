
-- Phase 2: Database Cleanup - Create cleanup function for expired invitations

-- Function to clean up expired and used invitations
CREATE OR REPLACE FUNCTION cleanup_expired_invitations()
RETURNS TABLE(
  table_name text,
  deleted_count bigint,
  cleanup_type text
) 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Clean up expired user_invites (email invitations)
  DELETE FROM user_invites 
  WHERE expires_at < NOW() OR is_used = true;
  
  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  table_name := 'user_invites';
  cleanup_type := 'expired_or_used';
  RETURN NEXT;
  
  -- Clean up expired org_invites (code invitations)
  DELETE FROM org_invites 
  WHERE expires_at < NOW();
  
  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  table_name := 'org_invites';
  cleanup_type := 'expired';
  RETURN NEXT;
  
  -- Clean up org_invites that have reached max uses
  DELETE FROM org_invites 
  WHERE uses_count >= max_uses;
  
  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  table_name := 'org_invites';
  cleanup_type := 'max_uses_reached';
  RETURN NEXT;
  
  -- Clean up orphaned invitations (where org no longer exists)
  DELETE FROM user_invites ui
  WHERE NOT EXISTS (SELECT 1 FROM organizations o WHERE o.id = ui.org_id);
  
  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  table_name := 'user_invites';
  cleanup_type := 'orphaned';
  RETURN NEXT;
  
  DELETE FROM org_invites oi
  WHERE NOT EXISTS (SELECT 1 FROM organizations o WHERE o.id = oi.org_id);
  
  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  table_name := 'org_invites';
  cleanup_type := 'orphaned';
  RETURN NEXT;
END;
$$;

-- Grant execute permission to authenticated users (admins only via RLS on function call)
GRANT EXECUTE ON FUNCTION cleanup_expired_invitations() TO authenticated;

-- Add helpful comment
COMMENT ON FUNCTION cleanup_expired_invitations() IS 
'Cleans up expired, used, maxed-out, and orphaned invitation records from both user_invites and org_invites tables. Returns counts of deleted records by type.';
