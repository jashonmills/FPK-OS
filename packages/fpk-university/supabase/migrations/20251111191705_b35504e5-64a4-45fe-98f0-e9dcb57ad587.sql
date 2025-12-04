-- Insert new EL Reading course (4-lesson original version)
INSERT INTO public.courses (
  id,
  slug,
  title,
  description,
  background_image,
  thumbnail_url,
  framework_type,
  content_version,
  status,
  discoverable,
  course_visibility
) VALUES (
  'el-reading',
  'el-reading',
  'EL Reading',
  'Master reading through optimal learning states and proper positioning. A focused 4-lesson program with video and audio support for confident, empowered reading.',
  '/course-images/el-reading-bg.jpg',
  '/course-images/el-reading-thumbnail.jpg',
  'sequential',
  'v2',
  'published',
  true,
  'global'
)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  background_image = EXCLUDED.background_image,
  thumbnail_url = EXCLUDED.thumbnail_url,
  framework_type = 'sequential',
  content_version = 'v2',
  status = 'published',
  discoverable = true,
  course_visibility = 'global';

-- Archive the old 10-lesson extended version
UPDATE public.courses
SET 
  slug = 'el-reading-extended',
  title = 'EL Reading (Extended Version)',
  status = 'draft',
  discoverable = false
WHERE id = 'empowering-learning-reading';

-- Clean up any legacy module data
DELETE FROM public.modules WHERE course_id IN ('el-reading', 'empowering-learning-reading');