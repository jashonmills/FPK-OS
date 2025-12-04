-- Create bookmarks table for saving posts
CREATE TABLE public.bookmarks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  post_id uuid NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  created_at timestamp with time zone DEFAULT now(),
  UNIQUE(user_id, post_id)
);

CREATE INDEX idx_bookmarks_user ON public.bookmarks(user_id);
CREATE INDEX idx_bookmarks_post ON public.bookmarks(post_id);

-- Enable RLS
ALTER TABLE public.bookmarks ENABLE ROW LEVEL SECURITY;

-- RLS Policies for bookmarks
CREATE POLICY "Users can manage own bookmarks"
  ON public.bookmarks FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create events table for community events
CREATE TABLE public.events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  event_date timestamp with time zone NOT NULL,
  end_date timestamp with time zone,
  location_type text CHECK (location_type IN ('VIRTUAL', 'IN_PERSON', 'HYBRID')),
  location_url text,
  location_address text,
  circle_id uuid REFERENCES circles(id) ON DELETE CASCADE,
  created_by uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

CREATE INDEX idx_events_date ON public.events(event_date);
CREATE INDEX idx_events_circle ON public.events(circle_id);
CREATE INDEX idx_events_creator ON public.events(created_by);

-- Enable RLS
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

-- RLS Policies for events
CREATE POLICY "Users can view events in their circles"
  ON public.events FOR SELECT
  USING (
    circle_id IS NULL OR
    EXISTS (
      SELECT 1 FROM circle_members
      WHERE circle_id = events.circle_id
      AND user_id = auth.uid()
    )
  );

CREATE POLICY "Circle members can create events"
  ON public.events FOR INSERT
  WITH CHECK (
    auth.uid() = created_by AND
    (circle_id IS NULL OR EXISTS (
      SELECT 1 FROM circle_members
      WHERE circle_id = events.circle_id
      AND user_id = auth.uid()
    ))
  );

CREATE POLICY "Event creators can update their events"
  ON public.events FOR UPDATE
  USING (auth.uid() = created_by);

CREATE POLICY "Event creators can delete their events"
  ON public.events FOR DELETE
  USING (auth.uid() = created_by);

-- Create function to get trending circles based on activity
CREATE OR REPLACE FUNCTION public.get_trending_circles(limit_count integer DEFAULT 5)
RETURNS TABLE (
  circle_id uuid,
  circle_name text,
  circle_description text,
  activity_score bigint,
  member_count bigint
) 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    c.id as circle_id,
    c.name as circle_name,
    c.description as circle_description,
    COUNT(DISTINCT p.id) as activity_score,
    COUNT(DISTINCT cm.user_id) as member_count
  FROM circles c
  LEFT JOIN posts p ON p.circle_id = c.id 
    AND p.created_at > NOW() - INTERVAL '48 hours'
  LEFT JOIN circle_members cm ON cm.circle_id = c.id
  WHERE c.is_private = false
  GROUP BY c.id, c.name, c.description
  ORDER BY activity_score DESC, member_count DESC
  LIMIT limit_count;
END;
$$;

-- Add feature flag for personalized home UI
INSERT INTO public.feature_flags (flag_name, is_enabled, description)
VALUES (
  'personalized_home_ui',
  true,
  'Enables the new three-column personalized home layout with widgets and profile banner'
)
ON CONFLICT (flag_name) DO NOTHING;