-- Update course cover images to use the correct storage bucket URLs

-- Update regular courses with correct thumbnail URLs
UPDATE courses 
SET thumbnail_url = 'https://zgcegkmqfgznbpdplscz.supabase.co/storage/v1/object/public/home-page/learning-state-course.jpg'
WHERE id = 'learning-state-beta';

UPDATE courses 
SET thumbnail_url = 'https://zgcegkmqfgznbpdplscz.supabase.co/storage/v1/object/public/home-page/el-spelling-course.jpg'
WHERE id = 'el-spelling-reading';

-- Update native courses with correct cover URLs  
UPDATE native_courses 
SET cover_url = 'https://zgcegkmqfgznbpdplscz.supabase.co/storage/v1/object/public/home-page/algebra-pathfinder-course.jpg'
WHERE slug = 'algebra-pathfinder-converted';