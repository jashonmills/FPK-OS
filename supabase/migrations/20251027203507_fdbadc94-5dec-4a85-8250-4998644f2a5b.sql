-- Fix security warning: Set search_path for the function
CREATE OR REPLACE FUNCTION is_conversation_admin(conv_id uuid, user_id uuid)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM conversation_participants
    WHERE conversation_id = conv_id
    AND user_id = user_id
    AND role = 'ADMIN'
  );
$$;