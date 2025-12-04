-- Update French 101 course to use Sequential Framework
UPDATE courses 
SET 
  framework_type = 'sequential',
  background_image = 'https://zgcegkmqfgznbpdplscz.supabase.co/storage/v1/object/public/course-images/french-101-bg.jpg'
WHERE slug = 'french-101';