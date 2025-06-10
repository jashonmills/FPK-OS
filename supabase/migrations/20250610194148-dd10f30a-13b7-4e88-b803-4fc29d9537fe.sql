
-- Step 1: Enhanced Database Schema

-- First, let's enhance the existing courses table with additional metadata
ALTER TABLE public.courses ADD COLUMN IF NOT EXISTS slug text UNIQUE;
ALTER TABLE public.courses ADD COLUMN IF NOT EXISTS status text DEFAULT 'draft';
ALTER TABLE public.courses ADD COLUMN IF NOT EXISTS instructor_name text;
ALTER TABLE public.courses ADD COLUMN IF NOT EXISTS duration_minutes integer;
ALTER TABLE public.courses ADD COLUMN IF NOT EXISTS difficulty_level text DEFAULT 'beginner';
ALTER TABLE public.courses ADD COLUMN IF NOT EXISTS tags text[] DEFAULT '{}';
ALTER TABLE public.courses ADD COLUMN IF NOT EXISTS thumbnail_url text;
ALTER TABLE public.courses ADD COLUMN IF NOT EXISTS price decimal(10,2) DEFAULT 0.00;
ALTER TABLE public.courses ADD COLUMN IF NOT EXISTS is_free boolean DEFAULT true;

-- Update the existing Learning State course with a slug
UPDATE public.courses SET slug = 'learning-state-beta' WHERE id = 'learning-state-beta';

-- Create modules table for dynamic course content
CREATE TABLE IF NOT EXISTS public.modules (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  course_id text NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  module_number integer NOT NULL,
  title text NOT NULL,
  description text,
  content_type text DEFAULT 'video', -- video, audio, pdf, text, interactive
  duration_minutes integer DEFAULT 0,
  metadata jsonb DEFAULT '{}', -- Store video_url, audio_url, pdf_url, etc.
  is_published boolean DEFAULT false,
  sort_order integer,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(course_id, module_number)
);

-- Create user_roles table for admin access
CREATE TYPE public.app_role AS ENUM ('admin', 'instructor', 'learner');

CREATE TABLE IF NOT EXISTS public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

-- Create security definer function to check user roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Create course_assets table for file management
CREATE TABLE IF NOT EXISTS public.course_assets (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  course_id text NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  module_id uuid REFERENCES public.modules(id) ON DELETE CASCADE,
  asset_type text NOT NULL, -- video, audio, pdf, image, document
  file_name text NOT NULL,
  file_path text NOT NULL,
  file_size bigint,
  mime_type text,
  uploaded_by uuid REFERENCES auth.users(id),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  metadata jsonb DEFAULT '{}'
);

-- Enable RLS on new tables
ALTER TABLE public.modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_assets ENABLE ROW LEVEL SECURITY;

-- RLS Policies for modules (public read, admin write)
CREATE POLICY "Anyone can view published modules" ON public.modules
  FOR SELECT USING (is_published = true);

CREATE POLICY "Admins can manage all modules" ON public.modules
  FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for user_roles (users can see their own roles, admins can manage all)
CREATE POLICY "Users can view their own roles" ON public.user_roles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all roles" ON public.user_roles
  FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for course_assets (admins can manage, learners can view published)
CREATE POLICY "Anyone can view published course assets" ON public.course_assets
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.modules m 
      WHERE m.id = module_id AND m.is_published = true
    )
  );

CREATE POLICY "Admins can manage all course assets" ON public.course_assets
  FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_courses_slug ON public.courses(slug);
CREATE INDEX IF NOT EXISTS idx_courses_status ON public.courses(status);
CREATE INDEX IF NOT EXISTS idx_courses_featured ON public.courses(featured);
CREATE INDEX IF NOT EXISTS idx_modules_course_id ON public.modules(course_id);
CREATE INDEX IF NOT EXISTS idx_modules_course_module ON public.modules(course_id, module_number);
CREATE INDEX IF NOT EXISTS idx_modules_published ON public.modules(is_published);
CREATE INDEX IF NOT EXISTS idx_enrollments_user_course ON public.enrollments(user_id, course_id);
CREATE INDEX IF NOT EXISTS idx_course_assets_course ON public.course_assets(course_id);
CREATE INDEX IF NOT EXISTS idx_course_assets_module ON public.course_assets(module_id);

-- Add triggers for updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_modules_updated_at BEFORE UPDATE ON public.modules
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample data for the Learning State course modules
INSERT INTO public.modules (course_id, module_number, title, description, content_type, metadata, is_published, sort_order) VALUES
('learning-state-beta', 1, 'Introduction to Learning State', 'Understanding the fundamentals of optimal learning states', 'interactive', '{"embed_url": "https://preview--course-start-kit-react.lovable.app/"}', true, 1),
('learning-state-beta', 2, 'Cognitive Load Theory', 'Managing mental resources for effective learning', 'interactive', '{"embed_url": "https://preview--course-start-kit-react.lovable.app/"}', true, 2),
('learning-state-beta', 3, 'Attention and Focus', 'Techniques for maintaining concentration', 'interactive', '{"embed_url": "https://preview--course-start-kit-react.lovable.app/"}', true, 3),
('learning-state-beta', 4, 'Memory and Retention', 'Strategies for long-term knowledge retention', 'interactive', '{"embed_url": "https://preview--course-start-kit-react.lovable.app/"}', true, 4),
('learning-state-beta', 5, 'Metacognition', 'Thinking about thinking: awareness of learning processes', 'interactive', '{"embed_url": "https://preview--course-start-kit-react.lovable.app/"}', true, 5)
ON CONFLICT (course_id, module_number) DO NOTHING;

-- Create storage bucket for course files
INSERT INTO storage.buckets (id, name, public) VALUES ('course-files', 'course-files', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for course files
CREATE POLICY "Anyone can view course files" ON storage.objects
FOR SELECT USING (bucket_id = 'course-files');

CREATE POLICY "Admins can upload course files" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'course-files' AND 
  public.has_role(auth.uid(), 'admin')
);

CREATE POLICY "Admins can update course files" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'course-files' AND 
  public.has_role(auth.uid(), 'admin')
);

CREATE POLICY "Admins can delete course files" ON storage.objects
FOR DELETE USING (
  bucket_id = 'course-files' AND 
  public.has_role(auth.uid(), 'admin')
);
