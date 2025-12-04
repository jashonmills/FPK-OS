-- Sprint 1: Add contribution tracking columns to personas
ALTER TABLE public.personas 
ADD COLUMN IF NOT EXISTS posts_count integer DEFAULT 0 NOT NULL,
ADD COLUMN IF NOT EXISTS comments_count integer DEFAULT 0 NOT NULL,
ADD COLUMN IF NOT EXISTS supports_received_count integer DEFAULT 0 NOT NULL;

-- Sprint 2: Add customizable profile fields
ALTER TABLE public.personas
ADD COLUMN IF NOT EXISTS header_image_url text,
ADD COLUMN IF NOT EXISTS pinned_post_id uuid REFERENCES public.posts(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS social_links jsonb DEFAULT '{}'::jsonb;

-- Sprint 3: Create followers table
CREATE TABLE IF NOT EXISTS public.followers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  following_user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  followed_user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(following_user_id, followed_user_id),
  CHECK (following_user_id != followed_user_id)
);

-- Enable RLS on followers
ALTER TABLE public.followers ENABLE ROW LEVEL SECURITY;

-- RLS policies for followers
CREATE POLICY "Users can view all follow relationships"
  ON public.followers FOR SELECT
  USING (true);

CREATE POLICY "Users can follow others"
  ON public.followers FOR INSERT
  WITH CHECK (auth.uid() = following_user_id);

CREATE POLICY "Users can unfollow"
  ON public.followers FOR DELETE
  USING (auth.uid() = following_user_id);

-- Sprint 3: Create comment_reactions table
CREATE TABLE IF NOT EXISTS public.comment_reactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  comment_id uuid NOT NULL REFERENCES public.post_comments(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  reaction_type text NOT NULL DEFAULT 'support',
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(comment_id, user_id)
);

-- Enable RLS on comment_reactions
ALTER TABLE public.comment_reactions ENABLE ROW LEVEL SECURITY;

-- RLS policies for comment_reactions
CREATE POLICY "Users can view comment reactions"
  ON public.comment_reactions FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM post_comments pc
    JOIN posts p ON pc.post_id = p.id
    JOIN circle_members cm ON p.circle_id = cm.circle_id
    WHERE pc.id = comment_reactions.comment_id
    AND cm.user_id = auth.uid()
  ));

CREATE POLICY "Users can add reactions to comments"
  ON public.comment_reactions FOR INSERT
  WITH CHECK (
    auth.uid() = user_id
    AND EXISTS (
      SELECT 1 FROM post_comments pc
      JOIN posts p ON pc.post_id = p.id
      JOIN circle_members cm ON p.circle_id = cm.circle_id
      WHERE pc.id = comment_reactions.comment_id
      AND cm.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can remove their own reactions"
  ON public.comment_reactions FOR DELETE
  USING (auth.uid() = user_id);

-- Sprint 3: Create shares table
CREATE TABLE IF NOT EXISTS public.shares (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  original_post_id uuid NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
  sharing_user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(original_post_id, sharing_user_id)
);

-- Enable RLS on shares
ALTER TABLE public.shares ENABLE ROW LEVEL SECURITY;

-- RLS policies for shares
CREATE POLICY "Users can view shares of posts they can see"
  ON public.shares FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM posts p
    JOIN circle_members cm ON p.circle_id = cm.circle_id
    WHERE p.id = shares.original_post_id
    AND cm.user_id = auth.uid()
  ));

CREATE POLICY "Users can share posts they can see"
  ON public.shares FOR INSERT
  WITH CHECK (
    auth.uid() = sharing_user_id
    AND EXISTS (
      SELECT 1 FROM posts p
      JOIN circle_members cm ON p.circle_id = cm.circle_id
      WHERE p.id = shares.original_post_id
      AND cm.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can remove their own shares"
  ON public.shares FOR DELETE
  USING (auth.uid() = sharing_user_id);

-- Sprint 1: Create triggers for contribution tracking
-- Function to increment posts count
CREATE OR REPLACE FUNCTION public.increment_posts_count()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE personas
  SET posts_count = posts_count + 1
  WHERE id = NEW.author_id;
  RETURN NEW;
END;
$$;

-- Function to decrement posts count
CREATE OR REPLACE FUNCTION public.decrement_posts_count()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE personas
  SET posts_count = posts_count - 1
  WHERE id = OLD.author_id AND posts_count > 0;
  RETURN OLD;
END;
$$;

-- Function to increment comments count
CREATE OR REPLACE FUNCTION public.increment_comments_count()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE personas
  SET comments_count = comments_count + 1
  WHERE id = NEW.author_id;
  RETURN NEW;
END;
$$;

-- Function to decrement comments count
CREATE OR REPLACE FUNCTION public.decrement_comments_count()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE personas
  SET comments_count = comments_count - 1
  WHERE id = OLD.author_id AND comments_count > 0;
  RETURN OLD;
END;
$$;

-- Function to increment supports received count
CREATE OR REPLACE FUNCTION public.increment_supports_count()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE personas
  SET supports_received_count = supports_received_count + 1
  WHERE id = (SELECT author_id FROM posts WHERE id = NEW.post_id);
  RETURN NEW;
END;
$$;

-- Function to decrement supports received count
CREATE OR REPLACE FUNCTION public.decrement_supports_count()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE personas
  SET supports_received_count = supports_received_count - 1
  WHERE id = (SELECT author_id FROM posts WHERE id = OLD.post_id)
  AND supports_received_count > 0;
  RETURN OLD;
END;
$$;

-- Create triggers
DROP TRIGGER IF EXISTS posts_count_increment ON public.posts;
CREATE TRIGGER posts_count_increment
  AFTER INSERT ON public.posts
  FOR EACH ROW
  EXECUTE FUNCTION public.increment_posts_count();

DROP TRIGGER IF EXISTS posts_count_decrement ON public.posts;
CREATE TRIGGER posts_count_decrement
  AFTER DELETE ON public.posts
  FOR EACH ROW
  EXECUTE FUNCTION public.decrement_posts_count();

DROP TRIGGER IF EXISTS comments_count_increment ON public.post_comments;
CREATE TRIGGER comments_count_increment
  AFTER INSERT ON public.post_comments
  FOR EACH ROW
  EXECUTE FUNCTION public.increment_comments_count();

DROP TRIGGER IF EXISTS comments_count_decrement ON public.post_comments;
CREATE TRIGGER comments_count_decrement
  AFTER DELETE ON public.post_comments
  FOR EACH ROW
  EXECUTE FUNCTION public.decrement_comments_count();

DROP TRIGGER IF EXISTS supports_count_increment ON public.post_supports;
CREATE TRIGGER supports_count_increment
  AFTER INSERT ON public.post_supports
  FOR EACH ROW
  EXECUTE FUNCTION public.increment_supports_count();

DROP TRIGGER IF EXISTS supports_count_decrement ON public.post_supports;
CREATE TRIGGER supports_count_decrement
  AFTER DELETE ON public.post_supports
  FOR EACH ROW
  EXECUTE FUNCTION public.decrement_supports_count();

-- Initialize existing counts (run once)
UPDATE personas p
SET 
  posts_count = (SELECT COUNT(*) FROM posts WHERE author_id = p.id),
  comments_count = (SELECT COUNT(*) FROM post_comments WHERE author_id = p.id),
  supports_received_count = (
    SELECT COUNT(*) 
    FROM post_supports ps 
    JOIN posts po ON ps.post_id = po.id 
    WHERE po.author_id = p.id
  );