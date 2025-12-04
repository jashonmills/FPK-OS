-- Update course titles to new EL naming convention
UPDATE courses 
SET 
  title = 'EL Reading',
  updated_at = now()
WHERE id = 'empowering-learning-reading';

UPDATE courses 
SET 
  title = 'EL Numeracy',
  updated_at = now()
WHERE id = 'empowering-learning-numeracy';

UPDATE courses 
SET 
  title = 'EL Optimal Learning State',
  updated_at = now()
WHERE id = 'learning-state-beta';