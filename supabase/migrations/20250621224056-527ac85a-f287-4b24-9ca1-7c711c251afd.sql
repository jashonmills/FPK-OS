
-- Create table for book quiz questions
CREATE TABLE public.book_quiz_questions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  book_id text NOT NULL,
  chapter_index integer NOT NULL,
  question_text text NOT NULL,
  correct_answer text NOT NULL,
  wrong_answers text[] NOT NULL,
  difficulty_level integer DEFAULT 1,
  created_at timestamp with time zone DEFAULT now()
);

-- Enable RLS on book_quiz_questions
ALTER TABLE public.book_quiz_questions ENABLE ROW LEVEL SECURITY;

-- Create RLS policy for reading quiz questions (public read for all authenticated users)
CREATE POLICY "Authenticated users can view quiz questions" 
  ON public.book_quiz_questions 
  FOR SELECT 
  TO authenticated
  USING (true);

-- Create table for storing user quiz session results
CREATE TABLE public.book_quiz_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) NOT NULL,
  book_id text NOT NULL,
  questions_answered integer NOT NULL,
  correct_answers integer NOT NULL,
  max_chapter_index integer NOT NULL,
  session_score numeric NOT NULL,
  xp_awarded integer DEFAULT 0,
  completed_at timestamp with time zone DEFAULT now(),
  created_at timestamp with time zone DEFAULT now()
);

-- Enable RLS on book_quiz_sessions
ALTER TABLE public.book_quiz_sessions ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for quiz sessions
CREATE POLICY "Users can view their own quiz sessions" 
  ON public.book_quiz_sessions 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own quiz sessions" 
  ON public.book_quiz_sessions 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Insert some sample quiz questions for testing
INSERT INTO public.book_quiz_questions (book_id, chapter_index, question_text, correct_answer, wrong_answers) VALUES
('alice-adventures-in-wonderland', 1, 'What does Alice follow down the rabbit hole?', 'A White Rabbit', ARRAY['A Black Cat', 'A Blue Bird', 'A Red Fox']),
('alice-adventures-in-wonderland', 1, 'What does Alice find at the bottom of the rabbit hole?', 'A long hallway with doors', ARRAY['A treasure chest', 'A magical garden', 'A library']),
('alice-adventures-in-wonderland', 2, 'What happens to Alice after she drinks from the bottle?', 'She shrinks', ARRAY['She grows taller', 'She becomes invisible', 'She gains magical powers']),
('pride-and-prejudice', 1, 'Who is the main female protagonist?', 'Elizabeth Bennet', ARRAY['Jane Bennet', 'Mary Bennet', 'Catherine Bennet']),
('pride-and-prejudice', 1, 'What is Mr. Darcy''s first impression described as?', 'Proud and disagreeable', ARRAY['Kind and charming', 'Funny and witty', 'Shy and quiet']);
