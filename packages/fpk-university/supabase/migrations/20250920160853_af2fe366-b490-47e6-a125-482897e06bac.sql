-- Create complete IEP record for Jace Mills with correct status value

-- 1. Create main IEP plan record
INSERT INTO public.iep_plans (
  id,
  student_id,
  org_id,
  jurisdiction,
  status,
  referral_reason,
  suspected_disability_categories,
  cycle_start_date,
  cycle_end_date,
  current_step,
  completion_percentage,
  created_by,
  created_at,
  updated_at
) VALUES (
  '550e8400-e29b-41d4-a716-446655440001'::uuid,
  '60042184-789f-4374-9959-0b7d43e04766'::uuid,
  '68d708db-f516-46f2-8c69-44c727315f17'::uuid,
  'US_IDEA',
  'finalized',
  'Academic difficulties in reading comprehension and written expression',
  ARRAY['Specific Learning Disability'],
  '2025-09-20'::date,
  '2026-09-19'::date,
  13,
  100,
  '60042184-789f-4374-9959-0b7d43e04766'::uuid,
  now(),
  now()
);