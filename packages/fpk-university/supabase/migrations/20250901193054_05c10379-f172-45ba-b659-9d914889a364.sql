-- Update course cover images

-- Update regular courses with thumbnail URLs
UPDATE courses 
SET thumbnail_url = 'https://zgcegkmqfgznbpdplscz.supabase.co/storage/v1/object/public/courses/learning-state-course.jpg'
WHERE id = 'learning-state-beta';

UPDATE courses 
SET thumbnail_url = 'https://zgcegkmqfgznbpdplscz.supabase.co/storage/v1/object/public/courses/el-spelling-course.jpg'
WHERE id = 'el-spelling-reading';

-- Update native courses with cover URLs  
UPDATE native_courses 
SET cover_url = 'https://zgcegkmqfgznbpdplscz.supabase.co/storage/v1/object/public/courses/algebra-pathfinder-course.jpg'
WHERE slug = 'algebra-pathfinder-converted';