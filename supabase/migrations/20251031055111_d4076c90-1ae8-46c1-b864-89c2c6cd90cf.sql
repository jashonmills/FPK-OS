-- Fix search_path for notification functions with CASCADE
DROP FUNCTION IF EXISTS notify_task_assignment() CASCADE;
CREATE OR REPLACE FUNCTION notify_task_assignment()
RETURNS TRIGGER 
LANGUAGE plpgsql 
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Only create notification if assignee changed and is not null
  IF NEW.assignee_id IS NOT NULL AND (TG_OP = 'INSERT' OR OLD.assignee_id IS DISTINCT FROM NEW.assignee_id) THEN
    -- Don't notify if user assigned task to themselves
    IF NEW.assignee_id != NEW.created_by THEN
      INSERT INTO public.notifications (
        recipient_id,
        sender_id,
        task_id,
        type,
        content
      ) VALUES (
        NEW.assignee_id,
        COALESCE(NEW.created_by, auth.uid()),
        NEW.id,
        'task_assigned',
        'assigned you to a task'
      );
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

-- Recreate the trigger
CREATE TRIGGER task_assignment_notification
  AFTER INSERT OR UPDATE OF assignee_id ON public.tasks
  FOR EACH ROW
  EXECUTE FUNCTION notify_task_assignment();

DROP FUNCTION IF EXISTS notify_new_message() CASCADE;
CREATE OR REPLACE FUNCTION notify_new_message()
RETURNS TRIGGER 
LANGUAGE plpgsql 
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  participant RECORD;
  conv_type TEXT;
BEGIN
  -- Get conversation type
  SELECT type INTO conv_type
  FROM public.conversations
  WHERE id = NEW.conversation_id;

  -- Notify all participants except the sender
  FOR participant IN 
    SELECT user_id 
    FROM public.conversation_participants 
    WHERE conversation_id = NEW.conversation_id 
    AND user_id != NEW.sender_id
  LOOP
    INSERT INTO public.notifications (
      recipient_id,
      sender_id,
      type,
      content,
      metadata
    ) VALUES (
      participant.user_id,
      NEW.sender_id,
      CASE 
        WHEN conv_type = 'dm' THEN 'direct_message'
        ELSE 'channel_message'
      END,
      CASE 
        WHEN conv_type = 'dm' THEN 'sent you a direct message'
        ELSE 'sent a message in a channel'
      END,
      jsonb_build_object(
        'message_id', NEW.id,
        'conversation_id', NEW.conversation_id
      )
    );
  END LOOP;
  
  RETURN NEW;
END;
$$;

-- Recreate the trigger
CREATE TRIGGER new_message_notification
  AFTER INSERT ON public.messages
  FOR EACH ROW
  EXECUTE FUNCTION notify_new_message();