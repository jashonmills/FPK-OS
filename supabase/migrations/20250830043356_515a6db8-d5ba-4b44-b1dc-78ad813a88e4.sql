-- Create missing SCOs for existing SCORM packages that don't have any
INSERT INTO public.scorm_scos (
  package_id,
  identifier, 
  title,
  launch_href,
  mastery_score,
  is_launchable,
  seq_order
)
SELECT 
  sp.id as package_id,
  'sco_' || sp.id as identifier,
  sp.title as title,
  COALESCE(sp.manifest_path, sp.zip_path, '/index.html') as launch_href,
  80 as mastery_score,
  true as is_launchable,
  1 as seq_order
FROM scorm_packages sp
LEFT JOIN scorm_scos ss ON ss.package_id = sp.id
WHERE ss.id IS NULL 
  AND sp.status = 'ready';