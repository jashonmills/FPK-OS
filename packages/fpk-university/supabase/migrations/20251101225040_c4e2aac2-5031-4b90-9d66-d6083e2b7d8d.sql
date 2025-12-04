-- Insert or update Personal Finance & Investing course
INSERT INTO courses (
  id,
  slug,
  title,
  description,
  difficulty_level,
  duration_minutes,
  thumbnail_url,
  background_image,
  discoverable,
  tags,
  content_version,
  framework_type,
  status
) VALUES (
  gen_random_uuid()::text,
  'personal-finance-and-investing',
  'Personal Finance & Investing',
  'Master your money. This essential life-skills course covers everything from budgeting and saving to understanding debt, credit, and the fundamentals of long-term investing.',
  'beginner',
  480,
  '/course-images/personal-finance-and-investing-thumbnail.jpg',
  '/course-images/personal-finance-and-investing-bg.jpg',
  false,
  ARRAY['Finance', 'Investing', 'Life Skills'],
  'v2',
  'sequential',
  'draft'
)
ON CONFLICT (slug) 
DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  difficulty_level = EXCLUDED.difficulty_level,
  duration_minutes = EXCLUDED.duration_minutes,
  thumbnail_url = EXCLUDED.thumbnail_url,
  background_image = EXCLUDED.background_image,
  tags = EXCLUDED.tags,
  content_version = EXCLUDED.content_version,
  framework_type = EXCLUDED.framework_type,
  updated_at = now();