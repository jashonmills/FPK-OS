-- Add background_image column to courses table
ALTER TABLE courses 
ADD COLUMN IF NOT EXISTS background_image text;