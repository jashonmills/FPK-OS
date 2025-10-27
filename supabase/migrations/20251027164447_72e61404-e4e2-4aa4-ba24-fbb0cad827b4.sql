-- Function to update posts count
CREATE OR REPLACE FUNCTION update_persona_posts_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE personas 
    SET posts_count = posts_count + 1
    WHERE id = NEW.author_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE personas 
    SET posts_count = GREATEST(0, posts_count - 1)
    WHERE id = OLD.author_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for posts
DROP TRIGGER IF EXISTS trigger_update_posts_count ON posts;
CREATE TRIGGER trigger_update_posts_count
  AFTER INSERT OR DELETE ON posts
  FOR EACH ROW
  EXECUTE FUNCTION update_persona_posts_count();

-- Function to update comments count
CREATE OR REPLACE FUNCTION update_persona_comments_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE personas 
    SET comments_count = comments_count + 1
    WHERE id = NEW.author_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE personas 
    SET comments_count = GREATEST(0, comments_count - 1)
    WHERE id = OLD.author_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for comments
DROP TRIGGER IF EXISTS trigger_update_comments_count ON post_comments;
CREATE TRIGGER trigger_update_comments_count
  AFTER INSERT OR DELETE ON post_comments
  FOR EACH ROW
  EXECUTE FUNCTION update_persona_comments_count();

-- Function to update supports received count
CREATE OR REPLACE FUNCTION update_persona_supports_count()
RETURNS TRIGGER AS $$
DECLARE
  post_author_id UUID;
BEGIN
  IF TG_OP = 'INSERT' THEN
    -- Get the author_id of the post that was supported
    SELECT author_id INTO post_author_id FROM posts WHERE id = NEW.post_id;
    UPDATE personas 
    SET supports_received_count = supports_received_count + 1
    WHERE id = post_author_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    -- Get the author_id of the post that was unsupported
    SELECT author_id INTO post_author_id FROM posts WHERE id = OLD.post_id;
    UPDATE personas 
    SET supports_received_count = GREATEST(0, supports_received_count - 1)
    WHERE id = post_author_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for supports
DROP TRIGGER IF EXISTS trigger_update_supports_count ON post_supports;
CREATE TRIGGER trigger_update_supports_count
  AFTER INSERT OR DELETE ON post_supports
  FOR EACH ROW
  EXECUTE FUNCTION update_persona_supports_count();

-- Fix existing counts for all personas
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