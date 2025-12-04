-- Create the FPX AI Assistant author profile
INSERT INTO article_authors (
  name,
  slug,
  bio,
  credentials
) VALUES (
  'The FPX AI Assistant',
  'fpx-ai-assistant',
  'An AI-powered assistant trained on evidence-based practices in autism, ADHD, special education, and behavioral science. Designed to help families understand complex clinical concepts and support their advocacy journey.',
  'AI Assistant'
)
ON CONFLICT (slug) DO NOTHING;