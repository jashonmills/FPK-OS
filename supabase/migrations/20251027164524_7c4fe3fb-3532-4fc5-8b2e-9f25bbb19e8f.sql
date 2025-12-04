-- Fix security warnings by setting search_path on new trigger functions
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
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public';

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
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public';

CREATE OR REPLACE FUNCTION update_persona_supports_count()
RETURNS TRIGGER AS $$
DECLARE
  post_author_id UUID;
BEGIN
  IF TG_OP = 'INSERT' THEN
    SELECT author_id INTO post_author_id FROM posts WHERE id = NEW.post_id;
    UPDATE personas 
    SET supports_received_count = supports_received_count + 1
    WHERE id = post_author_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    SELECT author_id INTO post_author_id FROM posts WHERE id = OLD.post_id;
    UPDATE personas 
    SET supports_received_count = GREATEST(0, supports_received_count - 1)
    WHERE id = post_author_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public';