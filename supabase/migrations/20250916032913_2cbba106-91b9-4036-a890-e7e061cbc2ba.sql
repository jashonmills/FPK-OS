-- Insert modules for Money Management for Teens course
INSERT INTO public.modules (
  id,
  course_id,
  title,
  description,
  module_number,
  is_published,
  estimated_duration_minutes,
  created_at,
  updated_at
) VALUES 
(
  gen_random_uuid(),
  'money-management-teens',
  'Financial Foundations',
  'Understanding money, financial psychology, family conversations, and teen entrepreneurship basics.',
  1,
  true,
  64,  -- 16 screens * 4 minutes avg
  now(),
  now()
),
(
  gen_random_uuid(),
  'money-management-teens',
  'Banking and Accounts',
  'Learn about banking services, account types, ATM safety, and choosing the right bank.',
  2,
  true,
  36,  -- 9 screens * 4 minutes avg
  now(),
  now()
),
(
  gen_random_uuid(),
  'money-management-teens',
  'Budgeting Mastery',
  'Master the 50/30/20 rule, budgeting apps, psychological tricks, and advanced strategies.',
  3,
  true,
  64,  -- 16 screens * 4 minutes avg
  now(),
  now()
),
(
  gen_random_uuid(),
  'money-management-teens',
  'Smart Saving Strategies',
  'Compound interest, savings accounts, emergency funds, saving challenges, and automation.',
  4,
  true,
  56,  -- 14 screens * 4 minutes avg
  now(),
  now()
),
(
  gen_random_uuid(),
  'money-management-teens',
  'Introduction to Investing',
  'Investment basics, risk vs return, dollar-cost averaging, and teen investing options.',
  5,
  true,
  52,  -- 13 screens * 4 minutes avg
  now(),
  now()
),
(
  gen_random_uuid(),
  'money-management-teens',
  'Credit, Debt, and Future Planning',
  'Credit scores, debt strategies, financial independence, career planning, and advanced concepts.',
  6,
  true,
  60,  -- 15 screens * 4 minutes avg
  now(),
  now()
);