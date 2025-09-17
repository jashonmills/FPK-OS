-- Create modules for ELT: Empowering Learning Techniques course
INSERT INTO public.modules (
  course_id, 
  title, 
  description, 
  module_number, 
  is_published, 
  duration_minutes,
  content_type,
  metadata
) VALUES 
(
  'elt-empowering-learning-techniques',
  'Understanding Neurodiversity and Your Unique Brain',
  'Discover the science of neurodiversity and identify your unique learning profile. Learn about different neurotypes, their strengths, and how to leverage your brain''s unique wiring for optimal learning.',
  1,
  true,
  60,
  'interactive',
  jsonb_build_object(
    'topics', jsonb_build_array(
      jsonb_build_object(
        'id', '1.1',
        'title', 'What is Neurodiversity?',
        'content', 'Neurodiversity is the idea that variations in the human brain and cognition are normal and valuable. Rather than viewing conditions like ADHD, autism, dyslexia as deficits, neurodiversity celebrates these differences as natural variations in human neurology.'
      ),
      jsonb_build_object(
        'id', '1.2', 
        'title', 'Self-Discovery: Identifying Your Learning Profile',
        'content', 'Understanding your unique neurotype helps you identify the most effective learning strategies. This includes recognizing whether you learn best through visual, auditory, or kinesthetic methods, and understanding your strengths and challenges.'
      ),
      jsonb_build_object(
        'id', '1.3',
        'title', 'The Neurodiverse Brain in Action', 
        'content', 'Learn how attention, memory, and executive functions work differently in neurodiverse brains, and discover metacognitive strategies to optimize your learning process.'
      )
    ),
    'activities', jsonb_build_array(
      'Learning Style Inventory Self-Assessment',
      'Neurodiversity Strengths Identification Exercise',
      'Personal Learning Profile Creation'
    )
  )
),
(
  'elt-empowering-learning-techniques',
  'Mastering Executive Functioning Skills',
  'Develop essential executive functioning skills including planning, organization, time management, and focus strategies specifically designed for neurodiverse learners.',
  2,
  true,
  75,
  'interactive',
  jsonb_build_object(
    'topics', jsonb_build_array(
      jsonb_build_object(
        'id', '2.1',
        'title', 'Planning and Organization Systems',
        'content', 'Master the art of breaking down large tasks into manageable steps. Learn to use digital and physical planning tools effectively, and create organizational systems that work with your brain, not against it.'
      ),
      jsonb_build_object(
        'id', '2.2',
        'title', 'Time Management and Prioritization',
        'content', 'Discover techniques like the Pomodoro Technique and Eisenhower Matrix. Learn to categorize tasks by urgency and importance, and develop sustainable time management strategies.'
      ),
      jsonb_build_object(
        'id', '2.3',
        'title', 'Working Memory and Focus Strategies',
        'content', 'Enhance your working memory through chunking, visualization, and active recall techniques. Learn environmental control strategies and mindfulness techniques to maintain focus.'
      )
    ),
    'activities', jsonb_build_array(
      'Executive Functioning Self-Assessment',
      'Personal Planning System Setup',
      'Time Management Practice Exercises',
      'Focus Strategy Implementation Plan'
    )
  )
),
(
  'elt-empowering-learning-techniques',
  'Effective Study and Information Retention Techniques',
  'Learn evidence-based study methods that work specifically well for neurodiverse minds, including active learning strategies, adaptive note-taking, and memory enhancement techniques.',
  3,
  true,
  80,
  'interactive',
  jsonb_build_object(
    'topics', jsonb_build_array(
      jsonb_build_object(
        'id', '3.1',
        'title', 'Active Learning and Engagement',
        'content', 'Move beyond passive reading with active recall, spaced repetition, and elaborative interrogation. Learn multi-modal approaches that engage visual, auditory, and kinesthetic learning preferences.'
      ),
      jsonb_build_object(
        'id', '3.2',
        'title', 'Adaptive Note-Taking and Information Processing',
        'content', 'Master various note-taking methods including Cornell Notes, Mind Mapping, and Visual Notes (Sketchnoting). Learn to use technology tools to support your information processing needs.'
      ),
      jsonb_build_object(
        'id', '3.3',
        'title', 'Reading Comprehension and Critical Thinking',
        'content', 'Develop effective reading strategies including previewing, active reading, and text chunking. Learn to analyze arguments, evaluate evidence, and overcome challenges with abstract concepts.'
      )
    ),
    'activities', jsonb_build_array(
      'Study Method Comparison Exercise',
      'Note-Taking Style Assessment',
      'Reading Comprehension Strategy Practice',
      'Critical Thinking Skills Development'
    )
  )
),
(
  'elt-empowering-learning-techniques',
  'Building Self-Advocacy and Academic Success',
  'Develop self-advocacy skills, create personal accommodation strategies, and build sustainable academic success habits that honor your neurodivergent strengths.',
  4,
  true,
  65,
  'interactive',
  jsonb_build_object(
    'topics', jsonb_build_array(
      jsonb_build_object(
        'id', '4.1',
        'title', 'Self-Advocacy Skills Development',
        'content', 'Learn to articulate your learning needs, request appropriate accommodations, and communicate effectively with educators and support services.'
      ),
      jsonb_build_object(
        'id', '4.2',
        'title', 'Creating Your Personal Learning Environment', 
        'content', 'Design optimal study spaces, manage sensory needs, and create routines that support your learning style and energy patterns.'
      ),
      jsonb_build_object(
        'id', '4.3',
        'title', 'Long-term Success Strategies',
        'content', 'Develop sustainable habits, build support networks, and create systems for ongoing self-reflection and strategy adjustment as your needs evolve.'
      )
    ),
    'activities', jsonb_build_array(
      'Self-Advocacy Practice Scenarios',
      'Personal Learning Environment Design',
      'Success Strategy Implementation Plan',
      'Support Network Mapping'
    )
  )
),
(
  'elt-empowering-learning-techniques',
  'Putting It All Together: Your Personal Learning Action Plan',
  'Synthesize everything you''ve learned into a personalized, actionable learning strategy that you can implement immediately and adjust as needed.',
  5,
  true,
  55,
  'interactive',
  jsonb_build_object(
    'topics', jsonb_build_array(
      jsonb_build_object(
        'id', '5.1',
        'title', 'Creating Your Personalized Learning Strategy',
        'content', 'Combine insights from all previous modules to create a comprehensive, personalized learning approach that leverages your strengths and accommodates your challenges.'
      ),
      jsonb_build_object(
        'id', '5.2',
        'title', 'Implementation and Progress Tracking',
        'content', 'Learn to implement your strategies systematically, track your progress, and make adjustments based on what works best for you.'
      ),
      jsonb_build_object(
        'id', '5.3',
        'title', 'Ongoing Development and Community Building',
        'content', 'Discover resources for continued learning, connect with neurodiverse learning communities, and develop plans for ongoing skill development.'
      )
    ),
    'activities', jsonb_build_array(
      'Personal Learning Strategy Creation',
      'Goal Setting and Progress Tracking Setup',
      'Resource Library Development',
      'Community Connection Planning'
    )
  )
);