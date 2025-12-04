-- Make document_id nullable in document_metrics to allow AI-imported baseline data
ALTER TABLE document_metrics ALTER COLUMN document_id DROP NOT NULL;