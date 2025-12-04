-- Add MESSAGE notification type if not exists
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'notification_type') THEN
    CREATE TYPE notification_type AS ENUM ('REFERRAL_REWARD', 'ACHIEVEMENT', 'MESSAGE');
  ELSE
    -- Add MESSAGE to existing enum if it doesn't exist
    ALTER TYPE notification_type ADD VALUE IF NOT EXISTS 'MESSAGE';
  END IF;
END $$;

-- Create trigger function to notify users of new messages
CREATE OR REPLACE FUNCTION notify_message_recipients()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  sender_name TEXT;
  recipient_id UUID;
BEGIN
  -- Get sender's display name
  SELECT display_name INTO sender_name
  FROM personas
  WHERE id = NEW.sender_id;

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
      LEFT(NEW.content, 100),
      jsonb_build_object(
        'conversation_id', NEW.conversation_id,
        'message_id', NEW.id
      )
    );
  END LOOP;

  RETURN NEW;
END;
$$;

-- Create trigger on messages table
DROP TRIGGER IF EXISTS on_message_created ON messages;
CREATE TRIGGER on_message_created
  AFTER INSERT ON messages
  FOR EACH ROW
  EXECUTE FUNCTION notify_message_recipients();