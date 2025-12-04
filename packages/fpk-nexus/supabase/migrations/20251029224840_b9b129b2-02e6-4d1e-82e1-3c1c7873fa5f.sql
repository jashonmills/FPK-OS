-- Create a global chat conversation using GROUP type
INSERT INTO public.conversations (conversation_type, group_name, created_by)
SELECT 'GROUP', 'General Chat', id
FROM auth.users
LIMIT 1;

-- Create function to auto-add users to global chat
CREATE OR REPLACE FUNCTION public.auto_join_global_chat()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  global_chat_id UUID;
BEGIN
  -- Get the global chat conversation ID
  SELECT id INTO global_chat_id
  FROM conversations
  WHERE conversation_type = 'GROUP' AND group_name = 'General Chat'
  LIMIT 1;

  -- Add user to global chat if it exists
  IF global_chat_id IS NOT NULL THEN
    INSERT INTO conversation_participants (conversation_id, user_id, role)
    VALUES (global_chat_id, NEW.user_id, 'MEMBER')
    ON CONFLICT (conversation_id, user_id) DO NOTHING;
  END IF;

  RETURN NEW;
END;
$$;

-- Create trigger to auto-add users when persona is created
DROP TRIGGER IF EXISTS trigger_auto_join_global_chat ON public.personas;
CREATE TRIGGER trigger_auto_join_global_chat
AFTER INSERT ON public.personas
FOR EACH ROW
EXECUTE FUNCTION public.auto_join_global_chat();

-- Add all existing users to global chat
INSERT INTO conversation_participants (conversation_id, user_id, role)
SELECT 
  c.id as conversation_id,
  p.user_id,
  'MEMBER' as role
FROM conversations c
CROSS JOIN personas p
WHERE c.conversation_type = 'GROUP' AND c.group_name = 'General Chat'
ON CONFLICT (conversation_id, user_id) DO NOTHING;