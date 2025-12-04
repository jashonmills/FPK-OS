-- Security Hardening: Add SET search_path to all functions
-- This prevents schema injection attacks

-- Fix cascade_group_course_assignment
CREATE OR REPLACE FUNCTION public.cascade_group_course_assignment()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
BEGIN
  IF TG_OP = 'INSERT' THEN
    INSERT INTO public.student_course_assignments (
      student_id, course_id, org_id, assigned_by, source_type, source_id
    )
    SELECT ogm.user_id, NEW.course_id, og.org_id, NEW.assigned_by, 'group', NEW.group_id
    FROM public.org_group_members ogm
    JOIN public.org_groups og ON og.id = ogm.group_id
    WHERE ogm.group_id = NEW.group_id
    ON CONFLICT (student_id, course_id, org_id) DO NOTHING;
  ELSIF TG_OP = 'DELETE' THEN
    DELETE FROM public.student_course_assignments
    WHERE course_id = OLD.course_id
    AND source_type = 'group'
    AND source_id = OLD.group_id;
  END IF;
  RETURN COALESCE(NEW, OLD);
END;
$function$;

-- Fix assign_group_courses_to_new_member
CREATE OR REPLACE FUNCTION public.assign_group_courses_to_new_member()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
BEGIN
  IF TG_OP = 'INSERT' THEN
    INSERT INTO public.student_course_assignments (
      student_id, course_id, org_id, assigned_by, source_type, source_id
    )
    SELECT NEW.user_id, ogca.course_id, og.org_id, ogca.assigned_by, 'group', NEW.group_id
    FROM public.org_group_course_assignments ogca
    JOIN public.org_groups og ON og.id = ogca.group_id
    WHERE ogca.group_id = NEW.group_id
    ON CONFLICT (student_id, course_id, org_id) DO NOTHING;
  END IF;
  RETURN NEW;
END;
$function$;

-- Fix auto_publish_scheduled_posts
CREATE OR REPLACE FUNCTION public.auto_publish_scheduled_posts()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
BEGIN
  UPDATE public.blog_posts
  SET status = 'published', published_at = NOW()
  WHERE status = 'scheduled' AND scheduled_for <= NOW();
END;
$function$;

-- Fix update_blog_updated_at
CREATE OR REPLACE FUNCTION public.update_blog_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$function$;

-- Fix generate_slug_from_title
CREATE OR REPLACE FUNCTION public.generate_slug_from_title()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
BEGIN
  IF NEW.slug IS NULL OR NEW.slug = '' THEN
    NEW.slug := LOWER(REGEXP_REPLACE(
      REGEXP_REPLACE(NEW.title, '[^a-zA-Z0-9\s-]', '', 'g'),
      '\s+', '-', 'g'
    ));
  END IF;
  RETURN NEW;
END;
$function$;

-- Fix calculate_post_metrics
CREATE OR REPLACE FUNCTION public.calculate_post_metrics()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
BEGIN
  NEW.word_count := COALESCE(array_length(regexp_split_to_array(NEW.content, '\s+'), 1), 0);
  NEW.read_time_minutes := GREATEST(1, ROUND(NEW.word_count::NUMERIC / 200));
  RETURN NEW;
END;
$function$;

-- Fix increment_tag_usage
CREATE OR REPLACE FUNCTION public.increment_tag_usage()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.blog_tags SET usage_count = usage_count + 1 WHERE id = NEW.tag_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.blog_tags SET usage_count = GREATEST(0, usage_count - 1) WHERE id = OLD.tag_id;
  END IF;
  RETURN COALESCE(NEW, OLD);
END;
$function$;

-- Fix update_phoenix_context_updated_at
CREATE OR REPLACE FUNCTION public.update_phoenix_context_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$function$;

-- Drop existing KB search function and recreate with proper signature
DROP FUNCTION IF EXISTS search_kb_embeddings(vector, float, int);

CREATE FUNCTION search_kb_embeddings(
  query_embedding vector(1536),
  match_threshold float DEFAULT 0.7,
  match_count int DEFAULT 20
)
RETURNS TABLE (
  document_id uuid,
  chunk_text text,
  similarity float
)
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    ke.document_id,
    ke.chunk_text,
    (1 - (ke.embedding <=> query_embedding))::float AS similarity
  FROM kb_embeddings ke
  WHERE (1 - (ke.embedding <=> query_embedding)) > match_threshold
  ORDER BY similarity DESC
  LIMIT match_count;
END;
$$;