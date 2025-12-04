-- Hide new courses from organization view by setting them to draft status
UPDATE courses 
SET status = 'draft'
WHERE id IN (
  'ap-biology',
  'ap-us-history', 
  'biology-study-of-life',
  'calculus-2-integrals-series',
  'chemistry-central-science',
  'writing-composition',
  'intro-calculus',
  'pre-calculus',
  'earth-science',
  'irish-history-union-famine',
  'spanish-101',
  'intro-coding-python',
  'intro-drawing-sketching',
  'cybersecurity-fundamentals',
  'web-dev-basics',
  'german-101',
  'french-101',
  'public-speaking-debate',
  'intro-data-science',
  'music-theory-fundamentals'
);