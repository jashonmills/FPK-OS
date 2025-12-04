-- Phase 1: Add metadata column to org_assignments table
-- This column stores educator instructions, due dates, and assignment configuration

ALTER TABLE org_assignments 
ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}'::jsonb;

-- Add comment for documentation
COMMENT ON COLUMN org_assignments.metadata IS 'Stores educator instructions, due dates, and assignment configuration';

-- Create index for metadata queries (performance optimization)
CREATE INDEX IF NOT EXISTS idx_org_assignments_metadata 
ON org_assignments USING gin (metadata);