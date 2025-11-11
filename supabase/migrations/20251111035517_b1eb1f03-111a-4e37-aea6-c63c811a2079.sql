-- Create user notification preferences table
CREATE TABLE IF NOT EXISTS public.user_notification_preferences (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  notification_type TEXT NOT NULL,
  is_enabled BOOLEAN NOT NULL DEFAULT true,
  sound_enabled BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, notification_type)
);

-- Enable RLS on notification preferences
ALTER TABLE public.user_notification_preferences ENABLE ROW LEVEL SECURITY;

-- Users can view their own preferences
CREATE POLICY "Users can view own notification preferences"
ON public.user_notification_preferences
FOR SELECT
USING (auth.uid() = user_id);

-- Users can insert their own preferences
CREATE POLICY "Users can insert own notification preferences"
ON public.user_notification_preferences
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Users can update their own preferences
CREATE POLICY "Users can update own notification preferences"
ON public.user_notification_preferences
FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Create index for faster lookups
CREATE INDEX idx_user_notification_preferences_user_id ON public.user_notification_preferences(user_id);

-- Create trigger function to call edge function for new messages
CREATE OR REPLACE FUNCTION public.trigger_notify_message_received()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  request_id bigint;
BEGIN
  -- Call the edge function asynchronously using pg_net
  SELECT net.http_post(
    url := current_setting('app.settings.supabase_url') || '/functions/v1/notify-message-received',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer ' || current_setting('app.settings.service_role_key')
    ),
    body := jsonb_build_object(
      'type', 'INSERT',
      'table', 'messages',
      'record', jsonb_build_object(
        'id', NEW.id,
        'conversation_id', NEW.conversation_id,
        'sender_id', NEW.sender_id,
        'content', NEW.content,
        'created_at', NEW.created_at
      )
    )
  ) INTO request_id;
  
  RETURN NEW;
END;
$$;

-- Note: The trigger creation requires pg_net extension which may not be available
-- Alternative: Use database webhook in Supabase dashboard instead
-- For now, we'll use the existing notify_message_recipients function
-- Users should configure a Database Webhook for the messages table INSERT event

-- Create trigger on messages table (using existing function as fallback)
DROP TRIGGER IF EXISTS on_message_created ON public.messages;
CREATE TRIGGER on_message_created
  AFTER INSERT ON public.messages
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_message_recipients();

-- Enable realtime for notifications table
ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;

-- Create function to initialize default notification preferences
CREATE OR REPLACE FUNCTION public.initialize_notification_preferences()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Insert default notification preferences for new users
  INSERT INTO public.user_notification_preferences (user_id, notification_type, is_enabled, sound_enabled)
  VALUES 
    (NEW.id, 'MESSAGE', true, true),
    (NEW.id, 'POST', true, true),
    (NEW.id, 'COMMENT', true, true),
    (NEW.id, 'SUPPORT', true, true),
    (NEW.id, 'FOLLOW', true, false),
    (NEW.id, 'SYSTEM', true, true)
  ON CONFLICT (user_id, notification_type) DO NOTHING;
  
  RETURN NEW;
END;
$$;

-- Create trigger to initialize preferences for new users
DROP TRIGGER IF EXISTS on_user_created_init_preferences ON auth.users;
CREATE TRIGGER on_user_created_init_preferences
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.initialize_notification_preferences();