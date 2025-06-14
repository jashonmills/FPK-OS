
-- Create reading_progress table to track user progress through books
CREATE TABLE public.reading_progress (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  book_id TEXT NOT NULL,
  current_cfi TEXT,
  chapter_index INTEGER DEFAULT 0,
  reading_time_seconds INTEGER DEFAULT 0,
  completion_percentage NUMERIC(5,2) DEFAULT 0.00,
  last_read_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, book_id)
);

-- Enable RLS for reading_progress
ALTER TABLE public.reading_progress ENABLE ROW LEVEL SECURITY;

-- Create policies for reading_progress
CREATE POLICY "Users can view their own reading progress" 
  ON public.reading_progress 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own reading progress" 
  ON public.reading_progress 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own reading progress" 
  ON public.reading_progress 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own reading progress" 
  ON public.reading_progress 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Create reading_sessions table to track individual reading sessions
CREATE TABLE public.reading_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  book_id TEXT NOT NULL,
  session_start TIMESTAMP WITH TIME ZONE DEFAULT now(),
  session_end TIMESTAMP WITH TIME ZONE,
  duration_seconds INTEGER DEFAULT 0,
  pages_read INTEGER DEFAULT 0,
  start_cfi TEXT,
  end_cfi TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS for reading_sessions
ALTER TABLE public.reading_sessions ENABLE ROW LEVEL SECURITY;

-- Create policies for reading_sessions
CREATE POLICY "Users can view their own reading sessions" 
  ON public.reading_sessions 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own reading sessions" 
  ON public.reading_sessions 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own reading sessions" 
  ON public.reading_sessions 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Add trigger to update updated_at on reading_progress
CREATE TRIGGER update_reading_progress_updated_at
  BEFORE UPDATE ON public.reading_progress
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
