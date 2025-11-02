-- Create grade_levels lookup table
CREATE TABLE IF NOT EXISTS public.grade_levels (
  id INTEGER PRIMARY KEY,
  us_name TEXT NOT NULL,
  irish_name TEXT NOT NULL,
  stage TEXT NOT NULL,
  display_order INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert K-12 mapping (13 grade levels)
INSERT INTO public.grade_levels (id, us_name, irish_name, stage, display_order) VALUES
  (0,  'Kindergarten', 'Junior Infants', 'Primary School', 0),
  (1,  '1st Grade',    'Senior Infants', 'Primary School', 1),
  (2,  '2nd Grade',    '1st Class',      'Primary School', 2),
  (3,  '3rd Grade',    '2nd Class',      'Primary School', 3),
  (4,  '4th Grade',    '3rd Class',      'Primary School', 4),
  (5,  '5th Grade',    '4th Class',      'Primary School', 5),
  (6,  '6th Grade',    '5th Class',      'Primary School', 6),
  (7,  '7th Grade',    '6th Class',      'Primary School', 7),
  (8,  '8th Grade',    '1st Year',       'Junior Cycle',   8),
  (9,  '9th Grade',    '2nd Year',       'Junior Cycle',   9),
  (10, '10th Grade',   '3rd Year',       'Junior Cycle',   10),
  (11, '11th Grade',   '5th Year',       'Senior Cycle',   11),
  (12, '12th Grade',   '6th Year',       'Senior Cycle',   12);

-- Add index for efficient lookups
CREATE INDEX idx_grade_levels_stage ON public.grade_levels(stage);

-- Enable RLS
ALTER TABLE public.grade_levels ENABLE ROW LEVEL SECURITY;

-- Allow public read access (reference data)
CREATE POLICY "Public read access for grade levels"
  ON public.grade_levels FOR SELECT
  USING (true);

COMMENT ON TABLE public.grade_levels IS 'Reference table mapping U.S. grade levels to Irish educational system';

-- Add new columns to courses table
ALTER TABLE public.courses 
  ADD COLUMN IF NOT EXISTS grade_level_id INTEGER REFERENCES public.grade_levels(id),
  ADD COLUMN IF NOT EXISTS subject TEXT,
  ADD COLUMN IF NOT EXISTS sequence_order INTEGER DEFAULT 1;

-- Create indexes for filtering and sorting
CREATE INDEX IF NOT EXISTS idx_courses_grade_level ON public.courses(grade_level_id);
CREATE INDEX IF NOT EXISTS idx_courses_subject ON public.courses(subject);
CREATE INDEX IF NOT EXISTS idx_courses_grade_subject ON public.courses(grade_level_id, subject, sequence_order);

-- Add check constraint for valid subjects
ALTER TABLE public.courses ADD CONSTRAINT valid_subject 
  CHECK (subject IS NULL OR subject IN (
    'Math', 'ELA', 'Science', 'Social Studies', 
    'History', 'Language', 'Arts', 'Elective', 
    'Technology', 'Life Skills', 'Other'
  ));

COMMENT ON COLUMN public.courses.grade_level_id IS 'Foreign key to grade_levels table';
COMMENT ON COLUMN public.courses.subject IS 'Subject category (Math, ELA, Science, etc.)';
COMMENT ON COLUMN public.courses.sequence_order IS 'Order within subject (e.g., Math 7.1, 7.2, 7.3)';

-- Backfill Grade 6 courses (id=6)
UPDATE public.courses 
SET 
  grade_level_id = 6,
  subject = 'Math',
  sequence_order = 3
WHERE id = 'math-6-3-algebra-stats-probability' AND grade_level_id IS NULL;

UPDATE public.courses 
SET 
  grade_level_id = 6,
  subject = 'Science',
  sequence_order = CAST(SUBSTRING(title FROM 'Science 6\.(\d):') AS INTEGER)
WHERE title ~* '^Science 6\.\d:' AND grade_level_id IS NULL;

UPDATE public.courses 
SET 
  grade_level_id = 6,
  subject = 'Social Studies',
  sequence_order = CAST(SUBSTRING(title FROM 'Social Studies 6\.(\d):') AS INTEGER)
WHERE title ~* '^Social Studies 6\.\d:' AND grade_level_id IS NULL;

-- Backfill Grade 7 courses (id=7)
UPDATE public.courses 
SET 
  grade_level_id = 7,
  subject = 'Math',
  sequence_order = CAST(SUBSTRING(title FROM 'Math 7\.(\d):') AS INTEGER)
WHERE title ~* '^Math 7\.\d:' AND grade_level_id IS NULL;

UPDATE public.courses 
SET 
  grade_level_id = 7,
  subject = 'ELA',
  sequence_order = CAST(SUBSTRING(title FROM 'ELA 7\.(\d):') AS INTEGER)
WHERE title ~* '^ELA 7\.\d:' AND grade_level_id IS NULL;

UPDATE public.courses 
SET 
  grade_level_id = 7,
  subject = 'Science',
  sequence_order = CAST(SUBSTRING(title FROM 'Science 7\.(\d):') AS INTEGER)
WHERE title ~* '^Science 7\.\d:' AND grade_level_id IS NULL;

UPDATE public.courses 
SET 
  grade_level_id = 7,
  subject = 'Social Studies',
  sequence_order = CAST(SUBSTRING(title FROM 'Social Studies 7\.(\d):') AS INTEGER)
WHERE title ~* '^Social Studies 7\.\d:' AND grade_level_id IS NULL;

-- Backfill Grade 8 courses (id=8)
UPDATE public.courses 
SET 
  grade_level_id = 8,
  subject = 'Math',
  sequence_order = CAST(SUBSTRING(title FROM 'Math 8\.(\d):') AS INTEGER)
WHERE title ~* '^Math 8\.\d:' AND grade_level_id IS NULL;

UPDATE public.courses 
SET 
  grade_level_id = 8,
  subject = 'ELA',
  sequence_order = CAST(SUBSTRING(title FROM 'ELA 8\.(\d):') AS INTEGER)
WHERE title ~* '^ELA 8\.\d:' AND grade_level_id IS NULL;

UPDATE public.courses 
SET 
  grade_level_id = 8,
  subject = 'Science',
  sequence_order = CAST(SUBSTRING(title FROM 'Science 8\.(\d):') AS INTEGER)
WHERE title ~* '^Science 8\.\d:' AND grade_level_id IS NULL;

UPDATE public.courses 
SET 
  grade_level_id = 8,
  subject = 'Social Studies',
  sequence_order = CAST(SUBSTRING(title FROM 'Social Studies 8\.(\d):') AS INTEGER)
WHERE title ~* '^Social Studies 8\.\d:' AND grade_level_id IS NULL;

-- Backfill high school/advanced courses (grades 11-12)
UPDATE public.courses 
SET 
  grade_level_id = 11,
  subject = 'Science',
  sequence_order = 1
WHERE id IN ('ap-biology', 'biology-the-study-of-life', 'chemistry-central-science', 'physics-motion-energy-matter') 
  AND grade_level_id IS NULL;

UPDATE public.courses 
SET 
  grade_level_id = 11,
  subject = 'Math',
  sequence_order = 1
WHERE id IN ('introduction-to-calculus', 'pre-calculus', 'interactive-algebra', 'interactive-trigonometry', 'interactive-linear-equations', 'geometry') 
  AND grade_level_id IS NULL;

UPDATE public.courses 
SET 
  grade_level_id = 11,
  subject = 'History',
  sequence_order = 1
WHERE id IN ('ap-us-history', 'world-history-ancient-to-modern') 
  AND grade_level_id IS NULL;

UPDATE public.courses 
SET 
  grade_level_id = 11,
  subject = 'Language',
  sequence_order = 1
WHERE id IN ('french-101', 'german-101', 'spanish-101') 
  AND grade_level_id IS NULL;

UPDATE public.courses 
SET 
  grade_level_id = 11,
  subject = 'Technology',
  sequence_order = 1
WHERE id IN ('intro-coding-python', 'web-dev-basics', 'cybersecurity-fundamentals', 'intro-data-science') 
  AND grade_level_id IS NULL;

UPDATE public.courses 
SET 
  grade_level_id = 11,
  subject = 'Elective',
  sequence_order = 1
WHERE id IN (
  'creative-writing-short-stories-poetry',
  'public-speaking-debate',
  'introduction-to-literature-analyzing-fiction',
  'introduction-to-philosophy',
  'introduction-to-psychology',
  'logic-critical-thinking',
  'introduction-modern-economics',
  'digital-art-graphic-design',
  'intro-drawing-sketching',
  'music-theory-fundamentals',
  'money-management-teens',
  'personal-finance-investing',
  'neurodiversity-strengths-based-approach',
  'interactive-science',
  'introduction-video-production'
) AND grade_level_id IS NULL;

-- Backfill "Empowering Learning" collection (no grade, special category)
UPDATE public.courses 
SET subject = 'Life Skills'
WHERE id = 'el-spelling' AND grade_level_id IS NULL;

-- Set any remaining NULL subjects to 'Elective'
UPDATE public.courses 
SET subject = 'Elective'
WHERE subject IS NULL AND status = 'published';