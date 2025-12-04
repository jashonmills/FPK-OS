-- Set 11 courses to draft status to move them to Coming Soon section
UPDATE courses 
SET status = 'draft'
WHERE id IN (
  'creative-writing-short-stories-poetry',
  'digital-art-graphic-design',
  'intro-literature-analyzing-fiction',
  'introduction-to-philosophy',
  'introduction-to-psychology',
  'irish-government-civics',
  'personal-finance-investing',
  'physics-motion-energy-matter',
  'us-government-civics',
  'us-history-founding-civil-war',
  'world-history-ancient-modern'
);