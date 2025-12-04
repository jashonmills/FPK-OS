-- Apply correct grade levels and subjects to all 60 published courses
-- Based on definitive course catalog mapping

-- ============================================
-- SENIOR CYCLE - 6th Year (12th Grade) - grade_level_id = 12
-- ============================================

-- AP Biology (already correct - Science)
UPDATE public.courses 
SET grade_level_id = 12, subject = 'Science', sequence_order = 1
WHERE id = 'ap-biology';

-- AP U.S. History → Social Studies
UPDATE public.courses 
SET grade_level_id = 12, subject = 'Social Studies', sequence_order = 1
WHERE id = 'ap-us-history';

-- Introduction to Modern Economics → Social Studies
UPDATE public.courses 
SET grade_level_id = 12, subject = 'Social Studies', sequence_order = 2
WHERE id = 'introduction-to-modern-economics';

-- Introduction to Literature: Analyzing Fiction → ELA
UPDATE public.courses 
SET grade_level_id = 12, subject = 'ELA', sequence_order = 1
WHERE id = 'introduction-to-literature-analyzing-fiction';

-- Personal Finance & Investing → Elective
UPDATE public.courses 
SET grade_level_id = 12, subject = 'Elective', sequence_order = 1
WHERE id = 'personal-finance-and-investing';

-- ============================================
-- SENIOR CYCLE - 5th Year (11th Grade) - grade_level_id = 11
-- ============================================

-- Introduction to Calculus → Math
UPDATE public.courses 
SET grade_level_id = 11, subject = 'Math', sequence_order = 1
WHERE id = 'introduction-to-calculus';

-- Interactive Trigonometry → Math
UPDATE public.courses 
SET grade_level_id = 11, subject = 'Math', sequence_order = 2
WHERE id = 'interactive-trigonometry';

-- Chemistry → Science
UPDATE public.courses 
SET grade_level_id = 11, subject = 'Science', sequence_order = 1
WHERE id = 'chemistry-the-central-science';

-- Physics → Science
UPDATE public.courses 
SET grade_level_id = 11, subject = 'Science', sequence_order = 2
WHERE id = 'physics-motion-energy-matter';

-- World History → Social Studies
UPDATE public.courses 
SET grade_level_id = 11, subject = 'Social Studies', sequence_order = 1
WHERE id = 'world-history-shaping-our-modern-world';

-- Public Speaking & Debate → Elective
UPDATE public.courses 
SET grade_level_id = 11, subject = 'Elective', sequence_order = 1
WHERE id = 'public-speaking-and-debate';

-- ============================================
-- JUNIOR CYCLE - 3rd Year (10th Grade) - grade_level_id = 10
-- ============================================

-- Pre-Calculus → Math
UPDATE public.courses 
SET grade_level_id = 10, subject = 'Math', sequence_order = 1
WHERE id = 'pre-calculus';

-- Interactive Linear Equations → Math
UPDATE public.courses 
SET grade_level_id = 10, subject = 'Math', sequence_order = 2
WHERE id = 'interactive-linear-equations';

-- Biology → Science
UPDATE public.courses 
SET grade_level_id = 10, subject = 'Science', sequence_order = 1
WHERE id = 'biology';

-- Introduction to Science → Science
UPDATE public.courses 
SET grade_level_id = 10, subject = 'Science', sequence_order = 2
WHERE id = 'introduction-to-science';

-- U.S. Government & Civics → Social Studies
UPDATE public.courses 
SET grade_level_id = 10, subject = 'Social Studies', sequence_order = 1
WHERE id = 'us-government-and-civics';

-- Irish Government & Civics → Social Studies
UPDATE public.courses 
SET grade_level_id = 10, subject = 'Social Studies', sequence_order = 2
WHERE id = 'irish-government-and-civics';

-- Creative Writing → ELA
UPDATE public.courses 
SET grade_level_id = 10, subject = 'ELA', sequence_order = 1
WHERE id = 'creative-writing';

-- Introduction to Philosophy → Elective
UPDATE public.courses 
SET grade_level_id = 10, subject = 'Elective', sequence_order = 1
WHERE id = 'introduction-to-philosophy';

-- Logic and Critical Thinking → Elective
UPDATE public.courses 
SET grade_level_id = 10, subject = 'Elective', sequence_order = 2
WHERE id = 'logic-and-critical-thinking';

-- ============================================
-- JUNIOR CYCLE - 2nd Year (9th Grade) - grade_level_id = 9
-- ============================================

-- Interactive Algebra → Math
UPDATE public.courses 
SET grade_level_id = 9, subject = 'Math', sequence_order = 1
WHERE id = 'interactive-algebra';

-- Interactive Geometry → Math
UPDATE public.courses 
SET grade_level_id = 9, subject = 'Math', sequence_order = 2
WHERE id = 'interactive-geometry';

-- Introduction to Psychology → ELA
UPDATE public.courses 
SET grade_level_id = 9, subject = 'ELA', sequence_order = 1
WHERE id = 'introduction-to-psychology';

-- Intro to Coding with Python → Technology
UPDATE public.courses 
SET grade_level_id = 9, subject = 'Technology', sequence_order = 1
WHERE id = 'intro-to-coding-with-python';

-- Web Development Basics → Technology
UPDATE public.courses 
SET grade_level_id = 9, subject = 'Technology', sequence_order = 2
WHERE id = 'web-development-basics';

-- Cybersecurity Fundamentals → Technology
UPDATE public.courses 
SET grade_level_id = 9, subject = 'Technology', sequence_order = 3
WHERE id = 'cybersecurity-fundamentals';

-- Introduction to Data Science → Technology
UPDATE public.courses 
SET grade_level_id = 9, subject = 'Technology', sequence_order = 4
WHERE id = 'introduction-to-data-science';

-- Digital Art & Graphic Design → Arts
UPDATE public.courses 
SET grade_level_id = 9, subject = 'Arts', sequence_order = 1
WHERE id = 'digital-art-and-graphic-design';

-- Introduction to Drawing & Sketching → Arts
UPDATE public.courses 
SET grade_level_id = 9, subject = 'Arts', sequence_order = 2
WHERE id = 'introduction-to-drawing-and-sketching';

-- Music Theory Fundamentals → Arts
UPDATE public.courses 
SET grade_level_id = 9, subject = 'Arts', sequence_order = 3
WHERE id = 'music-theory-fundamentals';

-- French 101 → Language
UPDATE public.courses 
SET grade_level_id = 9, subject = 'Language', sequence_order = 1
WHERE id = 'french-101';

-- German 101 → Language
UPDATE public.courses 
SET grade_level_id = 9, subject = 'Language', sequence_order = 2
WHERE id = 'german-for-beginners-101';

-- Spanish 101 → Language
UPDATE public.courses 
SET grade_level_id = 9, subject = 'Language', sequence_order = 3
WHERE id = 'spanish-101';

-- ============================================
-- JUNIOR CYCLE - 1st Year (8th Grade) - grade_level_id = 8
-- ============================================

-- Math 8.1, 8.2, 8.3 → Math
UPDATE public.courses 
SET grade_level_id = 8, subject = 'Math', sequence_order = 1
WHERE id = 'math-8-1';

UPDATE public.courses 
SET grade_level_id = 8, subject = 'Math', sequence_order = 2
WHERE id = 'math-8-2';

UPDATE public.courses 
SET grade_level_id = 8, subject = 'Math', sequence_order = 3
WHERE id = 'math-8-3';

-- ELA 8.1, 8.2, 8.3 → ELA
UPDATE public.courses 
SET grade_level_id = 8, subject = 'ELA', sequence_order = 1
WHERE id = 'ela-8-1';

UPDATE public.courses 
SET grade_level_id = 8, subject = 'ELA', sequence_order = 2
WHERE id = 'ela-8-2';

UPDATE public.courses 
SET grade_level_id = 8, subject = 'ELA', sequence_order = 3
WHERE id = 'ela-8-3';

-- Science 8.1, 8.2, 8.3 → Science
UPDATE public.courses 
SET grade_level_id = 8, subject = 'Science', sequence_order = 1
WHERE id = 'science-8-1';

UPDATE public.courses 
SET grade_level_id = 8, subject = 'Science', sequence_order = 2
WHERE id = 'science-8-2';

UPDATE public.courses 
SET grade_level_id = 8, subject = 'Science', sequence_order = 3
WHERE id = 'science-8-3';

-- Money Management for Teens → Life Skills
UPDATE public.courses 
SET grade_level_id = 8, subject = 'Life Skills', sequence_order = 1
WHERE id = 'money-management-for-teens';

-- ============================================
-- PRIMARY SCHOOL - 6th Class (7th Grade) - grade_level_id = 7
-- ============================================

-- Math 7.1, 7.2, 7.3 → Math
UPDATE public.courses 
SET grade_level_id = 7, subject = 'Math', sequence_order = 1
WHERE id = 'math-7-1';

UPDATE public.courses 
SET grade_level_id = 7, subject = 'Math', sequence_order = 2
WHERE id = 'math-7-2';

UPDATE public.courses 
SET grade_level_id = 7, subject = 'Math', sequence_order = 3
WHERE id = 'math-7-3';

-- ELA 7.1, 7.2, 7.3 → ELA
UPDATE public.courses 
SET grade_level_id = 7, subject = 'ELA', sequence_order = 1
WHERE id = 'ela-7-1';

UPDATE public.courses 
SET grade_level_id = 7, subject = 'ELA', sequence_order = 2
WHERE id = 'ela-7-2';

UPDATE public.courses 
SET grade_level_id = 7, subject = 'ELA', sequence_order = 3
WHERE id = 'ela-7-3';

-- Science 7.1, 7.2, 7.3 → Science
UPDATE public.courses 
SET grade_level_id = 7, subject = 'Science', sequence_order = 1
WHERE id = 'science-7-1';

UPDATE public.courses 
SET grade_level_id = 7, subject = 'Science', sequence_order = 2
WHERE id = 'science-7-2';

UPDATE public.courses 
SET grade_level_id = 7, subject = 'Science', sequence_order = 3
WHERE id = 'science-7-3';

-- ============================================
-- PRIMARY SCHOOL - 5th Class (6th Grade) - grade_level_id = 6
-- ============================================

-- Math 6.3 → Math
UPDATE public.courses 
SET grade_level_id = 6, subject = 'Math', sequence_order = 3
WHERE id = 'math-6-3';

-- Science 6.1, 6.2, 6.3 → Science
UPDATE public.courses 
SET grade_level_id = 6, subject = 'Science', sequence_order = 1
WHERE id = 'science-6-1';

UPDATE public.courses 
SET grade_level_id = 6, subject = 'Science', sequence_order = 2
WHERE id = 'science-6-2';

UPDATE public.courses 
SET grade_level_id = 6, subject = 'Science', sequence_order = 3
WHERE id = 'science-6-3';

-- Social Studies 6.1, 6.2, 6.3 → Social Studies
UPDATE public.courses 
SET grade_level_id = 6, subject = 'Social Studies', sequence_order = 1
WHERE id = 'social-studies-6-1';

UPDATE public.courses 
SET grade_level_id = 6, subject = 'Social Studies', sequence_order = 2
WHERE id = 'social-studies-6-2';

UPDATE public.courses 
SET grade_level_id = 6, subject = 'Social Studies', sequence_order = 3
WHERE id = 'social-studies-6-3';

-- ============================================
-- EMPOWERING LEARNING COLLECTION (No grade level)
-- ============================================

-- Neurodiversity: A Strengths-Based Approach → Life Skills
UPDATE public.courses 
SET grade_level_id = NULL, subject = 'Life Skills', sequence_order = 1
WHERE id = 'neurodiversity-a-strengths-based-approach';

-- EL Spelling → Life Skills
UPDATE public.courses 
SET grade_level_id = NULL, subject = 'Life Skills', sequence_order = 2
WHERE id = 'el-spelling';

-- EL Handwriting → Life Skills
UPDATE public.courses 
SET grade_level_id = NULL, subject = 'Life Skills', sequence_order = 3
WHERE id = 'el-handwriting';

-- EL Numeracy → Life Skills
UPDATE public.courses 
SET grade_level_id = NULL, subject = 'Life Skills', sequence_order = 4
WHERE id = 'el-numeracy';

-- EL Optimal Learning State → Life Skills
UPDATE public.courses 
SET grade_level_id = NULL, subject = 'Life Skills', sequence_order = 5
WHERE id = 'el-optimal-learning-state';

-- EL Reading → Life Skills
UPDATE public.courses 
SET grade_level_id = NULL, subject = 'Life Skills', sequence_order = 6
WHERE id = 'el-reading';