-- Add NITE_OWL to the persona_type enum
-- This allows Nite Owl to be stored in the coach_messages table

ALTER TYPE persona_type ADD VALUE IF NOT EXISTS 'NITE_OWL';