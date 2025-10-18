-- Function to increment blog post views and update analytics
CREATE OR REPLACE FUNCTION increment_blog_post_views(post_slug TEXT)
RETURNS TABLE(
  views_count INTEGER,
  success BOOLEAN
) 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_post_id UUID;
  v_views_count INTEGER;
  today DATE := CURRENT_DATE;
BEGIN
  -- Get post_id and increment views atomically
  UPDATE blog_posts
  SET views_count = views_count + 1
  WHERE slug = post_slug AND status = 'published'
  RETURNING id, blog_posts.views_count 
  INTO v_post_id, v_views_count;
  
  -- If post not found, return failure
  IF v_post_id IS NULL THEN
    RETURN QUERY SELECT 0, FALSE;
    RETURN;
  END IF;
  
  -- Insert or update daily analytics record
  INSERT INTO blog_analytics (post_id, date, views, unique_visitors)
  VALUES (v_post_id, today, 1, 1)
  ON CONFLICT (post_id, date) 
  DO UPDATE SET 
    views = blog_analytics.views + 1,
    unique_visitors = blog_analytics.unique_visitors + 1;
  
  -- Return success
  RETURN QUERY SELECT v_views_count, TRUE;
END;
$$;