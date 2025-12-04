-- =========================================================
-- SCORM Studio: Production-ready database schema (Fixed)
-- Full SCORM 1.2 and 2004 compliance with security, analytics
-- =========================================================

-- Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Enums for SCORM standards and status values
DO $$ BEGIN
  CREATE TYPE scorm_standard AS ENUM ('SCORM 1.2', 'SCORM 2004');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE package_status AS ENUM ('uploading','parsing','ready','error','archived');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE lesson_status_12 AS ENUM ('not attempted','browsed','incomplete','completed','passed','failed');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE completion_status_2004 AS ENUM ('not attempted','unknown','incomplete','completed');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE success_status_2004 AS ENUM ('unknown','passed','failed');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Drop existing scorm tables to recreate with new schema
DROP TABLE IF EXISTS scorm_rate_limits CASCADE;
DROP TABLE IF EXISTS scorm_logs CASCADE;
DROP TABLE IF EXISTS scorm_analytics CASCADE;
DROP TABLE IF EXISTS scorm_objectives CASCADE;
DROP TABLE IF EXISTS scorm_interactions CASCADE;
DROP TABLE IF EXISTS scorm_runtime CASCADE;
DROP TABLE IF EXISTS scorm_enrollments CASCADE;
DROP TABLE IF EXISTS scorm_scos CASCADE;
DROP TABLE IF EXISTS scorm_packages CASCADE;

-- Enhanced SCORM Packages table
CREATE TABLE scorm_packages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  version TEXT DEFAULT '1.0',
  standard scorm_standard NOT NULL DEFAULT 'SCORM 1.2',
  status package_status NOT NULL DEFAULT 'uploading',
  
  -- File paths and storage
  zip_path TEXT,
  extract_path TEXT,
  manifest_path TEXT,
  
  -- Metadata from manifest parsing
  metadata JSONB DEFAULT '{}'::jsonb,
  organizations JSONB DEFAULT '[]'::jsonb,
  resources JSONB DEFAULT '[]'::jsonb,
  
  -- Security and access
  created_by UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  is_public BOOLEAN DEFAULT false,
  
  -- Tracking
  upload_size BIGINT,
  parsed_at TIMESTAMPTZ,
  last_accessed_at TIMESTAMPTZ,
  access_count INTEGER DEFAULT 0,
  
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- SCORM SCOs (Sharable Content Objects)
CREATE TABLE scorm_scos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  package_id UUID NOT NULL REFERENCES scorm_packages(id) ON DELETE CASCADE,
  
  -- Manifest identifiers
  identifier TEXT NOT NULL,
  title TEXT NOT NULL,
  launch_href TEXT NOT NULL,
  parameters TEXT,
  
  -- Sequencing and navigation
  seq_order INTEGER NOT NULL DEFAULT 1,
  parent_id UUID REFERENCES scorm_scos(id) ON DELETE CASCADE,
  prerequisites JSONB DEFAULT '[]'::jsonb,
  
  -- Scoring and completion
  mastery_score NUMERIC(5,2),
  max_time_allowed TEXT,
  time_limit_action TEXT DEFAULT 'continue,no message',
  
  -- Content properties
  is_launchable BOOLEAN NOT NULL DEFAULT true,
  scorm_type TEXT DEFAULT 'sco',
  
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  UNIQUE (package_id, identifier)
);

-- User enrollments in packages
CREATE TABLE scorm_enrollments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  package_id UUID NOT NULL REFERENCES scorm_packages(id) ON DELETE CASCADE,
  
  role TEXT NOT NULL DEFAULT 'learner',
  enrolled_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  
  -- Progress tracking
  current_sco_id UUID REFERENCES scorm_scos(id),
  progress_percentage NUMERIC(5,2) DEFAULT 0,
  
  UNIQUE (user_id, package_id)
);

-- SCORM Runtime Data (per-user, per-SCO state)
CREATE TABLE scorm_runtime (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  enrollment_id UUID NOT NULL REFERENCES scorm_enrollments(id) ON DELETE CASCADE,
  sco_id UUID NOT NULL REFERENCES scorm_scos(id) ON DELETE CASCADE,
  package_id UUID NOT NULL REFERENCES scorm_packages(id) ON DELETE CASCADE,
  
  standard scorm_standard NOT NULL DEFAULT 'SCORM 1.2',
  
  -- SCORM 1.2 core elements
  lesson_status lesson_status_12 DEFAULT 'not attempted',
  lesson_location TEXT,
  score_raw NUMERIC(6,3),
  score_min NUMERIC(6,3),
  score_max NUMERIC(6,3),
  total_time TEXT,        -- HH:MM:SS.CC format
  session_time TEXT,      -- HH:MM:SS.CC format
  entry TEXT,             -- ab-initio | resume
  exit TEXT,              -- time-out | suspend | logout | ""
  credit TEXT DEFAULT 'credit',
  
  -- SCORM 2004 elements
  completion_status completion_status_2004 DEFAULT 'not attempted',
  success_status success_status_2004 DEFAULT 'unknown',
  location TEXT,          -- 2004 cmi.location
  score_scaled NUMERIC(6,3),   -- -1.0 to 1.0
  progress_measure NUMERIC(6,3), -- 0.0 to 1.0
  total_time_2004 TEXT,   -- ISO 8601 PT format
  session_time_2004 TEXT,
  
  -- Shared data
  suspend_data TEXT,
  launch_data TEXT,
  comments TEXT,
  comments_from_lms TEXT,
  
  -- Full CMI data object
  cmi_data JSONB NOT NULL DEFAULT '{}'::jsonb,
  
  -- Session tracking
  initialized_at TIMESTAMPTZ,
  last_commit_at TIMESTAMPTZ,
  terminated_at TIMESTAMPTZ,
  session_start_time TIMESTAMPTZ,
  
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  UNIQUE (enrollment_id, sco_id)
);

-- SCORM Interactions (Q&A tracking)
CREATE TABLE scorm_interactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  runtime_id UUID NOT NULL REFERENCES scorm_runtime(id) ON DELETE CASCADE,
  
  interaction_index INTEGER NOT NULL,
  interaction_id TEXT,
  time TEXT,
  type TEXT,
  weighting NUMERIC(6,3),
  learner_response TEXT,
  result TEXT,
  latency TEXT,
  description TEXT,
  
  objectives JSONB DEFAULT '[]'::jsonb,
  correct_responses JSONB DEFAULT '[]'::jsonb,
  
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  UNIQUE (runtime_id, interaction_index)
);

-- SCORM Objectives (learning objectives per SCO)
CREATE TABLE scorm_objectives (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  runtime_id UUID NOT NULL REFERENCES scorm_runtime(id) ON DELETE CASCADE,
  
  objective_index INTEGER NOT NULL,
  objective_id TEXT,
  
  -- Scores
  score_raw NUMERIC(6,3),
  score_min NUMERIC(6,3),
  score_max NUMERIC(6,3),
  score_scaled NUMERIC(6,3),
  
  -- Status (version-dependent)
  status_12 lesson_status_12,
  success_status success_status_2004,
  completion_status completion_status_2004,
  
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  UNIQUE (runtime_id, objective_index)
);

-- SCORM Analytics and Events
CREATE TABLE scorm_analytics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  package_id UUID REFERENCES scorm_packages(id) ON DELETE CASCADE,
  sco_id UUID REFERENCES scorm_scos(id) ON DELETE SET NULL,
  enrollment_id UUID REFERENCES scorm_enrollments(id) ON DELETE SET NULL,
  
  event_type TEXT NOT NULL, -- launch, initialize, setvalue, commit, terminate, complete
  event_data JSONB DEFAULT '{}'::jsonb,
  
  -- Performance metrics
  duration_ms INTEGER,
  score_achieved NUMERIC(6,3),
  
  -- Context
  user_agent TEXT,
  ip_address INET,
  session_id TEXT,
  
  timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Debug and Audit Logs
CREATE TABLE scorm_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  enrollment_id UUID REFERENCES scorm_enrollments(id) ON DELETE SET NULL,
  sco_id UUID REFERENCES scorm_scos(id) ON DELETE SET NULL,
  package_id UUID REFERENCES scorm_packages(id) ON DELETE SET NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  
  level TEXT NOT NULL DEFAULT 'info',  -- info|warn|error|debug
  category TEXT NOT NULL DEFAULT 'api',-- api|runtime|player|parser|security
  message TEXT NOT NULL,
  data JSONB DEFAULT '{}'::jsonb,
  
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Security: Rate limiting and access control
CREATE TABLE scorm_rate_limits (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  action_type TEXT NOT NULL, -- api_call, commit, setvalue
  count INTEGER NOT NULL DEFAULT 1,
  window_start TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  UNIQUE (user_id, action_type, window_start)
);

-- =========================================================
-- Indexes for Performance (now that all columns exist)
-- =========================================================

CREATE INDEX idx_scorm_packages_owner ON scorm_packages(created_by);
CREATE INDEX idx_scorm_packages_status ON scorm_packages(status);
CREATE INDEX idx_scorm_packages_public ON scorm_packages(is_public) WHERE is_public = true;

CREATE INDEX idx_scorm_scos_package ON scorm_scos(package_id);
CREATE INDEX idx_scorm_scos_order ON scorm_scos(package_id, seq_order);
CREATE INDEX idx_scorm_scos_parent ON scorm_scos(parent_id) WHERE parent_id IS NOT NULL;

CREATE INDEX idx_scorm_enrollments_user ON scorm_enrollments(user_id);
CREATE INDEX idx_scorm_enrollments_package ON scorm_enrollments(package_id);

CREATE INDEX idx_scorm_runtime_enrollment ON scorm_runtime(enrollment_id);
CREATE INDEX idx_scorm_runtime_sco ON scorm_runtime(sco_id);
CREATE INDEX idx_scorm_runtime_package ON scorm_runtime(package_id);
CREATE INDEX idx_scorm_runtime_status ON scorm_runtime(lesson_status, completion_status);

CREATE INDEX idx_scorm_interactions_runtime ON scorm_interactions(runtime_id);
CREATE INDEX idx_scorm_objectives_runtime ON scorm_objectives(runtime_id);

CREATE INDEX idx_scorm_analytics_user ON scorm_analytics(user_id);
CREATE INDEX idx_scorm_analytics_package ON scorm_analytics(package_id);
CREATE INDEX idx_scorm_analytics_event ON scorm_analytics(event_type);
CREATE INDEX idx_scorm_analytics_timestamp ON scorm_analytics(timestamp);

CREATE INDEX idx_scorm_logs_user ON scorm_logs(user_id);
CREATE INDEX idx_scorm_logs_package ON scorm_logs(package_id);
CREATE INDEX idx_scorm_logs_level ON scorm_logs(level);
CREATE INDEX idx_scorm_logs_created ON scorm_logs(created_at);

-- =========================================================
-- Row Level Security (RLS)
-- =========================================================

ALTER TABLE scorm_packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE scorm_scos ENABLE ROW LEVEL SECURITY;
ALTER TABLE scorm_enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE scorm_runtime ENABLE ROW LEVEL SECURITY;
ALTER TABLE scorm_interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE scorm_objectives ENABLE ROW LEVEL SECURITY;
ALTER TABLE scorm_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE scorm_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE scorm_rate_limits ENABLE ROW LEVEL SECURITY;

-- Packages: Owners and enrolled users can read, only owners can modify
CREATE POLICY "scorm_packages_select" ON scorm_packages FOR SELECT USING (
  created_by = auth.uid() OR 
  is_public = true OR
  EXISTS (
    SELECT 1 FROM scorm_enrollments e 
    WHERE e.package_id = scorm_packages.id AND e.user_id = auth.uid()
  )
);

CREATE POLICY "scorm_packages_insert" ON scorm_packages FOR INSERT WITH CHECK (
  created_by = auth.uid()
);

CREATE POLICY "scorm_packages_update" ON scorm_packages FOR UPDATE USING (
  created_by = auth.uid()
) WITH CHECK (created_by = auth.uid());

CREATE POLICY "scorm_packages_delete" ON scorm_packages FOR DELETE USING (
  created_by = auth.uid()
);

-- SCOs: Accessible to enrolled users
CREATE POLICY "scorm_scos_select" ON scorm_scos FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM scorm_packages p
    LEFT JOIN scorm_enrollments e ON e.package_id = p.id
    WHERE p.id = scorm_scos.package_id AND (
      p.created_by = auth.uid() OR 
      p.is_public = true OR
      e.user_id = auth.uid()
    )
  )
);

-- Enrollments: Users can manage their own
CREATE POLICY "scorm_enrollments_select" ON scorm_enrollments FOR SELECT USING (
  user_id = auth.uid() OR EXISTS (
    SELECT 1 FROM scorm_packages p 
    WHERE p.id = scorm_enrollments.package_id AND p.created_by = auth.uid()
  )
);

CREATE POLICY "scorm_enrollments_insert" ON scorm_enrollments FOR INSERT WITH CHECK (
  user_id = auth.uid()
);

CREATE POLICY "scorm_enrollments_update" ON scorm_enrollments FOR UPDATE USING (
  user_id = auth.uid()
) WITH CHECK (user_id = auth.uid());

-- Runtime: Users can access their own runtime data
CREATE POLICY "scorm_runtime_all" ON scorm_runtime FOR ALL USING (
  EXISTS (
    SELECT 1 FROM scorm_enrollments e 
    WHERE e.id = scorm_runtime.enrollment_id AND e.user_id = auth.uid()
  )
) WITH CHECK (
  EXISTS (
    SELECT 1 FROM scorm_enrollments e 
    WHERE e.id = scorm_runtime.enrollment_id AND e.user_id = auth.uid()
  )
);

-- Interactions and Objectives: Linked to runtime
CREATE POLICY "scorm_interactions_all" ON scorm_interactions FOR ALL USING (
  EXISTS (
    SELECT 1 FROM scorm_runtime r
    JOIN scorm_enrollments e ON e.id = r.enrollment_id
    WHERE r.id = scorm_interactions.runtime_id AND e.user_id = auth.uid()
  )
) WITH CHECK (
  EXISTS (
    SELECT 1 FROM scorm_runtime r
    JOIN scorm_enrollments e ON e.id = r.enrollment_id
    WHERE r.id = scorm_interactions.runtime_id AND e.user_id = auth.uid()
  )
);

CREATE POLICY "scorm_objectives_all" ON scorm_objectives FOR ALL USING (
  EXISTS (
    SELECT 1 FROM scorm_runtime r
    JOIN scorm_enrollments e ON e.id = r.enrollment_id
    WHERE r.id = scorm_objectives.runtime_id AND e.user_id = auth.uid()
  )
) WITH CHECK (
  EXISTS (
    SELECT 1 FROM scorm_runtime r
    JOIN scorm_enrollments e ON e.id = r.enrollment_id
    WHERE r.id = scorm_objectives.runtime_id AND e.user_id = auth.uid()
  )
);

-- Analytics: Users can view their own, owners can view package analytics
CREATE POLICY "scorm_analytics_select" ON scorm_analytics FOR SELECT USING (
  user_id = auth.uid() OR EXISTS (
    SELECT 1 FROM scorm_packages p 
    WHERE p.id = scorm_analytics.package_id AND p.created_by = auth.uid()
  )
);

CREATE POLICY "scorm_analytics_insert" ON scorm_analytics FOR INSERT WITH CHECK (true);

-- Logs: Users can view their own, package owners can view package logs
CREATE POLICY "scorm_logs_select" ON scorm_logs FOR SELECT USING (
  user_id = auth.uid() OR EXISTS (
    SELECT 1 FROM scorm_packages p 
    WHERE p.id = scorm_logs.package_id AND p.created_by = auth.uid()
  )
);

CREATE POLICY "scorm_logs_insert" ON scorm_logs FOR INSERT WITH CHECK (true);

-- Rate limits: Users can manage their own
CREATE POLICY "scorm_rate_limits_all" ON scorm_rate_limits FOR ALL USING (
  user_id = auth.uid()
) WITH CHECK (user_id = auth.uid());

-- =========================================================
-- Helper Functions
-- =========================================================

-- Auto-update timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply triggers to tables
CREATE TRIGGER update_scorm_packages_updated_at 
    BEFORE UPDATE ON scorm_packages 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_scorm_scos_updated_at 
    BEFORE UPDATE ON scorm_scos 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_scorm_runtime_updated_at 
    BEFORE UPDATE ON scorm_runtime 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- SCORM runtime commit helper function
CREATE OR REPLACE FUNCTION scorm_commit_runtime(
  p_enrollment_id UUID,
  p_sco_id UUID,
  p_cmi_data JSONB,
  p_analytics_data JSONB DEFAULT '{}'::jsonb
) RETURNS JSONB AS $$
DECLARE
  v_runtime_id UUID;
  v_package_id UUID;
  v_user_id UUID;
BEGIN
  -- Get package and user info
  SELECT r.id, r.package_id, e.user_id INTO v_runtime_id, v_package_id, v_user_id
  FROM scorm_runtime r
  JOIN scorm_enrollments e ON e.id = r.enrollment_id
  WHERE r.enrollment_id = p_enrollment_id AND r.sco_id = p_sco_id;
  
  -- Upsert runtime data
  INSERT INTO scorm_runtime (
    enrollment_id, sco_id, package_id, cmi_data, last_commit_at
  ) VALUES (
    p_enrollment_id, p_sco_id, v_package_id, p_cmi_data, NOW()
  ) ON CONFLICT (enrollment_id, sco_id) 
  DO UPDATE SET
    cmi_data = EXCLUDED.cmi_data,
    last_commit_at = NOW(),
    lesson_status = CASE 
      WHEN p_cmi_data ? 'cmi.core.lesson_status' THEN (p_cmi_data->>'cmi.core.lesson_status')::lesson_status_12
      ELSE scorm_runtime.lesson_status
    END,
    completion_status = CASE 
      WHEN p_cmi_data ? 'cmi.completion_status' THEN (p_cmi_data->>'cmi.completion_status')::completion_status_2004
      ELSE scorm_runtime.completion_status
    END,
    score_raw = COALESCE(
      NULLIF(p_cmi_data->>'cmi.core.score.raw', '')::NUMERIC,
      NULLIF(p_cmi_data->>'cmi.score.raw', '')::NUMERIC,
      scorm_runtime.score_raw
    ),
    suspend_data = COALESCE(
      NULLIF(p_cmi_data->>'cmi.suspend_data', ''),
      scorm_runtime.suspend_data
    )
  RETURNING id INTO v_runtime_id;
  
  -- Log analytics event
  INSERT INTO scorm_analytics (
    user_id, package_id, sco_id, enrollment_id,
    event_type, event_data, timestamp
  ) VALUES (
    v_user_id, v_package_id, p_sco_id, p_enrollment_id,
    'commit', p_analytics_data, NOW()
  );
  
  RETURN jsonb_build_object('success', true, 'runtime_id', v_runtime_id);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Rate limiting check function
CREATE OR REPLACE FUNCTION check_rate_limit(
  p_user_id UUID,
  p_action_type TEXT,
  p_limit INTEGER DEFAULT 100,
  p_window_seconds INTEGER DEFAULT 60
) RETURNS BOOLEAN AS $$
DECLARE
  v_count INTEGER;
  v_window_start TIMESTAMPTZ;
BEGIN
  v_window_start := DATE_TRUNC('minute', NOW());
  
  -- Get current count in this window
  SELECT COALESCE(count, 0) INTO v_count
  FROM scorm_rate_limits
  WHERE user_id = p_user_id 
    AND action_type = p_action_type 
    AND window_start = v_window_start;
  
  -- Check if limit exceeded
  IF v_count >= p_limit THEN
    RETURN FALSE;
  END IF;
  
  -- Increment counter
  INSERT INTO scorm_rate_limits (user_id, action_type, window_start, count)
  VALUES (p_user_id, p_action_type, v_window_start, 1)
  ON CONFLICT (user_id, action_type, window_start)
  DO UPDATE SET count = scorm_rate_limits.count + 1;
  
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;