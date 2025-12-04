-- Add profile_image_url and personal_notes to students table
ALTER TABLE public.students
ADD COLUMN IF NOT EXISTS profile_image_url TEXT,
ADD COLUMN IF NOT EXISTS personal_notes TEXT;