-- Upload course cover images to storage and update course records

-- First, create a courses bucket for storing course images (if it doesn't exist)
INSERT INTO storage.buckets (id, name, public) 
VALUES ('courses', 'courses', true)
ON CONFLICT (id) DO NOTHING;

-- Create RLS policies for the courses bucket
CREATE POLICY "Course images are publicly accessible" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'courses');

CREATE POLICY "Authenticated users can upload course images" 
ON storage.objects FOR INSERT 
WITH CHECK (bucket_id = 'courses' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update course images" 
ON storage.objects FOR UPDATE 
USING (bucket_id = 'courses' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete course images" 
ON storage.objects FOR DELETE 
USING (bucket_id = 'courses' AND auth.role() = 'authenticated');