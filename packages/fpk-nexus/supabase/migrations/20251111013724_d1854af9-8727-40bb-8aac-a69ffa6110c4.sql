-- Fix the notify_message_recipients trigger to handle NULL content (file-only messages)
CREATE OR REPLACE FUNCTION public.notify_message_recipients()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  sender_name TEXT;
  recipient_id UUID;
  notification_message TEXT;
BEGIN
  -- Get sender's display name
  SELECT display_name INTO sender_name
  FROM personas
  WHERE id = NEW.sender_id;

  -- Create appropriate notification message
  IF NEW.content IS NULL OR trim(NEW.content) = '' THEN
    notification_message := 'Sent a file';
  ELSE
    notification_message := LEFT(NEW.content, 100);
  END IF;

  -- Insert notification for each participant except the sender
  FOR recipient_id IN 
    SELECT user_id 
    FROM conversation_participants 
    WHERE conversation_id = NEW.conversation_id 
    AND user_id != (SELECT user_id FROM personas WHERE id = NEW.sender_id)
  LOOP
    INSERT INTO notifications (user_id, type, title, message, metadata)
    VALUES (
      recipient_id,
      'MESSAGE',
      'New message from ' || COALESCE(sender_name, 'Someone'),
      notification_message,
      jsonb_build_object(
        'conversation_id', NEW.conversation_id,
        'message_id', NEW.id
      )
    );
  END LOOP;

  RETURN NEW;
END;
$function$;