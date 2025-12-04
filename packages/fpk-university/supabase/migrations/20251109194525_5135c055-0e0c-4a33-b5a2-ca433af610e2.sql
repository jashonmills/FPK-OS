-- Phase 1: Add content_manifest column to courses table
ALTER TABLE public.courses 
ADD COLUMN IF NOT EXISTS content_manifest JSONB;

COMMENT ON COLUMN public.courses.content_manifest IS 'Stores the complete course manifest JSON for v2 courses';

-- Populate the manifest for the Optimal Learning State course
UPDATE public.courses
SET content_manifest = '{
  "courseId": "optimal-learning-state",
  "courseSlug": "optimal-learning-state",
  "contentVersion": "v2",
  "title": "Empowering Learning: Optimal Learning State",
  "description": "Master techniques to achieve the most effective learning state for success",
  "lessons": [
    {
      "id": 1,
      "title": "Introduction",
      "description": "Getting Into The Most Effective Learning State",
      "unit": "Foundation",
      "estimatedMinutes": 10
    },
    {
      "id": 2,
      "title": "Learning Techniques",
      "description": "Overview of techniques for optimal learning",
      "unit": "Foundation",
      "estimatedMinutes": 8
    },
    {
      "id": 3,
      "title": "Big Strong Tree",
      "description": "Planting and grounding technique",
      "unit": "Grounding Techniques",
      "estimatedMinutes": 5
    },
    {
      "id": 4,
      "title": "Your Energy Bear",
      "description": "Using your energy bear for grounding",
      "unit": "Grounding Techniques",
      "estimatedMinutes": 5
    },
    {
      "id": 5,
      "title": "5, 4, 3, 2, 1 Technique",
      "description": "Sensory grounding method",
      "unit": "Grounding Techniques",
      "estimatedMinutes": 5
    },
    {
      "id": 6,
      "title": "Labyrinths",
      "description": "Using labyrinths for focus and brain integration",
      "unit": "Focus Techniques",
      "estimatedMinutes": 7
    },
    {
      "id": 7,
      "title": "Box Breathing",
      "description": "Breathing technique for calm and control",
      "unit": "Breathing Techniques",
      "estimatedMinutes": 6
    },
    {
      "id": 8,
      "title": "Phoenix Flames Breath",
      "description": "Empowering breath technique",
      "unit": "Breathing Techniques",
      "estimatedMinutes": 6
    },
    {
      "id": 9,
      "title": "Sand Timer",
      "description": "Using timers for regulation and focus",
      "unit": "Regulation Tools",
      "estimatedMinutes": 5
    },
    {
      "id": 10,
      "title": "Raising Book/Screen",
      "description": "Optimal positioning for learning materials",
      "unit": "Visual Techniques",
      "estimatedMinutes": 5
    },
    {
      "id": 11,
      "title": "Eyes Open/Closed",
      "description": "Finding your visual preference",
      "unit": "Visual Techniques",
      "estimatedMinutes": 5
    },
    {
      "id": 12,
      "title": "Ears vs. Eyes",
      "description": "Understanding auditory vs. visual learning",
      "unit": "Learning Styles",
      "estimatedMinutes": 6
    },
    {
      "id": 13,
      "title": "Hearing vs. Seeing",
      "description": "Maximizing your learning style",
      "unit": "Learning Styles",
      "estimatedMinutes": 6
    },
    {
      "id": 14,
      "title": "Moving in Class",
      "description": "Using movement to enhance learning",
      "unit": "Movement Techniques",
      "estimatedMinutes": 5
    },
    {
      "id": 15,
      "title": "Music",
      "description": "The power of music in learning",
      "unit": "Auditory Techniques",
      "estimatedMinutes": 6
    },
    {
      "id": 16,
      "title": "Conclusion",
      "description": "Bringing it all together",
      "unit": "Conclusion",
      "estimatedMinutes": 8
    }
  ]
}'::jsonb
WHERE slug = 'optimal-learning-state';