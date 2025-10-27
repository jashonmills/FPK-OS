-- Sprint 1: Seed Default Content
-- Insert 4 default public circles owned by admin
INSERT INTO public.circles (id, name, description, is_private, created_by) VALUES
  ('11111111-1111-1111-1111-111111111111', 'Announcements', 'Official news and updates from the FPK Nexus team.', false, '993ff2c3-3ebb-495c-b8e1-e894e760d5e6'),
  ('22222222-2222-2222-2222-222222222222', 'Introductions', 'Welcome! Please take a moment to introduce yourself to the community.', false, '993ff2c3-3ebb-495c-b8e1-e894e760d5e6'),
  ('33333333-3333-3333-3333-333333333333', 'Ask the Community', 'Have a question? Need advice? Ask your fellow members here.', false, '993ff2c3-3ebb-495c-b8e1-e894e760d5e6'),
  ('44444444-4444-4444-4444-444444444444', 'Celebrating Wins', 'Share a positive story or a milestone, big or small. Let''s celebrate together!', false, '993ff2c3-3ebb-495c-b8e1-e894e760d5e6');

-- Add admin as ADMIN member of all default circles
INSERT INTO public.circle_members (circle_id, user_id, role) VALUES
  ('11111111-1111-1111-1111-111111111111', '993ff2c3-3ebb-495c-b8e1-e894e760d5e6', 'ADMIN'),
  ('22222222-2222-2222-2222-222222222222', '993ff2c3-3ebb-495c-b8e1-e894e760d5e6', 'ADMIN'),
  ('33333333-3333-3333-3333-333333333333', '993ff2c3-3ebb-495c-b8e1-e894e760d5e6', 'ADMIN'),
  ('44444444-4444-4444-4444-444444444444', '993ff2c3-3ebb-495c-b8e1-e894e760d5e6', 'ADMIN');

-- Create trigger to auto-join new users to public circles when they create a persona
CREATE OR REPLACE FUNCTION public.auto_join_public_circles()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Add new persona's user to all public circles
  INSERT INTO public.circle_members (circle_id, user_id, role)
  SELECT c.id, NEW.user_id, 'MEMBER'::circle_role
  FROM public.circles c
  WHERE c.is_private = false
  ON CONFLICT DO NOTHING;
  
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_persona_created_join_circles
  AFTER INSERT ON public.personas
  FOR EACH ROW
  EXECUTE FUNCTION public.auto_join_public_circles();

-- Sprint 2: Daily Engagement System
-- Create daily_prompts table
CREATE TABLE public.daily_prompts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  prompt_text text NOT NULL,
  day_of_week int NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6),
  created_at timestamptz DEFAULT now()
);

-- Create reflections table
CREATE TABLE public.reflections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  prompt_id uuid REFERENCES public.daily_prompts(id) ON DELETE CASCADE,
  author_id uuid REFERENCES public.personas(id) ON DELETE CASCADE NOT NULL,
  content text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.daily_prompts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reflections ENABLE ROW LEVEL SECURITY;

-- RLS Policies for daily_prompts
CREATE POLICY "Anyone can view daily prompts"
  ON public.daily_prompts FOR SELECT
  USING (true);

CREATE POLICY "Only admins can manage prompts"
  ON public.daily_prompts FOR ALL
  USING (public.has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

-- RLS Policies for reflections
CREATE POLICY "Users can view all reflections"
  ON public.reflections FOR SELECT
  USING (true);

CREATE POLICY "Users can create their own reflections"
  ON public.reflections FOR INSERT
  WITH CHECK (
    auth.uid() IN (SELECT user_id FROM public.personas WHERE id = author_id)
  );

CREATE POLICY "Users can update their own reflections"
  ON public.reflections FOR UPDATE
  USING (
    auth.uid() IN (SELECT user_id FROM public.personas WHERE id = author_id)
  );

CREATE POLICY "Users can delete their own reflections"
  ON public.reflections FOR DELETE
  USING (
    auth.uid() IN (SELECT user_id FROM public.personas WHERE id = author_id)
  );

-- Add updated_at trigger for reflections
CREATE TRIGGER update_reflections_updated_at
  BEFORE UPDATE ON public.reflections
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Seed daily prompts
INSERT INTO public.daily_prompts (prompt_text, day_of_week) VALUES
  ('What are you grateful for this week?', 0),
  ('What''s one small win you''re celebrating today?', 1),
  ('Share a lesson you learned recently', 2),
  ('What''s bringing you joy right now?', 3),
  ('What challenge are you working through?', 4),
  ('Share something that made you smile this week', 5),
  ('What are you looking forward to?', 6);