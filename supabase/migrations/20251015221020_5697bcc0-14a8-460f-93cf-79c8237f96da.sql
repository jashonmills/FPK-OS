-- Create function to delete user account and all associated data
CREATE OR REPLACE FUNCTION public.delete_user_account(user_id_to_delete UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Verify the user is deleting their own account
  IF auth.uid() != user_id_to_delete THEN
    RAISE EXCEPTION 'You can only delete your own account';
  END IF;

  -- Delete from auth.users will cascade to most tables via foreign keys
  -- This is the safest approach as Supabase handles the cascade
  DELETE FROM auth.users WHERE id = user_id_to_delete;
END;
$$;