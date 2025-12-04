-- Phase 1 & 3: Create calendar_events table and update external_integrations

-- Update external_integrations to add status column if needed
ALTER TABLE public.external_integrations
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'active' CHECK (status IN ('active', 'revoked', 'expired', 'error'));

-- Create calendar_events table for storing synced events
CREATE TABLE IF NOT EXISTS public.calendar_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  family_id UUID NOT NULL REFERENCES public.families(id) ON DELETE CASCADE,
  integration_id UUID NOT NULL REFERENCES public.external_integrations(id) ON DELETE CASCADE,
  event_title TEXT NOT NULL,
  event_description TEXT,
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ NOT NULL,
  is_all_day BOOLEAN DEFAULT false,
  location TEXT,
  attendees JSONB DEFAULT '[]'::jsonb,
  original_event_id TEXT NOT NULL,
  provider TEXT NOT NULL CHECK (provider IN ('google_calendar', 'microsoft_calendar')),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(integration_id, original_event_id)
);

-- Enable RLS
ALTER TABLE public.calendar_events ENABLE ROW LEVEL SECURITY;

-- RLS Policies for calendar_events
CREATE POLICY "Family members can view their calendar events"
  ON public.calendar_events
  FOR SELECT
  USING (is_family_member(auth.uid(), family_id));

CREATE POLICY "Family owners can insert calendar events"
  ON public.calendar_events
  FOR INSERT
  WITH CHECK (is_family_owner(auth.uid(), family_id));

CREATE POLICY "Family owners can update calendar events"
  ON public.calendar_events
  FOR UPDATE
  USING (is_family_owner(auth.uid(), family_id));

CREATE POLICY "Family owners can delete calendar events"
  ON public.calendar_events
  FOR DELETE
  USING (is_family_owner(auth.uid(), family_id));

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_calendar_events_family_id ON public.calendar_events(family_id);
CREATE INDEX IF NOT EXISTS idx_calendar_events_integration_id ON public.calendar_events(integration_id);
CREATE INDEX IF NOT EXISTS idx_calendar_events_start_time ON public.calendar_events(start_time);
CREATE INDEX IF NOT EXISTS idx_calendar_events_end_time ON public.calendar_events(end_time);

-- Update trigger for calendar_events
CREATE TRIGGER update_calendar_events_updated_at
  BEFORE UPDATE ON public.calendar_events
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();