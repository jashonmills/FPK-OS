-- Revert course slug back to el-spelling-reading for alignment with manifest folder
UPDATE public.courses
SET 
  slug = 'el-spelling-reading',
  updated_at = now()
WHERE id = 'el-spelling-reading' OR slug = 'empowering-learning-for-spelling';