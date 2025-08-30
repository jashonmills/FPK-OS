-- Enhanced SCORM Database Schema (working with existing structure)
-- Update existing tables and add new ones for full functionality

-- Update scorm_packages table with new fields
ALTER TABLE scorm_packages 
ADD COLUMN IF NOT EXISTS slug text,
ADD COLUMN IF NOT EXISTS standard text CHECK (standard in ('1.2','2004')) DEFAULT '1.2',
ADD COLUMN IF NOT EXISTS version_number integer DEFAULT 1,
ADD COLUMN IF NOT EXISTS storage_key text,
ADD COLUMN IF NOT EXISTS manifest_xml text,
ADD COLUMN IF NOT EXISTS entry_sco_id uuid,
ADD COLUMN IF NOT EXISTS owner_user_id uuid;

-- Create unique constraint on slug
CREATE UNIQUE INDEX IF NOT EXISTS scorm_packages_slug_idx ON scorm_packages(slug);

-- Update scorm_scos table with additional fields (if it exists)
ALTER TABLE scorm_scos 
ADD COLUMN IF NOT EXISTS mastery_score integer,
ADD COLUMN IF NOT EXISTS sequencing_json jsonb,
ADD COLUMN IF NOT EXISTS position integer DEFAULT 0;

-- Add missing fields to existing scorm_enrollments table
ALTER TABLE scorm_enrollments
ADD COLUMN IF NOT EXISTS user_id uuid,
ADD COLUMN IF NOT EXISTS assigned_by uuid,
ADD COLUMN IF NOT EXISTS role text CHECK (role in ('learner','teacher','admin')) DEFAULT 'learner';

-- Update user_id from learner_id if null
UPDATE scorm_enrollments SET user_id = learner_id WHERE user_id IS NULL;

-- Create scorm_attempts table for tracking individual attempts
CREATE TABLE IF NOT EXISTS scorm_attempts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  enrollment_id uuid REFERENCES scorm_enrollments(id) ON DELETE CASCADE,
  sco_id uuid REFERENCES scorm_scos(id) ON DELETE CASCADE,
  attempt_no integer NOT NULL DEFAULT 1,
  lesson_status text,
  completion_status text,
  success_status text,
  score_raw integer,
  score_min integer DEFAULT 0,
  score_max integer DEFAULT 100,
  score_scaled numeric,
  total_time interval DEFAULT '00:00:00',
  session_time text,
  suspend_data text,
  lesson_location text,
  entry text,
  exit text,
  raw_cmi jsonb DEFAULT '{}',
  started_at timestamptz DEFAULT now(),
  finished_at timestamptz,
  last_commit_at timestamptz DEFAULT now(),
  UNIQUE(enrollment_id, sco_id, attempt_no)
);

-- Create package analytics view
CREATE OR REPLACE VIEW scorm_package_analytics AS
SELECT 
  sp.id,
  sp.title,
  sp.status,
  COUNT(DISTINCT se.id) as total_enrollments,
  COUNT(DISTINCT CASE WHEN se.status = 'completed' THEN se.id END) as completed_enrollments,
  COUNT(DISTINCT CASE WHEN se.status = 'passed' THEN se.id END) as passed_enrollments,
  ROUND(AVG(sa.score_raw)) as avg_score,
  COUNT(DISTINCT sa.id) as total_attempts
FROM scorm_packages sp
LEFT JOIN scorm_enrollments se ON sp.id = se.package_id
LEFT JOIN scorm_attempts sa ON se.id = sa.enrollment_id
GROUP BY sp.id, sp.title, sp.status;

-- Function to check if user has admin/teacher role
CREATE OR REPLACE FUNCTION public.user_has_admin_role()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() 
    AND role::text IN ('admin', 'teacher')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- RLS Policies for scorm_enrollments (check if already exist first)
ALTER TABLE scorm_enrollments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own enrollments" ON scorm_enrollments;
CREATE POLICY "Users can view their own enrollments"
ON scorm_enrollments FOR SELECT
USING (COALESCE(user_id, learner_id) = auth.uid());

DROP POLICY IF EXISTS "Users can create enrollments for themselves" ON scorm_enrollments;
CREATE POLICY "Users can create enrollments for themselves"
ON scorm_enrollments FOR INSERT
WITH CHECK (COALESCE(user_id, learner_id) = auth.uid());

DROP POLICY IF EXISTS "Admins can manage all enrollments" ON scorm_enrollments;
CREATE POLICY "Admins can manage all enrollments"
ON scorm_enrollments FOR ALL
USING (public.user_has_admin_role());

-- RLS Policies for scorm_attempts
ALTER TABLE scorm_attempts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own attempts"
ON scorm_attempts FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM scorm_enrollments se 
    WHERE se.id = enrollment_id 
    AND COALESCE(se.user_id, se.learner_id) = auth.uid()
  )
);

CREATE POLICY "Users can create their own attempts"
ON scorm_attempts FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM scorm_enrollments se 
    WHERE se.id = enrollment_id 
    AND COALESCE(se.user_id, se.learner_id) = auth.uid()
  )
);

CREATE POLICY "Users can update their own attempts"
ON scorm_attempts FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM scorm_enrollments se 
    WHERE se.id = enrollment_id 
    AND COALESCE(se.user_id, se.learner_id) = auth.uid()
  )
);

CREATE POLICY "Admins can view all attempts"
ON scorm_attempts FOR SELECT
USING (public.user_has_admin_role());

-- Function to generate unique slug
CREATE OR REPLACE FUNCTION generate_scorm_package_slug(title text)
RETURNS text AS $$
DECLARE
  base_slug text;
  final_slug text;
  counter integer := 0;
BEGIN
  -- Create base slug from title
  base_slug := lower(regexp_replace(trim(title), '[^a-zA-Z0-9\s]', '', 'g'));
  base_slug := regexp_replace(base_slug, '\s+', '-', 'g');
  base_slug := substring(base_slug from 1 for 50);
  
  final_slug := base_slug;
  
  -- Check for uniqueness and increment if needed
  WHILE EXISTS (SELECT 1 FROM scorm_packages WHERE slug = final_slug) LOOP
    counter := counter + 1;
    final_slug := base_slug || '-' || counter;
  END LOOP;
  
  RETURN final_slug;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-generate slug
CREATE OR REPLACE FUNCTION set_scorm_package_slug()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.slug IS NULL OR NEW.slug = '' THEN
    NEW.slug := generate_scorm_package_slug(NEW.title);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_set_scorm_package_slug ON scorm_packages;
CREATE TRIGGER trigger_set_scorm_package_slug
  BEFORE INSERT OR UPDATE ON scorm_packages
  FOR EACH ROW EXECUTE FUNCTION set_scorm_package_slug();

-- Update updated_at timestamp
CREATE OR REPLACE FUNCTION update_scorm_package_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_scorm_package_updated_at ON scorm_packages;
CREATE TRIGGER trigger_update_scorm_package_updated_at
  BEFORE UPDATE ON scorm_packages
  FOR EACH ROW EXECUTE FUNCTION update_scorm_package_updated_at();