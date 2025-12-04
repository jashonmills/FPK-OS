
-- Create public_domain_books table
CREATE TABLE IF NOT EXISTS public_domain_books (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    author TEXT NOT NULL,
    subjects TEXT[] DEFAULT '{}',
    cover_url TEXT,
    epub_url TEXT NOT NULL,
    gutenberg_id INTEGER UNIQUE NOT NULL,
    description TEXT,
    language TEXT DEFAULT 'en',
    last_updated TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_public_domain_books_gutenberg_id ON public_domain_books(gutenberg_id);
CREATE INDEX IF NOT EXISTS idx_public_domain_books_subjects ON public_domain_books USING GIN(subjects);
CREATE INDEX IF NOT EXISTS idx_public_domain_books_title ON public_domain_books(title);
CREATE INDEX IF NOT EXISTS idx_public_domain_books_author ON public_domain_books(author);

-- Enable Row Level Security
ALTER TABLE public_domain_books ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access
CREATE POLICY "Enable read access for all users" ON public_domain_books
    FOR SELECT USING (true);

-- Insert some initial test data
INSERT INTO public_domain_books (id, title, author, subjects, cover_url, epub_url, gutenberg_id, description, language, last_updated, created_at) VALUES
('gutenberg-1', 'The Art of Teaching: Methods for All Subjects', 'John Dewey', ARRAY['education', 'teaching', 'learning', 'psychology'], 'https://www.gutenberg.org/cache/epub/1/pg1.cover.medium.jpg', 'https://www.gutenberg.org/ebooks/1.epub.noimages', 1, 'A comprehensive guide to teaching methods that accommodate different learning styles and abilities.', 'en', NOW(), NOW()),
('gutenberg-2', 'Understanding Child Development', 'Maria Montessori', ARRAY['child development', 'education', 'psychology', 'learning'], 'https://www.gutenberg.org/cache/epub/2/pg2.cover.medium.jpg', 'https://www.gutenberg.org/ebooks/2.epub.noimages', 2, 'Insights into how children learn and develop, with special attention to individual differences.', 'en', NOW(), NOW()),
('gutenberg-3', 'The Mind and How to Use It', 'William Walker Atkinson', ARRAY['psychology', 'mind', 'cognitive', 'self-help'], 'https://www.gutenberg.org/cache/epub/3/pg3.cover.medium.jpg', 'https://www.gutenberg.org/ebooks/3.epub.noimages', 3, 'A practical guide to understanding how the mind works and how to optimize mental performance.', 'en', NOW(), NOW()),
('gutenberg-4', 'Social Skills for Young People', 'Jane Addams', ARRAY['social skills', 'communication', 'youth', 'development'], 'https://www.gutenberg.org/cache/epub/4/pg4.cover.medium.jpg', 'https://www.gutenberg.org/ebooks/4.epub.noimages', 4, 'Essential social skills and communication strategies for young people navigating social situations.', 'en', NOW(), NOW()),
('gutenberg-5', 'Emotional Intelligence in Education', 'William James', ARRAY['emotional intelligence', 'education', 'psychology', 'students'], 'https://www.gutenberg.org/cache/epub/5/pg5.cover.medium.jpg', 'https://www.gutenberg.org/ebooks/5.epub.noimages', 5, 'How emotional intelligence impacts learning and academic success.', 'en', NOW(), NOW()),
('gutenberg-6', 'The Science of Learning', 'Hermann Ebbinghaus', ARRAY['learning', 'memory', 'cognitive science', 'education'], 'https://www.gutenberg.org/cache/epub/6/pg6.cover.medium.jpg', 'https://www.gutenberg.org/ebooks/6.epub.noimages', 6, 'Scientific principles behind how we learn and remember information.', 'en', NOW(), NOW()),
('gutenberg-7', 'Understanding Different Learning Styles', 'Helen Keller', ARRAY['learning styles', 'education', 'accessibility', 'inclusion'], 'https://www.gutenberg.org/cache/epub/7/pg7.cover.medium.jpg', 'https://www.gutenberg.org/ebooks/7.epub.noimages', 7, 'Insights into how different people learn and the importance of accessible education.', 'en', NOW(), NOW()),
('gutenberg-8', 'Inclusive Teaching Methods', 'Temple Grandin', ARRAY['inclusive education', 'teaching', 'autism', 'neurodiversity'], 'https://www.gutenberg.org/cache/epub/8/pg8.cover.medium.jpg', 'https://www.gutenberg.org/ebooks/8.epub.noimages', 8, 'Teaching strategies that work for students with diverse learning needs and abilities.', 'en', NOW(), NOW())
ON CONFLICT (gutenberg_id) DO NOTHING;

