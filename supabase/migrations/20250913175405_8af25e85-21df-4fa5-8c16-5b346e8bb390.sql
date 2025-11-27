-- Phase 1: Advanced Conversation State Management Tables
CREATE TABLE IF NOT EXISTS public.conversation_memory (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  session_id UUID REFERENCES public.chat_sessions(id) ON DELETE CASCADE,
  memory_type TEXT NOT NULL CHECK (memory_type IN ('working', 'episodic', 'semantic', 'procedural')),
  memory_data JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Phase 3: Student Modeling and Profiling
CREATE TABLE IF NOT EXISTS public.student_profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  knowledge_state JSONB NOT NULL DEFAULT '{
    "currentUnderstanding": 0.5,
    "confidence": 0.5,
    "misconceptions": [],
    "gapsIdentified": [],
    "masteredConcepts": []
  }',
  cognitive_load JSONB NOT NULL DEFAULT '{
    "currentLoad": 0.4,
    "fatigueIndicators": [],
    "optimalChallenge": 0.6,
    "attentionSpan": 15
  }',
  learning_style JSONB NOT NULL DEFAULT '{
    "preferredModality": "mixed",
    "questioningPreference": "exploratory",
    "scaffoldingNeeds": "medium",
    "pacePreference": "moderate"
  }',
  adaptive_metrics JSONB NOT NULL DEFAULT '{
    "responseTime": [],
    "questionTypes": [],
    "successfulStrategies": [],
    "strugglingAreas": []
  }',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Phase 4: Advanced Assessment and Progress Tracking  
CREATE TABLE IF NOT EXISTS public.socratic_assessments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  session_id UUID REFERENCES public.chat_sessions(id) ON DELETE CASCADE,
  assessment_type TEXT NOT NULL CHECK (assessment_type IN ('conceptual', 'reasoning', 'metacognitive', 'communication', 'transfer')),
  topic_focus TEXT NOT NULL,
  questions_asked JSONB NOT NULL DEFAULT '[]',
  student_responses JSONB NOT NULL DEFAULT '[]',
  understanding_level DECIMAL(3,2) CHECK (understanding_level >= 0 AND understanding_level <= 1),
  confidence_level DECIMAL(3,2) CHECK (confidence_level >= 0 AND confidence_level <= 1),
  misconceptions_identified JSONB NOT NULL DEFAULT '[]',
  skills_demonstrated JSONB NOT NULL DEFAULT '[]',
  next_learning_targets JSONB NOT NULL DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Learning Analytics and Progress Tracking
CREATE TABLE IF NOT EXISTS public.learning_analytics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  session_id UUID REFERENCES public.chat_sessions(id) ON DELETE CASCADE,
  interaction_type TEXT NOT NULL CHECK (interaction_type IN ('question_asked', 'answer_given', 'misconception_corrected', 'concept_mastered', 'scaffold_provided')),
  topic TEXT NOT NULL,
  difficulty_level INTEGER CHECK (difficulty_level >= 1 AND difficulty_level <= 5),
  success_rate DECIMAL(3,2) CHECK (success_rate >= 0 AND success_rate <= 1),
  time_spent_seconds INTEGER DEFAULT 0,
  cognitive_load_estimate DECIMAL(3,2) CHECK (cognitive_load_estimate >= 0 AND cognitive_load_estimate <= 1),
  engagement_score DECIMAL(3,2) CHECK (engagement_score >= 0 AND engagement_score <= 1),
  metadata JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Socratic Question Bank and Strategy Tracking
CREATE TABLE IF NOT EXISTS public.socratic_questions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  strategy_type TEXT NOT NULL CHECK (strategy_type IN ('foundational', 'clarification', 'evidence', 'implication', 'perspective', 'metacognitive')),
  question_template TEXT NOT NULL,
  difficulty_level INTEGER CHECK (difficulty_level >= 1 AND difficulty_level <= 5),
  cognitive_load_target DECIMAL(3,2) CHECK (cognitive_load_target >= 0 AND cognitive_load_target <= 1),
  subject_areas JSONB NOT NULL DEFAULT '[]',
  effectiveness_score DECIMAL(3,2) DEFAULT 0.5 CHECK (effectiveness_score >= 0 AND effectiveness_score <= 1),
  usage_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.conversation_memory ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.socratic_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.learning_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.socratic_questions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for conversation_memory
CREATE POLICY "Users can view their own conversation memory" 
ON public.conversation_memory 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own conversation memory" 
ON public.conversation_memory 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own conversation memory" 
ON public.conversation_memory 
FOR UPDATE 
USING (auth.uid() = user_id);

-- RLS Policies for student_profiles
CREATE POLICY "Users can view their own student profile" 
ON public.student_profiles 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own student profile" 
ON public.student_profiles 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own student profile" 
ON public.student_profiles 
FOR UPDATE 
USING (auth.uid() = user_id);

-- RLS Policies for socratic_assessments
CREATE POLICY "Users can view their own assessments" 
ON public.socratic_assessments 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own assessments" 
ON public.socratic_assessments 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- RLS Policies for learning_analytics
CREATE POLICY "Users can view their own analytics" 
ON public.learning_analytics 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own analytics" 
ON public.learning_analytics 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- RLS Policies for socratic_questions (public read, admin write)
CREATE POLICY "Everyone can view socratic questions" 
ON public.socratic_questions 
FOR SELECT 
USING (true);

CREATE POLICY "Admins can manage socratic questions" 
ON public.socratic_questions 
FOR ALL 
USING (auth.uid() IN (
  SELECT user_id FROM public.user_roles WHERE role = 'admin'
));

-- Create indexes for performance
CREATE INDEX idx_conversation_memory_user_session ON public.conversation_memory(user_id, session_id);
CREATE INDEX idx_conversation_memory_type ON public.conversation_memory(memory_type);
CREATE INDEX idx_student_profiles_user ON public.student_profiles(user_id);
CREATE INDEX idx_socratic_assessments_user_topic ON public.socratic_assessments(user_id, topic_focus);
CREATE INDEX idx_learning_analytics_user_topic ON public.learning_analytics(user_id, topic);
CREATE INDEX idx_learning_analytics_created_at ON public.learning_analytics(created_at);
CREATE INDEX idx_socratic_questions_strategy ON public.socratic_questions(strategy_type);
CREATE INDEX idx_socratic_questions_difficulty ON public.socratic_questions(difficulty_level);

-- Create update triggers
CREATE TRIGGER update_conversation_memory_updated_at
BEFORE UPDATE ON public.conversation_memory
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_student_profiles_updated_at
BEFORE UPDATE ON public.student_profiles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_socratic_assessments_updated_at
BEFORE UPDATE ON public.socratic_assessments
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_socratic_questions_updated_at
BEFORE UPDATE ON public.socratic_questions
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample Socratic questions
INSERT INTO public.socratic_questions (strategy_type, question_template, difficulty_level, cognitive_load_target, subject_areas) VALUES
('foundational', 'What do you mean when you say "{concept}"?', 1, 0.3, '["general", "philosophy", "science"]'),
('foundational', 'How would you define "{concept}" in your own words?', 1, 0.3, '["general", "mathematics", "literature"]'),
('clarification', 'Can you give me a specific example of "{concept}"?', 2, 0.4, '["general", "science", "history"]'),
('clarification', 'What makes you think that "{statement}" is true?', 2, 0.5, '["general", "critical_thinking"]'),
('evidence', 'What evidence supports your thinking about "{topic}"?', 3, 0.6, '["science", "history", "research"]'),
('evidence', 'How did you arrive at that conclusion about "{topic}"?', 3, 0.6, '["mathematics", "logic", "science"]'),
('implication', 'What would happen if "{hypothesis}" were true?', 4, 0.7, '["science", "philosophy", "ethics"]'),
('implication', 'How does "{concept}" connect to what we discussed earlier?', 3, 0.5, '["general", "systems_thinking"]'),
('perspective', 'What might someone who disagrees with you say about "{topic}"?', 4, 0.7, '["debate", "ethics", "history"]'),
('perspective', 'What are the strengths and weaknesses of this viewpoint on "{topic}"?', 4, 0.8, '["critical_thinking", "analysis"]'),
('metacognitive', 'How confident are you in your answer about "{topic}"?', 2, 0.4, '["general", "self_assessment"]'),
('metacognitive', 'What would you need to know to be more certain about "{topic}"?', 3, 0.6, '["research", "learning_strategies"]');

-- Create function to initialize student profile
CREATE OR REPLACE FUNCTION public.initialize_student_profile(p_user_id UUID)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  profile_id UUID;
BEGIN
  INSERT INTO public.student_profiles (user_id)
  VALUES (p_user_id)
  ON CONFLICT (user_id) DO NOTHING
  RETURNING id INTO profile_id;
  
  -- If no profile was created (conflict), get existing ID
  IF profile_id IS NULL THEN
    SELECT id INTO profile_id 
    FROM public.student_profiles 
    WHERE user_id = p_user_id;
  END IF;
  
  RETURN profile_id;
END;
$$;