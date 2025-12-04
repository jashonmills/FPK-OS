-- Fix native courses system - remove invalid foreign key reference

-- Drop the previous tables if they exist
DROP TABLE IF EXISTS public.attempt_answers CASCADE;
DROP TABLE IF EXISTS public.learning_attempts CASCADE;
DROP TABLE IF EXISTS public.native_enrollments CASCADE;
DROP TABLE IF EXISTS public.quiz_items CASCADE;
DROP TABLE IF EXISTS public.lesson_blocks CASCADE;
DROP TABLE IF EXISTS public.course_lessons CASCADE;
DROP TABLE IF EXISTS public.course_modules CASCADE;
DROP TABLE IF EXISTS public.native_courses CASCADE;

-- Create native courses system tables (fixed)

-- Native courses table (separate from SCORM courses)
CREATE TABLE public.native_courses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  summary TEXT,
  est_minutes INTEGER DEFAULT 0,
  cover_url TEXT,
  visibility TEXT NOT NULL DEFAULT 'draft' CHECK (visibility IN ('draft', 'published', 'archived')),
  created_by UUID,  -- Made nullable to avoid FK issues
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Course modules (organize lessons into sections)
CREATE TABLE public.course_modules (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  course_id UUID NOT NULL REFERENCES public.native_courses(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  order_index INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(course_id, order_index)
);

-- Course lessons (individual learning units)
CREATE TABLE public.course_lessons (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  module_id UUID NOT NULL REFERENCES public.course_modules(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  order_index INTEGER NOT NULL,
  est_minutes INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(module_id, order_index)
);

-- Lesson content blocks (rich content system)
CREATE TABLE public.lesson_blocks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  lesson_id UUID NOT NULL REFERENCES public.course_lessons(id) ON DELETE CASCADE,
  order_index INTEGER NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('rich-text', 'image', 'legacy-html', 'quiz')),
  data_json JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(lesson_id, order_index)
);

-- Quiz items for quiz blocks
CREATE TABLE public.quiz_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  block_id UUID NOT NULL REFERENCES public.lesson_blocks(id) ON DELETE CASCADE,
  kind TEXT NOT NULL CHECK (kind IN ('mcq', 'multi', 'numeric')),
  prompt TEXT NOT NULL,
  options_json JSONB DEFAULT '[]',
  answer_key_json JSONB NOT NULL DEFAULT '{}',
  points INTEGER NOT NULL DEFAULT 1,
  order_index INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(block_id, order_index)
);

-- Native course enrollments (reference auth.users properly)
CREATE TABLE public.native_enrollments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  course_id UUID NOT NULL REFERENCES public.native_courses(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'completed', 'dropped')),
  progress_pct INTEGER NOT NULL DEFAULT 0 CHECK (progress_pct >= 0 AND progress_pct <= 100),
  last_lesson_id UUID REFERENCES public.course_lessons(id),
  last_visit_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  enrolled_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE,
  UNIQUE(user_id, course_id)
);

-- Learning attempts for lessons with quizzes
CREATE TABLE public.learning_attempts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  lesson_id UUID NOT NULL REFERENCES public.course_lessons(id) ON DELETE CASCADE,
  started_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  submitted_at TIMESTAMP WITH TIME ZONE,
  score INTEGER DEFAULT 0,
  max_score INTEGER DEFAULT 0,
  policy TEXT NOT NULL DEFAULT 'best-of-all' CHECK (policy IN ('best-of-all', 'last', 'first')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Individual quiz answers
CREATE TABLE public.attempt_answers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  attempt_id UUID NOT NULL REFERENCES public.learning_attempts(id) ON DELETE CASCADE,
  item_id UUID NOT NULL REFERENCES public.quiz_items(id) ON DELETE CASCADE,
  response_json JSONB DEFAULT '{}',
  correct_bool BOOLEAN DEFAULT false,
  points_awarded INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(attempt_id, item_id)
);

-- Enable RLS on all tables
ALTER TABLE public.native_courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lesson_blocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.native_enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.learning_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attempt_answers ENABLE ROW LEVEL SECURITY;

-- RLS Policies for native_courses
CREATE POLICY "Anyone can view published courses" ON public.native_courses
  FOR SELECT USING (visibility = 'published');

CREATE POLICY "Course creators can manage their courses" ON public.native_courses
  FOR ALL USING (created_by = auth.uid());

CREATE POLICY "Admins can manage all courses" ON public.native_courses
  FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- RLS Policies for course_modules
CREATE POLICY "Anyone can view modules of published courses" ON public.course_modules
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.native_courses 
      WHERE id = course_modules.course_id AND visibility = 'published'
    )
  );

CREATE POLICY "Course owners can manage modules" ON public.course_modules
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.native_courses 
      WHERE id = course_modules.course_id AND created_by = auth.uid()
    )
  );

CREATE POLICY "Admins can manage all modules" ON public.course_modules
  FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- RLS Policies for course_lessons
CREATE POLICY "Anyone can view lessons of published courses" ON public.course_lessons
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.course_modules cm
      JOIN public.native_courses nc ON nc.id = cm.course_id
      WHERE cm.id = course_lessons.module_id AND nc.visibility = 'published'
    )
  );

CREATE POLICY "Course owners can manage lessons" ON public.course_lessons
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.course_modules cm
      JOIN public.native_courses nc ON nc.id = cm.course_id
      WHERE cm.id = course_lessons.module_id AND nc.created_by = auth.uid()
    )
  );

CREATE POLICY "Admins can manage all lessons" ON public.course_lessons
  FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- RLS Policies for lesson_blocks
CREATE POLICY "Anyone can view blocks of published courses" ON public.lesson_blocks
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.course_lessons cl
      JOIN public.course_modules cm ON cm.id = cl.module_id
      JOIN public.native_courses nc ON nc.id = cm.course_id
      WHERE cl.id = lesson_blocks.lesson_id AND nc.visibility = 'published'
    )
  );

CREATE POLICY "Course owners can manage blocks" ON public.lesson_blocks
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.course_lessons cl
      JOIN public.course_modules cm ON cm.id = cl.module_id
      JOIN public.native_courses nc ON nc.id = cm.course_id
      WHERE cl.id = lesson_blocks.lesson_id AND nc.created_by = auth.uid()
    )
  );

CREATE POLICY "Admins can manage all blocks" ON public.lesson_blocks
  FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- RLS Policies for quiz_items
CREATE POLICY "Anyone can view quiz items of published courses" ON public.quiz_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.lesson_blocks lb
      JOIN public.course_lessons cl ON cl.id = lb.lesson_id
      JOIN public.course_modules cm ON cm.id = cl.module_id
      JOIN public.native_courses nc ON nc.id = cm.course_id
      WHERE lb.id = quiz_items.block_id AND nc.visibility = 'published'
    )
  );

CREATE POLICY "Course owners can manage quiz items" ON public.quiz_items
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.lesson_blocks lb
      JOIN public.course_lessons cl ON cl.id = lb.lesson_id
      JOIN public.course_modules cm ON cm.id = cl.module_id
      JOIN public.native_courses nc ON nc.id = cm.course_id
      WHERE lb.id = quiz_items.block_id AND nc.created_by = auth.uid()
    )
  );

CREATE POLICY "Admins can manage all quiz items" ON public.quiz_items
  FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- RLS Policies for native_enrollments
CREATE POLICY "Users can view their own enrollments" ON public.native_enrollments
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can create their own enrollments" ON public.native_enrollments
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own enrollments" ON public.native_enrollments
  FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Admins can view all enrollments" ON public.native_enrollments
  FOR SELECT USING (has_role(auth.uid(), 'admin'::app_role));

-- RLS Policies for learning_attempts
CREATE POLICY "Users can view their own attempts" ON public.learning_attempts
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can create their own attempts" ON public.learning_attempts
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own attempts" ON public.learning_attempts
  FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Admins can view all attempts" ON public.learning_attempts
  FOR SELECT USING (has_role(auth.uid(), 'admin'::app_role));

-- RLS Policies for attempt_answers
CREATE POLICY "Users can view their own answers" ON public.attempt_answers
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.learning_attempts
      WHERE id = attempt_answers.attempt_id AND user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create their own answers" ON public.attempt_answers
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.learning_attempts
      WHERE id = attempt_answers.attempt_id AND user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can view all answers" ON public.attempt_answers
  FOR SELECT USING (has_role(auth.uid(), 'admin'::app_role));

-- Insert sample "Algebra Pathfinder (Converted from SCORM)" course
INSERT INTO public.native_courses (title, slug, summary, est_minutes, cover_url, visibility) VALUES (
  'Algebra Pathfinder (Converted from SCORM)',
  'algebra-pathfinder-converted',
  'Master algebra fundamentals through interactive lessons covering simplifying expressions and factorising polynomials.',
  240,
  'https://zgcegkmqfgznbpdplscz.supabase.co/storage/v1/object/public/home-page/algebra-cover.jpg',
  'published'
);