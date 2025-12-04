-- Insert or update Public Speaking & Debate course
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
  'public-speaking-and-debate',
  'Public Speaking & Debate',
  'A crucial life-skill course that teaches students how to structure and deliver a persuasive speech, control body language, and engage in formal evidence-based debate.',
  'beginner',
  420,
  '/course-images/public-speaking-and-debate-thumbnail.jpg',
  '/course-images/public-speaking-and-debate-bg.jpg',
  false,
  ARRAY['Communication', 'Public Speaking', 'Debate', 'Life Skills'],
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