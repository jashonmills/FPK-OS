-- Phase 1: Backfill incident_logs from document_metrics (Synthetic Daily Logs)

-- Extract behavioral incidents from document_metrics into incident_logs
INSERT INTO public.incident_logs (
  family_id, student_id, incident_date, incident_time, incident_type,
  behavior_description, antecedent, consequence, location, duration_minutes,
  severity, intervention_used, created_by, reporter_name, reporter_role
)
SELECT DISTINCT
  dm.family_id,
  dm.student_id,
  dm.measurement_date as incident_date,
  COALESCE(dm.start_time, '00:00') as incident_time,
  CASE 
    WHEN dm.metric_name ILIKE '%aggression%' OR dm.metric_name ILIKE '%hitting%' THEN 'physical_aggression'
    WHEN dm.metric_name ILIKE '%elopement%' OR dm.metric_name ILIKE '%running%' THEN 'elopement'
    WHEN dm.metric_name ILIKE '%self-injury%' OR dm.metric_name ILIKE '%biting%' THEN 'self_injury'
    WHEN dm.metric_name ILIKE '%tantrum%' OR dm.metric_name ILIKE '%meltdown%' THEN 'tantrum'
    WHEN dm.metric_name ILIKE '%refusal%' OR dm.metric_name ILIKE '%non-compliance%' THEN 'non_compliance'
    ELSE 'other'
  END as incident_type,
  dm.metric_name as behavior_description,
  dm.context as antecedent,
  'Extracted from ' || COALESCE(d.category, 'document') || ' analysis' as consequence,
  COALESCE(d.category, 'Not specified') as location,
  COALESCE(dm.duration_minutes, 0) as duration_minutes,
  CASE 
    WHEN dm.metric_value >= 7 OR dm.metric_value = 0 THEN 'mild'
    WHEN dm.metric_value >= 4 THEN 'moderate'
    ELSE 'severe'
  END as severity,
  dm.intervention_used,
  f.created_by as created_by,
  'System (Document Analysis)' as reporter_name,
  'automated' as reporter_role
FROM public.document_metrics dm
JOIN public.documents d ON dm.document_id = d.id
JOIN public.families f ON dm.family_id = f.id
WHERE dm.metric_type IN ('behavioral_incident', 'behavior_frequency')
  AND dm.measurement_date IS NOT NULL
  AND NOT EXISTS (
    SELECT 1 FROM public.incident_logs il 
    WHERE il.family_id = dm.family_id 
      AND il.student_id = dm.student_id 
      AND il.incident_date = dm.measurement_date
      AND il.behavior_description = dm.metric_name
  )
ORDER BY dm.measurement_date;

-- Add comment to track synthetic data
COMMENT ON TABLE public.incident_logs IS 'Contains both manual daily logs and synthetic logs extracted from historical documents';