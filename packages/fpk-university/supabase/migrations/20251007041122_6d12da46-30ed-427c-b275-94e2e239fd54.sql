-- Create organization assignments for St. Joseph Mail students
-- This fixes the issue where courses weren't showing in the catalog

DO $$
DECLARE
  v_org_id uuid := '446d78ee-420e-4e9a-8d9d-00f06e897e7f';
  v_owner_id uuid;
  v_assignment_id uuid;
  v_course_id text;
  v_student record;
BEGIN
  -- Get org owner
  SELECT owner_id INTO v_owner_id FROM organizations WHERE id = v_org_id;
  
  -- Process each platform course
  FOREACH v_course_id IN ARRAY ARRAY['el-handwriting', 'empowering-learning-numeracy', 'empowering-learning-reading', 'empowering-learning-state']
  LOOP
    -- Check if assignment already exists
    SELECT id INTO v_assignment_id 
    FROM org_assignments 
    WHERE org_id = v_org_id 
      AND type = 'course' 
      AND resource_id = v_course_id
    LIMIT 1;
    
    -- Insert if not exists
    IF v_assignment_id IS NULL THEN
      INSERT INTO org_assignments (org_id, type, resource_id, title, created_by, created_at)
      VALUES (v_org_id, 'course', v_course_id, 
              CASE v_course_id
                WHEN 'el-handwriting' THEN 'EL Handwriting'
                WHEN 'empowering-learning-numeracy' THEN 'Empowering Learning for Numeracy'
                WHEN 'empowering-learning-reading' THEN 'Empowering Learning for Reading'
                WHEN 'empowering-learning-state' THEN 'Optimal Learning State Course'
              END,
              v_owner_id, NOW())
      RETURNING id INTO v_assignment_id;
    END IF;
    
    -- Link to all active students using 'member' as target_type
    FOR v_student IN 
      SELECT user_id FROM org_members 
      WHERE org_id = v_org_id AND status = 'active' AND role = 'student'
    LOOP
      INSERT INTO org_assignment_targets (assignment_id, target_type, target_id)
      VALUES (v_assignment_id, 'member', v_student.user_id)
      ON CONFLICT DO NOTHING;
    END LOOP;
  END LOOP;
  
  -- Process native spelling course
  SELECT id INTO v_assignment_id 
  FROM org_assignments 
  WHERE org_id = v_org_id 
    AND type = 'course' 
    AND resource_id = '06efda03-9f0b-4c00-a064-eb65ada9fbae'
  LIMIT 1;
  
  IF v_assignment_id IS NULL THEN
    INSERT INTO org_assignments (org_id, type, resource_id, title, created_by, created_at)
    VALUES (v_org_id, 'course', '06efda03-9f0b-4c00-a064-eb65ada9fbae', 
            'Empowering Learning for Spelling', v_owner_id, NOW())
    RETURNING id INTO v_assignment_id;
  END IF;
  
  -- Link native course to all active students
  FOR v_student IN 
    SELECT user_id FROM org_members 
    WHERE org_id = v_org_id AND status = 'active' AND role = 'student'
  LOOP
    INSERT INTO org_assignment_targets (assignment_id, target_type, target_id)
    VALUES (v_assignment_id, 'member', v_student.user_id)
    ON CONFLICT DO NOTHING;
  END LOOP;
END $$;