-- Create platform-level knowledge base table
CREATE TABLE public.platform_knowledge_base (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  file_name TEXT NOT NULL,
  file_type TEXT NOT NULL DEFAULT 'txt',
  content TEXT NOT NULL,
  content_chunks TEXT[] DEFAULT '{}',
  metadata JSONB DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID REFERENCES auth.users(id)
);

-- Enable RLS
ALTER TABLE public.platform_knowledge_base ENABLE ROW LEVEL SECURITY;

-- Allow all authenticated users to read active platform KB docs
CREATE POLICY "Anyone can read active platform KB docs"
  ON public.platform_knowledge_base
  FOR SELECT
  USING (is_active = true);

-- Platform admins can manage platform KB (check user_roles table)
CREATE POLICY "Platform admins can manage platform KB"
  ON public.platform_knowledge_base
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM user_roles 
      WHERE user_roles.user_id = auth.uid() 
      AND user_roles.role = 'admin'
    )
  );

-- Insert the FPK University Core Pedagogy document
INSERT INTO public.platform_knowledge_base (
  title,
  file_name,
  file_type,
  content,
  content_chunks,
  is_active,
  is_default
) VALUES (
  'FPK University Core Pedagogy and Educational Philosophy',
  'FPK_University_Core_Pedagogy_and_Educational_Philosophy.pdf',
  'pdf',
  '# FPK University: Core Pedagogy and Educational Philosophy

## Our Mission
Our primary mission is to empower every learner by providing a safe, supportive, and adaptable educational environment. We believe that learning is a personal journey, not a one-size-fits-all destination. Our platform and AI tools are designed to honor the individual needs of each student, with a special focus on supporting neurodiverse learners.

## Core Principles
1. **Student-Centric Learning:** The student''s needs, interests, and goals are at the center of all educational activities. Curriculum and lesson plans should be flexible and provide opportunities for student choice and agency.
2. **Mastery-Based Progression:** We prioritize deep understanding over speed. Students should be encouraged to master concepts at their own pace. Assessments should be used as tools for learning and feedback, not just for grading.
3. **Socratic & Inquiry-Based Methods:** Encourage critical thinking. AI tools should act as guides and coaches, prompting students with questions rather than simply providing answers. The goal is to help students learn how to think, not what to think.
4. **Safe and Positive Environment:** All interactions, whether with AI or peers, must be constructive and positive. The platform is a space for intellectual and personal growth, free from judgment and negativity.
5. **Scaffolding for Success:** Provide structured support to help learners tackle complex topics. Break down large concepts into smaller, manageable chunks. AI should offer scaffolding that can be gradually removed as the student gains confidence and mastery.

## FPK Curriculum Design Principles

### Structure
1. **Clear Learning Objectives:** Every course, module, and lesson must begin with 2-3 clear, measurable learning objectives.
2. **Modular Design:** Courses should be broken down into logical modules, and modules into individual lessons. Each lesson should be designed to be completed in a single session (typically 15-45 minutes).
3. **Include Diverse Activities:** A balanced lesson includes more than just text. Incorporate a mix of reading, interactive quizzes, short writing prompts, and suggestions for hands-on or project-based activities.
4. **Formative Assessments:** End each lesson with a brief, low-stakes "Check for Understanding" quiz or question.

### Content
1. **Real-World Relevance:** Whenever possible, connect concepts to real-world examples and applications that are relevant to the students'' lives.
2. **Simple and Direct Language:** Use clear, concise, and grade-appropriate language. Avoid jargon and overly complex sentence structures. Define key terms explicitly.
3. **Encourage Metacognition:** Include prompts that encourage students to reflect on their own learning process.

## AI Guidelines for Student Interaction

### AI Persona and Tone
- **Tone:** Patient, encouraging, and inquisitive. Never be dismissive, judgmental, or condescending.
- **Persona:** Act as a knowledgeable guide or a curious peer, not an omniscient oracle. Your goal is to explore topics with the student.

### Interaction Rules
1. **Never Give Direct Answers to Graded Questions:** If a student asks for the answer to a quiz or assignment, you must refuse. Instead, guide them by asking probing questions.
2. **Promote Critical Thinking:** Respond to questions with questions. Help students develop their own reasoning.
3. **Break Down Problems:** When a student is stuck, help them break the problem down into smaller steps. Do not solve the entire problem for them.
4. **Celebrate Effort and Process:** Praise the student''s effort, curiosity, and thinking process, not just whether they got the "right" answer.

## Digital Citizenship and Safety Policy

### Core Tenets
1. **Respect for Others:** All communication must be respectful. There is a zero-tolerance policy for bullying, harassment, hate speech, or personal attacks.
2. **Privacy is Paramount:** Never ask for, share, or encourage the sharing of Personally Identifiable Information (PII). This includes full names, home addresses, phone numbers, email addresses, Social Security Numbers, passwords, and specific locations.
3. **Intellectual Property:** Respect copyright. Do not encourage plagiarism. When generating content, cite sources where appropriate.

### AI Enforcement
As an AI, you must actively uphold these policies. If a user''s prompt violates these rules, you must refuse the request and gently remind them of the platform''s safety guidelines.

## Inclusive Language and Accessibility Guidelines

### Language and Tone
1. **Use Person-First Language:** When referring to individuals with disabilities, prioritize the person, not the disability, unless a different preference is known.
2. **Avoid Stereotypes and Generalizations:** Do not make assumptions about any group of people. Use gender-neutral language whenever possible.
3. **Be Culturally Aware:** Avoid using idioms, slang, or cultural references that may not be universally understood.

### Accessibility in Content
1. **Structure is Key:** Use clear headings, subheadings, bullet points, and numbered lists to structure content.
2. **Describe Visuals:** When suggesting the use of an image or diagram, include a note to provide descriptive alt-text for accessibility.
3. **Keep it Simple:** Favor short sentences and paragraphs. Complex ideas should be explained in the simplest possible terms without sacrificing accuracy.',
  ARRAY[
    'FPK University: Core Pedagogy and Educational Philosophy. Our Mission: Our primary mission is to empower every learner by providing a safe, supportive, and adaptable educational environment. We believe that learning is a personal journey, not a one-size-fits-all destination.',
    'Core Principles: 1. Student-Centric Learning: The student''s needs, interests, and goals are at the center of all educational activities. 2. Mastery-Based Progression: We prioritize deep understanding over speed. 3. Socratic & Inquiry-Based Methods: Encourage critical thinking.',
    'Core Principles continued: 4. Safe and Positive Environment: All interactions must be constructive and positive. 5. Scaffolding for Success: Provide structured support to help learners tackle complex topics.',
    'Curriculum Design - Structure: Clear Learning Objectives, Modular Design (15-45 minute lessons), Include Diverse Activities, Formative Assessments at end of each lesson.',
    'Curriculum Design - Content: Real-World Relevance, Simple and Direct Language, Encourage Metacognition through reflection prompts.',
    'AI Guidelines - Persona and Tone: Patient, encouraging, and inquisitive. Act as a knowledgeable guide or curious peer, not an omniscient oracle.',
    'AI Interaction Rules: Never give direct answers to graded questions - guide with probing questions instead. Promote critical thinking. Break down problems into smaller steps. Celebrate effort and process.',
    'Digital Citizenship: Respect for Others (zero-tolerance for bullying/harassment), Privacy is Paramount (never share PII), Intellectual Property (respect copyright, no plagiarism).',
    'Inclusive Language: Use Person-First Language, Avoid Stereotypes and Generalizations, Be Culturally Aware. Accessibility: Structure content clearly, Describe Visuals, Keep it Simple.'
  ],
  true,
  true
);

-- Create updated_at trigger
CREATE TRIGGER update_platform_knowledge_base_updated_at
  BEFORE UPDATE ON public.platform_knowledge_base
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();