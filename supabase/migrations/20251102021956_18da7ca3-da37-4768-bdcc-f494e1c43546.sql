-- Insert or update Social Studies 6.3: Introduction to Economics & Civics course
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
  discoverable
) VALUES (
  'social-studies-6-3-economics-civics',
  'social-studies-6-3-economics-civics',
  'Social Studies 6.3: Introduction to Economics & Civics',
  'An introduction to the fundamental principles of how economies work and the rights and responsibilities of being a citizen in a community.',
  '/course-images/social-studies-6-3-economics-civics-bg.jpg',
  '/course-images/social-studies-6-3-economics-civics-thumbnail.jpg',
  'sequential',
  'v2',
  'published',
  true
)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  background_image = EXCLUDED.background_image,
  thumbnail_url = EXCLUDED.thumbnail_url,
  framework_type = 'sequential',
  content_version = 'v2',
  status = 'published',
  discoverable = true;

-- Clean up any legacy module data
DELETE FROM public.modules WHERE course_id = 'social-studies-6-3-economics-civics';