-- Phase 2.1: Database Schema Enhancement for User-Driven Classification
-- Create ENUM type for document categories
CREATE TYPE document_category_enum AS ENUM (
    'IEP',
    'BIP',
    'FBA',
    'Progress_Report',
    'Evaluation_Report',
    '504_Plan',
    'Medical_Record',
    'Incident_Report',
    'General_Document'
);

-- Add classification tracking columns to v3_documents
ALTER TABLE v3_documents
    ADD COLUMN category_enum document_category_enum,
    ADD COLUMN is_classified BOOLEAN NOT NULL DEFAULT FALSE,
    ADD COLUMN classified_at TIMESTAMP WITH TIME ZONE,
    ADD COLUMN classified_by UUID REFERENCES auth.users(id);

-- Migrate existing category data from TEXT to ENUM
UPDATE v3_documents
SET 
    category_enum = CASE 
        WHEN LOWER(category) LIKE '%iep%' THEN 'IEP'::document_category_enum
        WHEN LOWER(category) LIKE '%bip%' THEN 'BIP'::document_category_enum
        WHEN LOWER(category) LIKE '%fba%' THEN 'FBA'::document_category_enum
        WHEN LOWER(category) LIKE '%progress%' THEN 'Progress_Report'::document_category_enum
        WHEN LOWER(category) LIKE '%evaluation%' THEN 'Evaluation_Report'::document_category_enum
        WHEN LOWER(category) LIKE '%504%' THEN '504_Plan'::document_category_enum
        WHEN LOWER(category) LIKE '%medical%' THEN 'Medical_Record'::document_category_enum
        WHEN LOWER(category) LIKE '%incident%' THEN 'Incident_Report'::document_category_enum
        ELSE 'General_Document'::document_category_enum
    END,
    is_classified = CASE 
        WHEN category IS NOT NULL AND category != 'general' THEN TRUE 
        ELSE FALSE 
    END
WHERE category IS NOT NULL;

-- Drop the old TEXT category column and rename the new ENUM column
ALTER TABLE v3_documents DROP COLUMN category;
ALTER TABLE v3_documents RENAME COLUMN category_enum TO category;

-- Create index for efficient querying of unclassified documents
CREATE INDEX idx_unclassified_docs ON v3_documents (family_id, is_classified)
WHERE is_classified = FALSE;

-- Create index for category-based queries
CREATE INDEX idx_v3_documents_category ON v3_documents (family_id, category)
WHERE is_classified = TRUE;