-- Phase 1: Database Schema Updates

-- Add missing columns to courses table
ALTER TABLE public.courses 
ADD COLUMN IF NOT EXISTS org_id uuid,
ADD COLUMN IF NOT EXISTS source text CHECK (source IN ('builder','scorm','native','platform')) DEFAULT 'platform',
ADD COLUMN IF NOT EXISTS discoverable boolean DEFAULT false;

-- Add missing columns to org_courses table  
ALTER TABLE public.org_courses
ADD COLUMN IF NOT EXISTS status text CHECK (status IN ('draft','preview','published','archived')) DEFAULT 'draft',
ADD COLUMN IF NOT EXISTS source text CHECK (source IN ('builder','scorm','native','platform')) DEFAULT 'builder',
ADD COLUMN IF NOT EXISTS discoverable boolean DEFAULT false;

-- Add missing columns to native_courses table
ALTER TABLE public.native_courses
ADD COLUMN IF NOT EXISTS status text CHECK (status IN ('draft','preview','published','archived')) DEFAULT 'draft',
ADD COLUMN IF NOT EXISTS org_id uuid,
ADD COLUMN IF NOT EXISTS source text CHECK (source IN ('builder','scorm','native','platform')) DEFAULT 'native',
ADD COLUMN IF NOT EXISTS discoverable boolean DEFAULT false;

-- Create org_course_imports table
CREATE TABLE IF NOT EXISTS public.org_course_imports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id uuid NOT NULL,
  file_url text NOT NULL,
  file_name text NOT NULL,
  status text CHECK (status IN ('uploading','processing','draft_ready','failed')) DEFAULT 'uploading',
  output_org_course_id uuid,
  log jsonb DEFAULT '[]'::jsonb,
  created_by uuid NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Create org_course_versions table
CREATE TABLE IF NOT EXISTS public.org_course_versions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_course_id uuid NOT NULL,
  version integer NOT NULL,
  snapshot_json jsonb NOT NULL,
  created_by uuid NOT NULL,
  created_at timestamp with time zone DEFAULT now()
);

-- Update org_course_assignments table structure to match requirements
-- First create new table with correct structure
CREATE TABLE IF NOT EXISTS public.org_course_assignments_new (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id uuid NOT NULL,
  course_table text NOT NULL CHECK (course_table IN ('courses','org_courses','native_courses')),
  course_id text NOT NULL, -- Will be uuid for org_courses/native_courses, text for courses
  assignee_type text NOT NULL CHECK (assignee_type IN ('user','group')),
  assignee_id uuid NOT NULL,
  required boolean DEFAULT false,
  due_at timestamp with time zone,
  instructions text,
  created_by uuid NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Update xp_events table structure
-- Create new table with correct structure
CREATE TABLE IF NOT EXISTS public.xp_events_new (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  scope text NOT NULL CHECK (scope IN ('personal','org')),
  org_id uuid, -- Required when scope = 'org'
  source text NOT NULL,
  points integer NOT NULL,
  metadata jsonb DEFAULT '{}'::jsonb,
  occurred_at timestamp with time zone DEFAULT now()
);

-- Add constraint to ensure org_id is present when scope = 'org'
ALTER TABLE public.xp_events_new 
ADD CONSTRAINT xp_events_org_scope_check 
CHECK ((scope = 'org' AND org_id IS NOT NULL) OR (scope = 'personal'));

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_courses_org_id ON public.courses(org_id) WHERE org_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_courses_source ON public.courses(source);
CREATE INDEX IF NOT EXISTS idx_org_courses_status ON public.org_courses(status);
CREATE INDEX IF NOT EXISTS idx_org_course_imports_org_id ON public.org_course_imports(org_id);
CREATE INDEX IF NOT EXISTS idx_org_course_imports_status ON public.org_course_imports(status);
CREATE INDEX IF NOT EXISTS idx_org_course_versions_org_course_id ON public.org_course_versions(org_course_id);
CREATE INDEX IF NOT EXISTS idx_org_course_assignments_new_org_id ON public.org_course_assignments_new(org_id);
CREATE INDEX IF NOT EXISTS idx_org_course_assignments_new_assignee ON public.org_course_assignments_new(assignee_type, assignee_id);
CREATE INDEX IF NOT EXISTS idx_xp_events_new_user_scope ON public.xp_events_new(user_id, scope);
CREATE INDEX IF NOT EXISTS idx_xp_events_new_org_id ON public.xp_events_new(org_id) WHERE org_id IS NOT NULL;

-- Add updated_at triggers
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_org_course_imports_updated_at
  BEFORE UPDATE ON public.org_course_imports
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_org_course_assignments_new_updated_at
  BEFORE UPDATE ON public.org_course_assignments_new
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();