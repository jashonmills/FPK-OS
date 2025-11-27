-- Update courses with missing slugs one by one
UPDATE courses SET slug = 'el-spelling-reading' WHERE id = 'el-spelling-reading' AND (slug IS NULL OR slug = '');

UPDATE courses SET slug = 'neurodiversity-strengths-based-approach' WHERE id = 'neurodiversity-strengths-based-approach' AND (slug IS NULL OR slug = '');

UPDATE courses SET slug = 'interactive-science' WHERE id = 'interactive-science' AND (slug IS NULL OR slug = '');