-- Fix the increment_blog_post_views function to resolve ambiguous column reference
DROP FUNCTION IF EXISTS increment_blog_post_views(TEXT);

CREATE OR REPLACE FUNCTION increment_blog_post_views(post_slug TEXT)
RETURNS TABLE(views_count INTEGER) 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_post_id UUID;
  v_current_views INTEGER;
BEGIN
  -- Get the post ID and current view count
  SELECT bp.id, bp.views_count 
  INTO v_post_id, v_current_views
  FROM blog_posts bp
  WHERE bp.slug = post_slug AND bp.status = 'published';
  
  IF v_post_id IS NULL THEN
    RAISE EXCEPTION 'Post not found or not published: %', post_slug;
  END IF;
  
  -- Increment the view count
  UPDATE blog_posts bp
  SET views_count = bp.views_count + 1
  WHERE bp.id = v_post_id;
  
  -- Insert analytics record
  INSERT INTO blog_analytics (post_id, date, views, unique_visitors)
  VALUES (v_post_id, CURRENT_DATE, 1, 1)
  ON CONFLICT (post_id, date) 
  DO UPDATE SET 
    views = blog_analytics.views + 1,
    unique_visitors = blog_analytics.unique_visitors + 1;
  
  -- Return the new view count
  RETURN QUERY 
  SELECT bp.views_count::INTEGER 
  FROM blog_posts bp 
  WHERE bp.id = v_post_id;
END;
$$;