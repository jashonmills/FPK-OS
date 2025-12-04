-- Insert or update Social Studies 6.2: World Geography & Cultures course
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
  'social-studies-6-2-world-geography-cultures',
  'social-studies-6-2-world-geography-cultures',
  'Social Studies 6.2: World Geography & Cultures',
  'Explore the Earth''s diverse physical landscapes and the vibrant human cultures that inhabit them, learning the tools of a geographer along the way.',
  '/course-images/social-studies-6-2-world-geography-cultures-bg.jpg',
  '/course-images/social-studies-6-2-world-geography-cultures-thumbnail.jpg',
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
DELETE FROM public.modules WHERE course_id = 'social-studies-6-2-world-geography-cultures';