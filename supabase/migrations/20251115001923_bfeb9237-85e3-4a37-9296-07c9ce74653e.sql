-- =====================================================
-- PHASE 1C: Data Migration - Students to Clients (CORRECTED)
-- =====================================================

-- =====================================================
-- STEP 1: Migrate students → clients
-- =====================================================

INSERT INTO public.clients (
  id,
  client_name,
  date_of_birth,
  primary_diagnosis,
  grade_level,
  school_name,
  avatar_url,
  metadata,
  created_at,
  updated_at
)
SELECT 
  id,
  student_name,
  date_of_birth,
  primary_diagnosis,
  grade_level,
  school_name,
  COALESCE(profile_image_url, photo_url) AS avatar_url,
  jsonb_build_object(
    'migrated_from', 'students',
    'original_family_id', family_id,
    'original_organization_id', organization_id,
    'secondary_conditions', secondary_conditions,
    'personal_notes', personal_notes,
    'migration_date', now()
  ) || COALESCE(metadata, '{}'::jsonb),
  created_at,
  updated_at
FROM public.students
WHERE is_active = true
ON CONFLICT (id) DO NOTHING;

-- =====================================================
-- STEP 2: Create client_access for B2C families
-- =====================================================

INSERT INTO public.client_access (
  client_id,
  family_id,
  organization_id,
  access_level,
  status,
  granted_at,
  granted_by,
  metadata
)
SELECT 
  s.id AS client_id,
  s.family_id,
  NULL AS organization_id,
  'owner' AS access_level,
  'active' AS status,
  s.created_at AS granted_at,
  f.created_by AS granted_by,
  jsonb_build_object(
    'migrated_from', 'students',
    'migration_date', now(),
    'original_context', 'b2c_family'
  )
FROM public.students s
JOIN public.families f ON s.family_id = f.id
WHERE s.family_id IS NOT NULL AND s.is_active = true
ON CONFLICT (client_id, family_id, organization_id, status) DO NOTHING;

-- =====================================================
-- STEP 3: Create client_access for B2B organizations
-- =====================================================

INSERT INTO public.client_access (
  client_id,
  family_id,
  organization_id,
  access_level,
  status,
  granted_at,
  granted_by,
  metadata
)
SELECT 
  s.id AS client_id,
  NULL AS family_id,
  s.organization_id,
  'admin' AS access_level,
  'active' AS status,
  s.created_at AS granted_at,
  s.added_by_org_member_id AS granted_by,
  jsonb_build_object(
    'migrated_from', 'students',
    'migration_date', now(),
    'original_context', 'b2b_organization'
  )
FROM public.students s
WHERE s.organization_id IS NOT NULL AND s.is_active = true
ON CONFLICT (client_id, family_id, organization_id, status) DO NOTHING;

-- =====================================================
-- STEP 4: Add client_id to existing tables
-- =====================================================

-- bedrock_documents
ALTER TABLE public.bedrock_documents 
ADD COLUMN IF NOT EXISTS client_id UUID REFERENCES public.clients(id) ON DELETE CASCADE;
CREATE INDEX IF NOT EXISTS idx_bedrock_documents_client_id ON public.bedrock_documents(client_id);

-- bedrock_metrics
ALTER TABLE public.bedrock_metrics 
ADD COLUMN IF NOT EXISTS client_id UUID REFERENCES public.clients(id) ON DELETE CASCADE;
CREATE INDEX IF NOT EXISTS idx_bedrock_metrics_client_id ON public.bedrock_metrics(client_id);

-- documents
ALTER TABLE public.documents 
ADD COLUMN IF NOT EXISTS client_id UUID REFERENCES public.clients(id) ON DELETE CASCADE;
CREATE INDEX IF NOT EXISTS idx_documents_client_id ON public.documents(client_id);

-- educator_logs
ALTER TABLE public.educator_logs 
ADD COLUMN IF NOT EXISTS client_id UUID REFERENCES public.clients(id) ON DELETE CASCADE;
CREATE INDEX IF NOT EXISTS idx_educator_logs_client_id ON public.educator_logs(client_id);

-- parent_logs
ALTER TABLE public.parent_logs 
ADD COLUMN IF NOT EXISTS client_id UUID REFERENCES public.clients(id) ON DELETE CASCADE;
CREATE INDEX IF NOT EXISTS idx_parent_logs_client_id ON public.parent_logs(client_id);

-- incident_logs
ALTER TABLE public.incident_logs 
ADD COLUMN IF NOT EXISTS client_id UUID REFERENCES public.clients(id) ON DELETE CASCADE;
CREATE INDEX IF NOT EXISTS idx_incident_logs_client_id ON public.incident_logs(client_id);

-- goals
ALTER TABLE public.goals 
ADD COLUMN IF NOT EXISTS client_id UUID REFERENCES public.clients(id) ON DELETE CASCADE;
CREATE INDEX IF NOT EXISTS idx_goals_client_id ON public.goals(client_id);

-- sleep_records
ALTER TABLE public.sleep_records 
ADD COLUMN IF NOT EXISTS client_id UUID REFERENCES public.clients(id) ON DELETE CASCADE;
CREATE INDEX IF NOT EXISTS idx_sleep_records_client_id ON public.sleep_records(client_id);

-- wearable_sleep_data
ALTER TABLE public.wearable_sleep_data 
ADD COLUMN IF NOT EXISTS client_id UUID REFERENCES public.clients(id) ON DELETE CASCADE;
CREATE INDEX IF NOT EXISTS idx_wearable_sleep_data_client_id ON public.wearable_sleep_data(client_id);

-- family_data_embeddings
ALTER TABLE public.family_data_embeddings 
ADD COLUMN IF NOT EXISTS client_id UUID REFERENCES public.clients(id) ON DELETE CASCADE;
CREATE INDEX IF NOT EXISTS idx_family_data_embeddings_client_id ON public.family_data_embeddings(client_id);

-- embedding_queue
ALTER TABLE public.embedding_queue 
ADD COLUMN IF NOT EXISTS client_id UUID REFERENCES public.clients(id) ON DELETE CASCADE;
CREATE INDEX IF NOT EXISTS idx_embedding_queue_client_id ON public.embedding_queue(client_id);

-- =====================================================
-- STEP 5: Backfill client_id
-- =====================================================

UPDATE public.bedrock_documents SET client_id = student_id WHERE student_id IS NOT NULL AND client_id IS NULL;
UPDATE public.bedrock_metrics SET client_id = student_id WHERE student_id IS NOT NULL AND client_id IS NULL;
UPDATE public.documents SET client_id = student_id WHERE student_id IS NOT NULL AND client_id IS NULL;
UPDATE public.educator_logs SET client_id = student_id WHERE student_id IS NOT NULL AND client_id IS NULL;
UPDATE public.parent_logs SET client_id = student_id WHERE student_id IS NOT NULL AND client_id IS NULL;
UPDATE public.incident_logs SET client_id = student_id WHERE student_id IS NOT NULL AND client_id IS NULL;
UPDATE public.goals SET client_id = student_id WHERE student_id IS NOT NULL AND client_id IS NULL;
UPDATE public.sleep_records SET client_id = student_id WHERE student_id IS NOT NULL AND client_id IS NULL;
UPDATE public.wearable_sleep_data SET client_id = student_id WHERE student_id IS NOT NULL AND client_id IS NULL;
UPDATE public.family_data_embeddings SET client_id = student_id WHERE student_id IS NOT NULL AND client_id IS NULL;
UPDATE public.embedding_queue SET client_id = student_id WHERE student_id IS NOT NULL AND client_id IS NULL;

-- =====================================================
-- STEP 6: Migration audit
-- =====================================================

CREATE TABLE IF NOT EXISTS public.client_migration_audit (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  migration_phase TEXT NOT NULL,
  records_migrated INTEGER NOT NULL,
  started_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  completed_at TIMESTAMPTZ,
  status TEXT NOT NULL DEFAULT 'in_progress',
  metadata JSONB DEFAULT '{}'::jsonb
);

ALTER TABLE public.client_migration_audit ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view migration audit"
  ON public.client_migration_audit FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.organization_members om
      WHERE om.user_id = auth.uid() AND om.is_active = true
        AND om.role IN ('org_owner', 'district_admin', 'school_admin')
    )
  );

INSERT INTO public.client_migration_audit (
  migration_phase, records_migrated, completed_at, status, metadata
)
SELECT 
  'phase_1c_students_to_clients',
  COUNT(*),
  now(),
  'completed',
  jsonb_build_object(
    'clients_created', (SELECT COUNT(*) FROM public.clients WHERE metadata->>'migrated_from' = 'students'),
    'b2c_access', (SELECT COUNT(*) FROM public.client_access WHERE metadata->>'original_context' = 'b2c_family'),
    'b2b_access', (SELECT COUNT(*) FROM public.client_access WHERE metadata->>'original_context' = 'b2b_organization'),
    'tables_updated', 11
  )
FROM public.students WHERE is_active = true;