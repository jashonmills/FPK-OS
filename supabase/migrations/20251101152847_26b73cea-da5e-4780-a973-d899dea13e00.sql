-- Restore all original course images to their correct, unique branded images
-- Single Source of Truth: background_image and thumbnail_url should match

-- Interactive Math Courses
UPDATE courses 
SET 
  background_image = 'https://zgcegkmqfgznbpdplscz.supabase.co/storage/v1/object/public/course-images/linear-equations-unique-bg.jpg',
  thumbnail_url = 'https://zgcegkmqfgznbpdplscz.supabase.co/storage/v1/object/public/course-images/linear-equations-unique-bg.jpg'
WHERE slug = 'interactive-linear-equations';

UPDATE courses 
SET 
  background_image = 'https://zgcegkmqfgznbpdplscz.supabase.co/storage/v1/object/public/course-images/trigonometry-background.jpg',
  thumbnail_url = 'https://zgcegkmqfgznbpdplscz.supabase.co/storage/v1/object/public/course-images/trigonometry-background.jpg'
WHERE slug = 'interactive-trigonometry';

UPDATE courses 
SET 
  background_image = 'https://zgcegkmqfgznbpdplscz.supabase.co/storage/v1/object/public/course-images/linear-equations-background.jpg',
  thumbnail_url = 'https://zgcegkmqfgznbpdplscz.supabase.co/storage/v1/object/public/course-images/linear-equations-background.jpg'
WHERE slug = 'interactive-algebra';

UPDATE courses 
SET 
  background_image = 'https://zgcegkmqfgznbpdplscz.supabase.co/storage/v1/object/public/course-images/interactive-geometry-fundamentals-bg.jpg',
  thumbnail_url = 'https://zgcegkmqfgznbpdplscz.supabase.co/storage/v1/object/public/course-images/interactive-geometry-fundamentals-bg.jpg'
WHERE slug = 'geometry';

-- Empowering Learning Courses
UPDATE courses 
SET 
  background_image = 'https://zgcegkmqfgznbpdplscz.supabase.co/storage/v1/object/public/course-images/empowering-handwriting-bg.jpg',
  thumbnail_url = 'https://zgcegkmqfgznbpdplscz.supabase.co/storage/v1/object/public/course-images/empowering-handwriting-bg.jpg'
WHERE slug = 'empowering-learning-handwriting';

UPDATE courses 
SET 
  background_image = 'https://zgcegkmqfgznbpdplscz.supabase.co/storage/v1/object/public/course-images/el-handwriting-bg.jpg',
  thumbnail_url = 'https://zgcegkmqfgznbpdplscz.supabase.co/storage/v1/object/public/course-images/el-handwriting-bg.jpg'
WHERE slug = 'el-handwriting';

UPDATE courses 
SET 
  background_image = 'https://zgcegkmqfgznbpdplscz.supabase.co/storage/v1/object/public/course-images/empowering-numeracy-bg.jpg',
  thumbnail_url = 'https://zgcegkmqfgznbpdplscz.supabase.co/storage/v1/object/public/course-images/empowering-numeracy-bg.jpg'
WHERE slug = 'empowering-learning-numeracy';

UPDATE courses 
SET 
  background_image = 'https://zgcegkmqfgznbpdplscz.supabase.co/storage/v1/object/public/course-images/empowering-reading-bg.jpg',
  thumbnail_url = 'https://zgcegkmqfgznbpdplscz.supabase.co/storage/v1/object/public/course-images/empowering-reading-bg.jpg'
WHERE slug = 'empowering-learning-reading';

UPDATE courses 
SET 
  background_image = 'https://zgcegkmqfgznbpdplscz.supabase.co/storage/v1/object/public/course-images/empowering-spelling-new-bg.jpg',
  thumbnail_url = 'https://zgcegkmqfgznbpdplscz.supabase.co/storage/v1/object/public/course-images/empowering-spelling-new-bg.jpg'
WHERE slug = 'empowering-learning-spelling';

UPDATE courses 
SET 
  background_image = 'https://zgcegkmqfgznbpdplscz.supabase.co/storage/v1/object/public/course-images/elt-background-generated.jpg',
  thumbnail_url = 'https://zgcegkmqfgznbpdplscz.supabase.co/storage/v1/object/public/course-images/elt-background-generated.jpg'
WHERE slug = 'elt-empowering-learning-techniques';

-- Other Academic Courses
UPDATE courses 
SET 
  background_image = 'https://zgcegkmqfgznbpdplscz.supabase.co/storage/v1/object/public/course-images/logic-background.jpg',
  thumbnail_url = 'https://zgcegkmqfgznbpdplscz.supabase.co/storage/v1/object/public/course-images/logic-background.jpg'
WHERE slug = 'logic-critical-thinking';

UPDATE courses 
SET 
  background_image = 'https://zgcegkmqfgznbpdplscz.supabase.co/storage/v1/object/public/course-images/economics-background.jpg',
  thumbnail_url = 'https://zgcegkmqfgznbpdplscz.supabase.co/storage/v1/object/public/course-images/economics-background.jpg'
WHERE slug = 'introduction-modern-economics';

UPDATE courses 
SET 
  background_image = 'https://zgcegkmqfgznbpdplscz.supabase.co/storage/v1/object/public/course-images/science-background-generated.jpg',
  thumbnail_url = 'https://zgcegkmqfgznbpdplscz.supabase.co/storage/v1/object/public/course-images/science-background-generated.jpg'
WHERE slug = 'interactive-science';

UPDATE courses 
SET 
  background_image = 'https://zgcegkmqfgznbpdplscz.supabase.co/storage/v1/object/public/course-images/philosophy-bg.jpg',
  thumbnail_url = 'https://zgcegkmqfgznbpdplscz.supabase.co/storage/v1/object/public/course-images/philosophy-bg.jpg'
WHERE slug = 'introduction-to-philosophy';

-- Life Skills & Creative Courses
UPDATE courses 
SET 
  background_image = 'https://zgcegkmqfgznbpdplscz.supabase.co/storage/v1/object/public/course-images/money-management-background.jpg',
  thumbnail_url = 'https://zgcegkmqfgznbpdplscz.supabase.co/storage/v1/object/public/course-images/money-management-background.jpg'
WHERE slug = 'money-management-teens';

UPDATE courses 
SET 
  background_image = 'https://zgcegkmqfgznbpdplscz.supabase.co/storage/v1/object/public/course-images/creative-writing-bg.jpg',
  thumbnail_url = 'https://zgcegkmqfgznbpdplscz.supabase.co/storage/v1/object/public/course-images/creative-writing-bg.jpg'
WHERE slug = 'creative-writing-short-stories-poetry';

UPDATE courses 
SET 
  background_image = 'https://zgcegkmqfgznbpdplscz.supabase.co/storage/v1/object/public/course-images/drawing-sketching-bg.jpg',
  thumbnail_url = 'https://zgcegkmqfgznbpdplscz.supabase.co/storage/v1/object/public/course-images/drawing-sketching-bg.jpg'
WHERE slug = 'intro-drawing-sketching';

-- Special Topics
UPDATE courses 
SET 
  background_image = 'https://zgcegkmqfgznbpdplscz.supabase.co/storage/v1/object/public/course-images/neurodiversity-background.jpg',
  thumbnail_url = 'https://zgcegkmqfgznbpdplscz.supabase.co/storage/v1/object/public/course-images/neurodiversity-background.jpg'
WHERE slug = 'neurodiversity-strengths-based-approach';

UPDATE courses 
SET 
  background_image = 'https://zgcegkmqfgznbpdplscz.supabase.co/storage/v1/object/public/course-images/learning-state-course-bg.jpg',
  thumbnail_url = 'https://zgcegkmqfgznbpdplscz.supabase.co/storage/v1/object/public/course-images/learning-state-course-bg.jpg'
WHERE slug IN ('optimal-learning-state', 'learning-state-course');

-- Add database documentation
COMMENT ON COLUMN courses.background_image IS 
'Single source of truth for course branding. Used for both course cards and player backgrounds. Must be unique, branded images - NEVER use generic stock photos.';

COMMENT ON COLUMN courses.thumbnail_url IS 
'Thumbnail image URL. Should match background_image for consistency. Legacy field maintained for backwards compatibility.';