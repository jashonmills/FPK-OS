-- Add 31 new courses to FPK University platform
-- Phase 1: Humanities through Mathematics (19 courses)

INSERT INTO public.courses (
  id, slug, title, description, framework_type, content_version,
  background_image, duration_minutes, difficulty_level, 
  status, tags, source, discoverable, created_at
)
VALUES
  -- Language Arts (3 courses)
  ('writing-composition', 'writing-composition', 'Writing & Composition: The Complete Essay', 
   'A comprehensive guide to mastering academic writing from building a powerful argument to mastering style and revision.',
   'sequential', 'v2', 
   'https://images.unsplash.com/photo-1455390582262-044cdead277a?q=80&w=1973&auto=format&fit=crop',
   540, 'High School', 'published', ARRAY['Language Arts'], 'platform', true, NOW()),
  
  ('creative-writing-short-stories-poetry', 'creative-writing-short-stories-poetry', 'Creative Writing: Short Stories & Poetry',
   'Unleash your inner author. This course provides the tools to craft compelling short stories and evocative poetry focusing on character development plot imagery and voice.',
   'sequential', 'v2',
   'https://images.unsplash.com/photo-1516410529446-addc68786424?q=80&w=2070&auto=format&fit=crop',
   420, 'High School', 'published', ARRAY['Language Arts'], 'platform', true, NOW()),

  ('intro-literature-analyzing-fiction', 'intro-literature-analyzing-fiction', 'Introduction to Literature: Analyzing Fiction',
   'This course moves beyond basic literacy to teach critical analysis. Students will learn about literary devices themes and symbolism by studying classic and modern short stories and novels.',
   'sequential', 'v2',
   'https://images.unsplash.com/photo-1456325504745-a0d6b5a45248?q=80&w=2070&auto=format&fit=crop',
   420, 'High School', 'published', ARRAY['Language Arts'], 'platform', true, NOW()),
  
  -- Science (5 courses)
  ('biology-study-of-life', 'biology-study-of-life', 'Biology: The Study of Life', 
   'An interactive exploration of the fundamental principles of life from the inner workings of cells and DNA to the dynamics of entire ecosystems.',
   'micro-learning', 'v2', 
   'https://images.unsplash.com/photo-1530026405182-282373c3e697?q=80&w=1975&auto=format&fit=crop',
   720, 'High School', 'published', ARRAY['Science'], 'platform', true, NOW()),

  ('chemistry-central-science', 'chemistry-central-science', 'Chemistry: The Central Science',
   'An interactive course exploring the composition structure and properties of matter. Covers the periodic table chemical reactions and the principles that govern the material world.',
   'micro-learning', 'v2',
   'https://images.unsplash.com/photo-1564325724739-bae0bd08762c?q=80&w=2070&auto=format&fit=crop',
   720, 'High School', 'published', ARRAY['Science'], 'platform', true, NOW()),

  ('physics-motion-energy-matter', 'physics-motion-energy-matter', 'Physics: Motion Energy and Matter',
   'Explore the fundamental laws that govern the universe. From the motion of planets to the flow of electricity this interactive course makes physics accessible and exciting.',
   'micro-learning', 'v2',
   'https://images.unsplash.com/photo-1581093590151-93c6866f3b06?q=80&w=2070&auto=format&fit=crop',
   720, 'High School', 'published', ARRAY['Science'], 'platform', true, NOW()),

  ('earth-science', 'earth-science', 'Earth Science: Our Planet in Space',
   'A comprehensive overview of our planet and its place in the universe covering geology meteorology oceanography and astronomy.',
   'sequential', 'v2',
   'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop',
   540, 'High School', 'published', ARRAY['Science'], 'platform', true, NOW()),

  ('ap-biology', 'ap-biology', 'AP Biology',
   'A college-level course exploring the core principles of biology from biochemistry and evolution to complex ecosystems. Aligned with the AP curriculum to prepare students for the exam.',
   'micro-learning', 'v2',
   'https://images.unsplash.com/photo-1532187863486-abf9db5a92a2?q=80&w=2070&auto=format&fit=crop',
   900, 'AP / College Level', 'published', ARRAY['Science'], 'platform', true, NOW()),

  -- Mathematics (3 courses)
  ('pre-calculus', 'pre-calculus', 'Pre-Calculus',
   'This course bridges the gap between Algebra and Calculus covering advanced functions trigonometry and analytical geometry to prepare students for higher-level mathematics.',
   'micro-learning', 'v2',
   'https://images.unsplash.com/photo-1635070045078-5e36053932dc?q=80&w=2070&auto=format&fit=crop',
   600, 'High School', 'published', ARRAY['Mathematics'], 'platform', true, NOW()),

  ('intro-calculus', 'intro-calculus', 'Introduction to Calculus',
   'An interactive introduction to the foundational concepts of calculus. This course covers limits derivatives and integrals essential for students pursuing STEM fields.',
   'micro-learning', 'v2',
   'https://images.unsplash.com/photo-1635070045078-5e36053932dc?q=80&w=2070&auto=format&fit=crop',
   600, 'High School', 'published', ARRAY['Mathematics'], 'platform', true, NOW()),

  ('calculus-2-integrals-series', 'calculus-2-integrals-series', 'Calculus II: Integrals & Series',
   'Master advanced integration explore its real-world applications and dive into the fascinating world of infinite series. The essential next step after Calculus I.',
   'micro-learning', 'v2',
   'https://images.unsplash.com/photo-1635070045078-5e36053932dc?q=80&w=2070&auto=format&fit=crop',
   720, 'University Level', 'published', ARRAY['Mathematics'], 'platform', true, NOW()),

  -- History (4 courses)
  ('world-history-ancient-modern', 'world-history-ancient-modern', 'World History: Ancient Civilizations to the Modern Era',
   'A sweeping survey of human history tracing the development of societies cultures and empires from the ancient world to the interconnected global stage of today.',
   'sequential', 'v2',
   'https://images.unsplash.com/photo-1618996932920-2a24059a4e33?q=80&w=2070&auto=format&fit=crop',
   600, 'High School', 'published', ARRAY['History'], 'platform', true, NOW()),

  ('us-history-founding-civil-war', 'us-history-founding-civil-war', 'U.S. History: Founding to Civil War',
   'Journey through the birth of a nation from the American Revolution and the creation of the Constitution to westward expansion and the crisis that led to the Civil War.',
   'sequential', 'v2',
   'https://images.unsplash.com/photo-1555992336-fb0c29498b13?q=80&w=1964&auto=format&fit=crop',
   540, 'High School', 'published', ARRAY['History'], 'platform', true, NOW()),

  ('irish-history-union-famine', 'irish-history-union-famine', 'Irish History: From the Union to the Great Famine',
   'Discover a pivotal century in Irish history from the loss of its parliament and the rise of Daniel O''Connell to the catastrophic Great Famine that changed Ireland forever.',
   'sequential', 'v2',
   'https://images.unsplash.com/photo-1558901803-5330a6c44319?q=80&w=2070&auto=format&fit=crop',
   540, 'High School', 'published', ARRAY['History'], 'platform', true, NOW()),

  ('ap-us-history', 'ap-us-history', 'AP U.S. History',
   'A comprehensive college-level survey of American history from 1491 to the present. Aligned with the AP curriculum this course emphasizes historical thinking skills and prepares students for the AP exam.',
   'sequential', 'v2',
   'https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=2070&auto=format&fit=crop',
   1080, 'AP / College Level', 'published', ARRAY['History'], 'platform', true, NOW()),

  -- Social Studies (3 courses)
  ('us-government-civics', 'us-government-civics', 'U.S. Government & Civics',
   'An essential guide to the structure and function of the United States government the rights and responsibilities of citizenship and the role of citizens in a democracy.',
   'sequential', 'v2',
   'https://images.unsplash.com/photo-1608315346237-82de9a83153c?q=80&w=2070&auto=format&fit=crop',
   480, 'High School', 'published', ARRAY['Social Studies'], 'platform', true, NOW()),

  ('irish-government-civics', 'irish-government-civics', 'Irish Government & Civics: Understanding the Republic',
   'An essential guide to the Irish political system. Explore the Oireachtas the Taoiseach the President and discover your rights and responsibilities as an Irish and EU citizen.',
   'sequential', 'v2',
   'https://images.unsplash.com/photo-1628349138437-1e04853807a4?q=80&w=2070&auto=format&fit=crop',
   480, 'High School', 'published', ARRAY['Social Studies'], 'platform', true, NOW()),

  ('introduction-to-psychology', 'introduction-to-psychology', 'Introduction to Psychology',
   'Why do we think feel and act the way we do? This course is a scientific journey into the human mind exploring everything from memory and emotion to mental health and social behavior.',
   'sequential', 'v2',
   'https://images.unsplash.com/photo-1544717297-fa95b6f55a8c?q=80&w=1974&auto=format&fit=crop',
   420, 'High School', 'published', ARRAY['Social Studies'], 'platform', true, NOW()),

  -- Humanities (1 course)
  ('introduction-to-philosophy', 'introduction-to-philosophy', 'Introduction to Philosophy',
   'What is real? How do we know what we know? What does it mean to be good? This course tackles the biggest questions in life introducing you to the foundational ideas of the world''s greatest thinkers.',
   'sequential', 'v2',
   'https://images.unsplash.com/photo-1550399105-c4db5fb85c18?q=80&w=2071&auto=format&fit=crop',
   420, 'High School', 'published', ARRAY['Humanities'], 'platform', true, NOW())

ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  framework_type = EXCLUDED.framework_type,
  background_image = EXCLUDED.background_image,
  duration_minutes = EXCLUDED.duration_minutes,
  difficulty_level = EXCLUDED.difficulty_level,
  tags = EXCLUDED.tags,
  updated_at = NOW();