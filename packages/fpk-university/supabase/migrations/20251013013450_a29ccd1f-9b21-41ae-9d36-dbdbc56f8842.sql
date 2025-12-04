-- Add missing course assignments using correct course IDs
-- Note: course_id references the 'id' column, not the 'slug' column

INSERT INTO organization_course_assignments (organization_id, course_id, created_at)
VALUES 
  ('446d78ee-420e-4e9a-8d9d-00f06e897e7f', 'el-spelling', NOW()),
  ('446d78ee-420e-4e9a-8d9d-00f06e897e7f', 'learning-state-beta', NOW())
ON CONFLICT (organization_id, course_id) DO NOTHING;