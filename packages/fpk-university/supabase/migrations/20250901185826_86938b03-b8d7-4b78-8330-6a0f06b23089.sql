-- Get the current user and enroll them in the Algebra Pathfinder course
DO $$
DECLARE
    v_user_id UUID;
    v_course_id UUID;
BEGIN
    -- Get the last user from profiles (current user)
    SELECT id INTO v_user_id FROM profiles ORDER BY created_at DESC LIMIT 1;
    
    -- Get the Algebra Pathfinder course ID
    SELECT id INTO v_course_id FROM native_courses WHERE title = 'Algebra Pathfinder (Converted from SCORM)';
    
    -- Insert enrollment record
    IF v_user_id IS NOT NULL AND v_course_id IS NOT NULL THEN
        INSERT INTO native_enrollments (user_id, course_id, status, progress_pct, enrolled_at, last_visit_at)
        VALUES (v_user_id, v_course_id, 'active', 0, now(), now())
        ON CONFLICT (user_id, course_id) DO NOTHING;
    END IF;
END $$;