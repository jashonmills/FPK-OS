
-- Phase 2: Add unique constraint to prevent duplicate family names per user

-- Create unique index on family_name per creator (case-insensitive)
CREATE UNIQUE INDEX IF NOT EXISTS idx_unique_family_name_per_creator 
ON families(created_by, LOWER(family_name));

-- Add a helpful comment
COMMENT ON INDEX idx_unique_family_name_per_creator IS 
'Prevents users from creating multiple families with the same name (case-insensitive)';
