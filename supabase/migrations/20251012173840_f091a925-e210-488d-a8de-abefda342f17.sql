-- Phase 1: Add framework_type and content_component columns to courses table
ALTER TABLE public.courses 
ADD COLUMN IF NOT EXISTS framework_type TEXT CHECK (framework_type IN ('sequential', 'micro-learning', 'single-embed')),
ADD COLUMN IF NOT EXISTS content_component TEXT;

-- Add helpful comment
COMMENT ON COLUMN public.courses.framework_type IS 'Defines how the course should be rendered: sequential (lesson-by-lesson), micro-learning (screen-based), or single-embed (iframe)';
COMMENT ON COLUMN public.courses.content_component IS 'Key to identify the course content - typically the course slug or component name';

-- Update existing EL Handwriting course with framework type
UPDATE public.courses 
SET 
  framework_type = 'sequential',
  content_component = 'el-handwriting'
WHERE slug = 'el-handwriting';

-- Update other known sequential courses (EL courses)
UPDATE public.courses 
SET 
  framework_type = 'sequential',
  content_component = slug
WHERE slug IN (
  'empowering-learning-handwriting',
  'el-spelling-reading',
  'empowering-learning-reading',
  'empowering-learning-numeracy',
  'optimal-learning-state',
  'empowering-learning-state',
  'learning-state-beta'
);

-- Update other known sequential courses (Interactive courses)
UPDATE public.courses 
SET 
  framework_type = 'sequential',
  content_component = slug
WHERE slug IN (
  'interactive-algebra',
  'interactive-trigonometry',
  'interactive-linear-equations',
  'logic-critical-thinking',
  'introduction-modern-economics',
  'neurodiversity-strengths-based-approach',
  'interactive-science'
);

-- Update Geometry as micro-learning
UPDATE public.courses 
SET 
  framework_type = 'micro-learning',
  content_component = 'geometry'
WHERE slug = 'geometry';

-- Update Video Production as single-embed
UPDATE public.courses 
SET 
  framework_type = 'single-embed',
  content_component = 'introduction-video-production'
WHERE slug = 'introduction-video-production' OR slug = 'video-production';

-- Update Money Management as sequential
UPDATE public.courses 
SET 
  framework_type = 'sequential',
  content_component = slug
WHERE slug = 'money-management-teens';