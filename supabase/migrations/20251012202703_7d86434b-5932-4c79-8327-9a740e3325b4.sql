-- Create a secure function to fetch published courses
-- This bypasses RLS but only returns courses that meet visibility criteria
CREATE OR REPLACE FUNCTION get_published_courses()
RETURNS SETOF courses
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT *
  FROM public.courses
  WHERE status = 'published'
    AND (
      course_visibility = 'global'
      OR course_visibility IS NULL
    )
  ORDER BY created_at DESC;
$$;

-- Create a secure function to fetch a single course by slug
CREATE OR REPLACE FUNCTION get_published_course_by_slug(p_slug TEXT)
RETURNS SETOF courses
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT *
  FROM public.courses
  WHERE slug = p_slug
    AND status = 'published'
    AND (
      course_visibility = 'global'
      OR course_visibility IS NULL
    )
  LIMIT 1;
$$;