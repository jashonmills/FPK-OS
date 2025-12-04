-- Phase 1: Backfill NULL measurement_dates with document upload dates
UPDATE document_metrics dm
SET measurement_date = d.created_at::date
FROM documents d
WHERE dm.document_id = d.id
  AND dm.measurement_date IS NULL;

-- Phase 2: Add default value and constraint to prevent future NULL dates
ALTER TABLE document_metrics
ALTER COLUMN measurement_date SET DEFAULT CURRENT_DATE;

-- Phase 3: Add reasonable date validation
ALTER TABLE document_metrics
ADD CONSTRAINT reasonable_measurement_date
CHECK (
  measurement_date IS NULL OR 
  (measurement_date >= '2020-01-01' AND measurement_date <= CURRENT_DATE + INTERVAL '1 year')
);

-- Phase 4: Create data quality diagnostic view for admins
CREATE OR REPLACE VIEW admin_metrics_quality AS
SELECT 
  s.student_name,
  f.family_name,
  dm.metric_type,
  COUNT(*) FILTER (WHERE dm.measurement_date IS NULL) as null_dates,
  COUNT(*) as total_metrics,
  ROUND(100.0 * COUNT(*) FILTER (WHERE dm.measurement_date IS NULL) / NULLIF(COUNT(*), 0), 1) as null_percentage,
  MIN(dm.measurement_date) as earliest_date,
  MAX(dm.measurement_date) as latest_date
FROM document_metrics dm
JOIN students s ON dm.student_id = s.id
JOIN families f ON dm.family_id = f.id
GROUP BY s.student_name, f.family_name, dm.metric_type
ORDER BY null_percentage DESC NULLS LAST, total_metrics DESC;