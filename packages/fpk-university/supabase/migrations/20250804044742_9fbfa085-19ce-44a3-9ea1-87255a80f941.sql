-- Create table for storing Google OAuth tokens
CREATE TABLE public.google_oauth_tokens (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  access_token TEXT NOT NULL,
  refresh_token TEXT,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  scope TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.google_oauth_tokens ENABLE ROW LEVEL SECURITY;

-- Create policies for Google OAuth tokens
CREATE POLICY "Users can manage their own OAuth tokens" 
ON public.google_oauth_tokens 
FOR ALL 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Create table for tracking synced calendar events
CREATE TABLE public.synced_calendar_events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  google_event_id TEXT NOT NULL,
  local_event_type TEXT NOT NULL, -- 'goal', 'study_session', 'course_deadline'
  local_event_id UUID NOT NULL,
  calendar_id TEXT NOT NULL,
  synced_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  last_updated TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, google_event_id)
);

-- Enable RLS
ALTER TABLE public.synced_calendar_events ENABLE ROW LEVEL SECURITY;

-- Create policies for synced calendar events
CREATE POLICY "Users can manage their own synced events" 
ON public.synced_calendar_events 
FOR ALL 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Create trigger for updated_at on google_oauth_tokens
CREATE TRIGGER update_google_oauth_tokens_updated_at
BEFORE UPDATE ON public.google_oauth_tokens
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create trigger for updated_at on synced_calendar_events  
CREATE TRIGGER update_synced_calendar_events_updated_at
BEFORE UPDATE ON public.synced_calendar_events
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();