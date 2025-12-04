-- Insert modules for Money Management for Teens course (simplified)
INSERT INTO public.modules (
  course_id,
  title,
  description,
  module_number,
  is_published,
  created_at,
  updated_at
) VALUES 
(
  'money-management-teens',
  'Financial Foundations',
  'Understanding money, financial psychology, family conversations, and teen entrepreneurship basics.',
  1,
  true,
  now(),
  now()
),
(
  'money-management-teens',
  'Banking and Accounts',
  'Learn about banking services, account types, ATM safety, and choosing the right bank.',
  2,
  true,
  now(),
  now()
),
(
  'money-management-teens',
  'Budgeting Mastery',
  'Master the 50/30/20 rule, budgeting apps, psychological tricks, and advanced strategies.',
  3,
  true,
  now(),
  now()
),
(
  'money-management-teens',
  'Smart Saving Strategies',
  'Compound interest, savings accounts, emergency funds, saving challenges, and automation.',
  4,
  true,
  now(),
  now()
),
(
  'money-management-teens',
  'Introduction to Investing',
  'Investment basics, risk vs return, dollar-cost averaging, and teen investing options.',
  5,
  true,
  now(),
  now()
),
(
  'money-management-teens',
  'Credit, Debt, and Future Planning',
  'Credit scores, debt strategies, financial independence, career planning, and advanced concepts.',
  6,
  true,
  now(),
  now()
);