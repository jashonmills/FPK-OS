-- Update courses with missing slugs to have proper URL-friendly slugs
UPDATE courses 
SET slug = CASE 
  WHEN id = 'el-spelling-reading' THEN 'el-spelling-reading'
  WHEN id = 'neurodiversity-strengths-based-approach' THEN 'neurodiversity-strengths-based-approach'  
  WHEN id = 'interactive-science' THEN 'interactive-science'
  ELSE LOWER(REGEXP_REPLACE(REGEXP_REPLACE(title, '[^a-zA-Z0-9\s]', '', 'g'), '\s+', '-', 'g'))
END
WHERE slug IS NULL OR slug = '';

-- Ensure all future course inserts have slugs by adding a trigger
CREATE OR REPLACE FUNCTION generate_course_slug()
RETURNS TRIGGER AS $$
BEGIN
  -- If no slug provided, generate one from title
  IF NEW.slug IS NULL OR NEW.slug = '' THEN
    NEW.slug := LOWER(REGEXP_REPLACE(REGEXP_REPLACE(NEW.title, '[^a-zA-Z0-9\s]', '', 'g'), '\s+', '-', 'g'));
  END IF;
  
  -- Ensure slug is unique by appending a number if needed
  WHILE EXISTS (SELECT 1 FROM courses WHERE slug = NEW.slug AND id != COALESCE(NEW.id, '')) LOOP
    NEW.slug := NEW.slug || '-' || FLOOR(RANDOM() * 1000)::text;
  END LOOP;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create the trigger
DROP TRIGGER IF EXISTS course_slug_trigger ON courses;
CREATE TRIGGER course_slug_trigger
  BEFORE INSERT OR UPDATE ON courses
  FOR EACH ROW
  EXECUTE FUNCTION generate_course_slug();