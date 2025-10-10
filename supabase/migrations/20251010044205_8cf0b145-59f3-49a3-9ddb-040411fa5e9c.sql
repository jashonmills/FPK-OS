-- Make document_id nullable in document_metrics so AI can import baseline data
ALTER TABLE public.document_metrics ALTER COLUMN document_id DROP NOT NULL;