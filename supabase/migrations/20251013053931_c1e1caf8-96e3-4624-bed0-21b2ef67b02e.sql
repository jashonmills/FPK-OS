-- Set all 31 new courses to be globally visible on FPK University platform
UPDATE public.courses
SET course_visibility = 'global'
WHERE slug IN (
  'writing-composition',
  'biology-study-of-life',
  'chemistry-central-science',
  'world-history-ancient-modern',
  'us-government-civics',
  'pre-calculus',
  'intro-coding-python',
  'spanish-101',
  'intro-psychology',
  'environmental-science',
  'physics-motion-energy',
  'us-history-colonial-modern',
  'calculus-ab',
  'statistics-data-analysis',
  'web-development-fundamentals',
  'data-structures-algorithms',
  'french-101',
  'mandarin-chinese-101',
  'music-theory-fundamentals',
  'digital-art-design',
  'theater-performance',
  'health-wellness',
  'career-readiness',
  'earth-science-geology',
  'anatomy-physiology',
  'microeconomics',
  'sociology-101',
  'philosophy-ethics',
  'creative-writing',
  'public-speaking',
  'personal-finance'
)
AND status = 'published';