-- Phase 2: Database RPC Functions for Draft Course Preview
-- 
-- These functions provide secure, RLS-compliant access to draft courses
-- for authorized users (admins, instructors in the same org, or course creators)

-- Function 1: Get all preview courses (drafts) that the user has access to
CREATE OR REPLACE FUNCTION get_preview_courses(p_user_id UUID)
RETURNS SETOF courses
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT c.*
  FROM public.courses c
  LEFT JOIN public.user_roles ur ON ur.user_id = p_user_id
  WHERE 
    c.status = 'draft'
    AND (
      -- User is admin
      EXISTS (
        SELECT 1 FROM public.user_roles 
        WHERE user_id = p_user_id AND role = 'admin'
      )
      -- OR user created the course
      OR c.created_by = p_user_id
      -- OR user is instructor in same org (if course has org_id)
      OR (
        c.organization_id IS NOT NULL 
        AND EXISTS (
          SELECT 1 FROM public.org_members om
          WHERE om.user_id = p_user_id
            AND om.org_id = c.organization_id
            AND om.role IN ('owner', 'instructor')
            AND om.status = 'active'
        )
      )
    )
  ORDER BY c.updated_at DESC;
END;
$$;

-- Function 2: Get a specific course by slug (including drafts if user has access)
CREATE OR REPLACE FUNCTION get_course_by_slug_with_drafts(
  p_slug TEXT,
  p_user_id UUID
)
RETURNS SETOF courses
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT c.*
  FROM public.courses c
  WHERE 
    c.slug = p_slug
    AND (
      -- Published courses are accessible to everyone
      c.status = 'published'
      -- OR draft courses accessible to authorized users
      OR (
        c.status = 'draft'
        AND (
          -- User is admin
          EXISTS (
            SELECT 1 FROM public.user_roles 
            WHERE user_id = p_user_id AND role = 'admin'
          )
          -- OR user created the course
          OR c.created_by = p_user_id
          -- OR user is instructor in same org
          OR (
            c.organization_id IS NOT NULL 
            AND EXISTS (
              SELECT 1 FROM public.org_members om
              WHERE om.user_id = p_user_id
                AND om.org_id = c.organization_id
                AND om.role IN ('owner', 'instructor')
                AND om.status = 'active'
            )
          )
        )
      )
    )
  LIMIT 1;
END;
$$;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION get_preview_courses(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION get_course_by_slug_with_drafts(TEXT, UUID) TO authenticated;