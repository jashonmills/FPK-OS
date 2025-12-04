-- Create complete IEP record for Jace Mills with all mock data

-- 1. Create main IEP plan record
INSERT INTO public.iep_plans (
  id,
  student_id,
  org_id,
  status,
  completion_percentage,
  current_step,
  jurisdiction,
  cycle_start_date,
  cycle_end_date,
  iep_meeting_date,
  annual_review_date,
  suspected_disability,
  form_data,
  created_at,
  updated_at
) VALUES (
  '550e8400-e29b-41d4-a716-446655440001'::uuid,
  '60042184-789f-4374-9959-0b7d43e04766'::uuid,
  '68d708db-f516-46f2-8c69-44c727315f17'::uuid,
  'completed',
  100,
  13,
  'US_IDEA',
  '2025-09-20'::date,
  '2026-09-19'::date,
  '2025-09-20'::timestamp,
  '2026-09-19'::timestamp,
  '["Specific Learning Disability (SLD) in Reading Comprehension and Written Expression"]'::jsonb,
  '{
    "studentInfo": {
      "grade": "7",
      "studentId": "123456",
      "disability": "Specific Learning Disability (SLD) in Reading Comprehension and Written Expression"
    },
    "impact": "Jace''s SLD directly affects his ability to access and progress in the general education curriculum, particularly in subjects like Social Studies and English Language Arts (ELA). It limits his independent completion of homework and tests that require reading or writing."
  }'::jsonb,
  now(),
  now()
);

-- 2. Create IEP Goals
INSERT INTO public.iep_goals (
  id,
  iep_id,
  domain,
  goal_type,
  goal_statement,
  success_criterion,
  measurement_method,
  evaluation_schedule,
  baseline_data,
  target_date,
  created_at
) VALUES 
(
  '550e8400-e29b-41d4-a716-446655440002'::uuid,
  '550e8400-e29b-41d4-a716-446655440001'::uuid,
  'Reading',
  'Academic',
  'By September 2026, Jace will increase his reading comprehension of grade-level informational text from 65% to 80% accuracy as measured by curriculum-based assessments and teacher-created rubrics.',
  '80% accuracy on grade-level informational text',
  'Curriculum-based assessments and teacher-created rubrics',
  'Monthly',
  '65% accuracy',
  '2026-09-20'::date,
  now()
),
(
  '550e8400-e29b-41d4-a716-446655440003'::uuid,
  '550e8400-e29b-41d4-a716-446655440001'::uuid,
  'Writing',
  'Academic',
  'By September 2026, Jace will write a five-paragraph persuasive essay with a clear introduction, body, and conclusion, earning a score of 3 out of 4 on a writing rubric.',
  'Score of 3 out of 4 on writing rubric',
  'Teacher rubric assessment',
  'Quarterly',
  'Score of 1 out of 4',
  '2026-09-20'::date,
  now()
);

-- 3. Create IEP Services
INSERT INTO public.iep_services (
  id,
  iep_id,
  service_type,
  service_name,
  provider_role,
  frequency_per_week,
  duration_minutes,
  location,
  start_date,
  end_date,
  created_at
) VALUES 
(
  '550e8400-e29b-41d4-a716-446655440004'::uuid,
  '550e8400-e29b-41d4-a716-446655440001'::uuid,
  'Specialized Academic Instruction',
  'SAI - Reading',
  'Resource Specialist',
  3,
  45,
  'Resource Room',
  '2025-10-01'::date,
  '2026-09-19'::date,
  now()
),
(
  '550e8400-e29b-41d4-a716-446655440005'::uuid,
  '550e8400-e29b-41d4-a716-446655440001'::uuid,
  'Specialized Academic Instruction',
  'SAI - Writing',
  'Resource Specialist',
  2,
  30,
  'Resource Room',
  '2025-10-01'::date,
  '2026-09-19'::date,
  now()
),
(
  '550e8400-e29b-41d4-a716-446655440006'::uuid,
  '550e8400-e29b-41d4-a716-446655440001'::uuid,
  'Related Service',
  'Speech and Language Therapy',
  'Speech-Language Pathologist',
  1,
  30,
  'Therapy Room',
  '2025-10-01'::date,
  '2026-09-19'::date,
  now()
);

-- 4. Create IEP Accommodations
INSERT INTO public.iep_accommodations (
  id,
  iep_id,
  category,
  accommodation_type,
  description,
  implementation_notes,
  created_at
) VALUES 
(
  '550e8400-e29b-41d4-a716-446655440007'::uuid,
  '550e8400-e29b-41d4-a716-446655440001'::uuid,
  'Presentation',
  'Read Aloud',
  'Tests and quizzes read aloud by a teacher or through text-to-speech software',
  'Use during all assessments and assignments',
  now()
),
(
  '550e8400-e29b-41d4-a716-446655440008'::uuid,
  '550e8400-e29b-41d4-a716-446655440001'::uuid,
  'Presentation',
  'Audiobooks',
  'Provide access to audio versions of textbooks and required reading materials',
  'Arrange through library or digital resources',
  now()
),
(
  '550e8400-e29b-41d4-a716-446655440009'::uuid,
  '550e8400-e29b-41d4-a716-446655440001'::uuid,
  'Response',
  'Extended Time',
  '1.5x extended time on all assignments, tests, and quizzes',
  'Apply to both classroom and standardized assessments',
  now()
),
(
  '550e8400-e29b-41d4-a716-44665544000A'::uuid,
  '550e8400-e29b-41d4-a716-446655440001'::uuid,
  'Response',
  'Scribe/Dictation',
  'Allow Jace to dictate written responses to a scribe or use speech-to-text software',
  'Available for all written assignments',
  now()
),
(
  '550e8400-e29b-41d4-a716-44665544000B'::uuid,
  '550e8400-e29b-41d4-a716-446655440001'::uuid,
  'Setting',
  'Small Group Testing',
  'Take tests in a small-group setting in the resource room',
  'Coordinate with resource specialist',
  now()
),
(
  '550e8400-e29b-41d4-a716-44665544000C'::uuid,
  '550e8400-e29b-41d4-a716-446655440001'::uuid,
  'Supplementary',
  'Assistive Technology',
  'Access to a word processor with spell checker and grammar assist tool',
  'Provide device and training as needed',
  now()
);

-- 5. Create Present Levels record
INSERT INTO public.iep_present_levels (
  id,
  iep_id,
  academic_performance,
  functional_performance,
  impact_statement,
  strengths,
  needs,
  created_at
) VALUES (
  '550e8400-e29b-41d4-a716-44665544000D'::uuid,
  '550e8400-e29b-41d4-a716-446655440001'::uuid,
  'Jace demonstrates strong foundational math skills but struggles significantly with reading comprehension and written assignments. His reading fluency is below grade level, which impacts his ability to understand complex texts. In writing, he struggles with organizing his thoughts, spelling, and sentence structure.',
  'Jace is generally well-behaved and cooperative in class. He benefits from a structured environment and can become frustrated and withdrawn when given open-ended tasks or long reading assignments. He has strong peer relationships and often helps classmates with subjects he excels in.',
  'Jace''s SLD directly affects his ability to access and progress in the general education curriculum, particularly in subjects like Social Studies and English Language Arts (ELA). It limits his independent completion of homework and tests that require reading or writing.',
  '["Strong math skills", "Cooperative behavior", "Good peer relationships", "Helpful to others", "Responds well to structure"]'::jsonb,
  '["Reading comprehension improvement", "Written expression support", "Organization strategies", "Task completion skills", "Confidence building"]'::jsonb,
  now()
);

-- 6. Create Guardian Information
INSERT INTO public.iep_guardians (
  id,
  iep_id,
  guardian_type,
  first_name,
  last_name,
  email,
  phone,
  address,
  is_primary,
  created_at
) VALUES (
  '550e8400-e29b-41d4-a716-44665544000E'::uuid,
  '550e8400-e29b-41d4-a716-446655440001'::uuid,
  'Parent',
  'Jennifer',
  'Mills',
  'jennifer.mills@email.com',
  '(555) 123-4567',
  '123 Oak Street, Springfield, IL 62701',
  true,
  now()
);