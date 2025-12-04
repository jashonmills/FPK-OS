-- Add correct_part column to track what students got right in their answers
ALTER TABLE socratic_turns 
ADD COLUMN correct_part TEXT;