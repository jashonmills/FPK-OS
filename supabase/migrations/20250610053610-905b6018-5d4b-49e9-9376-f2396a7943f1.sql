
-- Enable RLS on enrollments table (if not already enabled)
ALTER TABLE public.enrollments ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist and recreate them
DROP POLICY IF EXISTS "Users can view their own enrollments" ON public.enrollments;
DROP POLICY IF EXISTS "Users can create their own enrollments" ON public.enrollments;
DROP POLICY IF EXISTS "Users can update their own enrollments" ON public.enrollments;
DROP POLICY IF EXISTS "Users can auto-enroll in Learning State beta" ON public.enrollments;

-- Create policies for enrollments table
CREATE POLICY "Users can view their own enrollments" 
  ON public.enrollments 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own enrollments" 
  ON public.enrollments 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own enrollments" 
  ON public.enrollments 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Create policy for auto-enrollment in Learning State beta course
CREATE POLICY "Users can auto-enroll in Learning State beta" 
  ON public.enrollments 
  FOR INSERT 
  WITH CHECK (
    auth.uid() = user_id AND 
    course_id = 'learning-state-beta'
  );

-- Ensure the Learning State beta course exists in the courses table
INSERT INTO public.courses (id, title, description, featured) 
VALUES (
  'learning-state-beta', 
  'Learning State (Beta)', 
  'Master the fundamentals of effective learning through cognitive science principles and practical strategies.',
  true
) 
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  featured = EXCLUDED.featured;

-- Auto-enroll all existing users in the Learning State beta course
INSERT INTO public.enrollments (user_id, course_id)
SELECT auth.users.id, 'learning-state-beta'
FROM auth.users
WHERE NOT EXISTS (
  SELECT 1 
  FROM public.enrollments 
  WHERE enrollments.user_id = auth.users.id 
  AND enrollments.course_id = 'learning-state-beta'
);

-- Add unique constraint to prevent duplicate enrollments
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'unique_user_course' 
        AND table_name = 'enrollments'
    ) THEN
        ALTER TABLE public.enrollments 
        ADD CONSTRAINT unique_user_course 
        UNIQUE (user_id, course_id);
    END IF;
END $$;
