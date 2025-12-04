
-- Create notifications table
CREATE TABLE public.notifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  read_status BOOLEAN NOT NULL DEFAULT false,
  action_url TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add RLS policies for notifications
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Users can view their own notifications
CREATE POLICY "Users can view their own notifications" 
  ON public.notifications 
  FOR SELECT 
  USING (auth.uid() = user_id);

-- Users can update their own notifications (mark as read)
CREATE POLICY "Users can update their own notifications" 
  ON public.notifications 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- System can insert notifications for users
CREATE POLICY "System can insert notifications" 
  ON public.notifications 
  FOR INSERT 
  WITH CHECK (true);

-- Enable real-time for notifications
ALTER TABLE public.notifications REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;

-- Create course_media table for multimedia support
CREATE TABLE public.course_media (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  module_id UUID REFERENCES public.modules(id) ON DELETE CASCADE,
  media_type TEXT NOT NULL, -- 'video', 'audio', 'document', 'image'
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_size BIGINT,
  mime_type TEXT,
  duration_seconds INTEGER, -- for video/audio
  thumbnail_url TEXT,
  captions_url TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add RLS policies for course media
ALTER TABLE public.course_media ENABLE ROW LEVEL SECURITY;

-- Allow public read access to course media
CREATE POLICY "Public can view course media" 
  ON public.course_media 
  FOR SELECT 
  USING (true);

-- Only authenticated users can manage course media
CREATE POLICY "Authenticated users can manage course media" 
  ON public.course_media 
  FOR ALL 
  USING (auth.role() = 'authenticated');

-- Create storage buckets for course media
INSERT INTO storage.buckets (id, name, public) 
VALUES 
  ('course-videos', 'course-videos', true),
  ('course-audio', 'course-audio', true),
  ('course-documents', 'course-documents', true),
  ('course-images', 'course-images', true);

-- Create storage policies for course media buckets
CREATE POLICY "Public can view course media files" 
  ON storage.objects 
  FOR SELECT 
  USING (bucket_id IN ('course-videos', 'course-audio', 'course-documents', 'course-images'));

CREATE POLICY "Authenticated users can upload course media" 
  ON storage.objects 
  FOR INSERT 
  WITH CHECK (auth.role() = 'authenticated' AND bucket_id IN ('course-videos', 'course-audio', 'course-documents', 'course-images'));

CREATE POLICY "Authenticated users can update course media" 
  ON storage.objects 
  FOR UPDATE 
  USING (auth.role() = 'authenticated' AND bucket_id IN ('course-videos', 'course-audio', 'course-documents', 'course-images'));

CREATE POLICY "Authenticated users can delete course media" 
  ON storage.objects 
  FOR DELETE 
  USING (auth.role() = 'authenticated' AND bucket_id IN ('course-videos', 'course-audio', 'course-documents', 'course-images'));
