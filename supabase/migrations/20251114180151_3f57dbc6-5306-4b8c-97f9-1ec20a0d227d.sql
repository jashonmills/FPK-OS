-- ============================================================================
-- PHASE 1B: UNIFY DATA MODEL - Add organization_id support
-- ============================================================================
-- This migration enables BOTH B2C (families) and B2B (organizations) to use:
-- - Bedrock document analysis
-- - Student insights
-- - Family data embeddings (RAG/semantic search)
-- ============================================================================

-- 1. Add organization_id to bedrock_documents
ALTER TABLE bedrock_documents 
ADD COLUMN organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE;

CREATE INDEX idx_bedrock_docs_org ON bedrock_documents(organization_id);

-- Add constraint: must have either family_id OR organization_id
ALTER TABLE bedrock_documents 
ADD CONSTRAINT bedrock_documents_owner_check 
CHECK (
  (family_id IS NOT NULL AND organization_id IS NULL) OR 
  (family_id IS NULL AND organization_id IS NOT NULL)
);

-- 2. Add organization_id to student_insights
ALTER TABLE student_insights 
ADD COLUMN organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE;

CREATE INDEX idx_insights_org ON student_insights(organization_id);

-- Add constraint: must have either family_id OR organization_id
ALTER TABLE student_insights 
ADD CONSTRAINT student_insights_owner_check 
CHECK (
  (family_id IS NOT NULL AND organization_id IS NULL) OR 
  (family_id IS NULL AND organization_id IS NOT NULL)
);

-- 3. Add organization_id to family_data_embeddings
ALTER TABLE family_data_embeddings 
ADD COLUMN organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE;

CREATE INDEX idx_embeddings_org ON family_data_embeddings(organization_id);

-- Add constraint: must have either family_id OR organization_id
ALTER TABLE family_data_embeddings 
ADD CONSTRAINT family_data_embeddings_owner_check 
CHECK (
  (family_id IS NOT NULL AND organization_id IS NULL) OR 
  (family_id IS NULL AND organization_id IS NOT NULL)
);

-- 4. Add organization_id to embedding_queue
ALTER TABLE embedding_queue 
ADD COLUMN organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE;

CREATE INDEX idx_embedding_queue_org ON embedding_queue(organization_id);

-- Add constraint: must have either family_id OR organization_id
ALTER TABLE embedding_queue 
ADD CONSTRAINT embedding_queue_owner_check 
CHECK (
  (family_id IS NOT NULL AND organization_id IS NULL) OR 
  (family_id IS NULL AND organization_id IS NOT NULL)
);

-- ============================================================================
-- UPDATE RLS POLICIES
-- ============================================================================

-- 5. Update RLS policies for bedrock_documents (B2B access)
DROP POLICY IF EXISTS "Family members can view bedrock documents" ON bedrock_documents;
CREATE POLICY "Users can view bedrock documents"
ON bedrock_documents FOR SELECT
USING (
  (family_id IS NOT NULL AND is_family_member(auth.uid(), family_id)) OR
  (organization_id IS NOT NULL AND is_organization_member(auth.uid(), organization_id))
);

DROP POLICY IF EXISTS "Family members can insert bedrock documents" ON bedrock_documents;
CREATE POLICY "Users can insert bedrock documents"
ON bedrock_documents FOR INSERT
WITH CHECK (
  (family_id IS NOT NULL AND is_family_member(auth.uid(), family_id)) OR
  (organization_id IS NOT NULL AND is_organization_member(auth.uid(), organization_id))
);

DROP POLICY IF EXISTS "Family members can update bedrock documents" ON bedrock_documents;
CREATE POLICY "Users can update bedrock documents"
ON bedrock_documents FOR UPDATE
USING (
  (family_id IS NOT NULL AND is_family_member(auth.uid(), family_id)) OR
  (organization_id IS NOT NULL AND is_organization_member(auth.uid(), organization_id))
);

DROP POLICY IF EXISTS "Family members can delete bedrock documents" ON bedrock_documents;
CREATE POLICY "Users can delete bedrock documents"
ON bedrock_documents FOR DELETE
USING (
  (family_id IS NOT NULL AND is_family_owner(auth.uid(), family_id)) OR
  (organization_id IS NOT NULL AND is_organization_admin(auth.uid(), organization_id))
);

-- 6. Update RLS policies for student_insights (B2B access)
DROP POLICY IF EXISTS "Family members can view insights" ON student_insights;
CREATE POLICY "Users can view insights"
ON student_insights FOR SELECT
USING (
  (family_id IS NOT NULL AND is_family_member(auth.uid(), family_id)) OR
  (organization_id IS NOT NULL AND is_organization_member(auth.uid(), organization_id))
);

DROP POLICY IF EXISTS "Family members can insert insights" ON student_insights;
CREATE POLICY "Users can insert insights"
ON student_insights FOR INSERT
WITH CHECK (
  (family_id IS NOT NULL AND is_family_member(auth.uid(), family_id)) OR
  (organization_id IS NOT NULL AND is_organization_member(auth.uid(), organization_id))
);

DROP POLICY IF EXISTS "Family members can update insights" ON student_insights;
CREATE POLICY "Users can update insights"
ON student_insights FOR UPDATE
USING (
  (family_id IS NOT NULL AND is_family_member(auth.uid(), family_id)) OR
  (organization_id IS NOT NULL AND is_organization_member(auth.uid(), organization_id))
);

DROP POLICY IF EXISTS "Family members can delete insights" ON student_insights;
CREATE POLICY "Users can delete insights"
ON student_insights FOR DELETE
USING (
  (family_id IS NOT NULL AND is_family_owner(auth.uid(), family_id)) OR
  (organization_id IS NOT NULL AND is_organization_admin(auth.uid(), organization_id))
);

-- 7. Update RLS policies for family_data_embeddings (B2B access)
DROP POLICY IF EXISTS "Family members can view their embeddings" ON family_data_embeddings;
CREATE POLICY "Users can view embeddings"
ON family_data_embeddings FOR SELECT
USING (
  (family_id IS NOT NULL AND is_family_member(auth.uid(), family_id)) OR
  (organization_id IS NOT NULL AND is_organization_member(auth.uid(), organization_id))
);

DROP POLICY IF EXISTS "Family members can insert their embeddings" ON family_data_embeddings;
CREATE POLICY "Users can insert embeddings"
ON family_data_embeddings FOR INSERT
WITH CHECK (
  (family_id IS NOT NULL AND is_family_member(auth.uid(), family_id)) OR
  (organization_id IS NOT NULL AND is_organization_member(auth.uid(), organization_id))
);

DROP POLICY IF EXISTS "Family members can delete their embeddings" ON family_data_embeddings;
CREATE POLICY "Users can delete embeddings"
ON family_data_embeddings FOR DELETE
USING (
  (family_id IS NOT NULL AND is_family_owner(auth.uid(), family_id)) OR
  (organization_id IS NOT NULL AND is_organization_admin(auth.uid(), organization_id))
);

-- 8. Update RLS policies for embedding_queue (B2B access)
DROP POLICY IF EXISTS "Users can view their family's embedding queue" ON embedding_queue;
CREATE POLICY "Users can view embedding queue"
ON embedding_queue FOR SELECT
USING (
  (family_id IS NOT NULL AND family_id IN (
    SELECT family_id FROM family_members WHERE user_id = auth.uid()
  )) OR
  (organization_id IS NOT NULL AND is_organization_member(auth.uid(), organization_id))
);

-- ============================================================================
-- VERIFICATION
-- ============================================================================
COMMENT ON COLUMN bedrock_documents.organization_id IS 'Organization that owns this document (B2B). Mutually exclusive with family_id.';
COMMENT ON COLUMN student_insights.organization_id IS 'Organization that owns this insight (B2B). Mutually exclusive with family_id.';
COMMENT ON COLUMN family_data_embeddings.organization_id IS 'Organization that owns this embedding (B2B). Mutually exclusive with family_id.';
COMMENT ON COLUMN embedding_queue.organization_id IS 'Organization for this queue item (B2B). Mutually exclusive with family_id.';