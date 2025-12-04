-- Fix the SCO launch_href to point to actual content files instead of manifest
UPDATE public.scorm_scos 
SET launch_href = CASE 
  WHEN package_id = '4e684870-2b0a-495d-86c9-cf05b0af241f' THEN 'packages/4e684870-2b0a-495d-86c9-cf05b0af241f/content/index.html'
  ELSE launch_href
END
WHERE package_id = '4e684870-2b0a-495d-86c9-cf05b0af241f'
  AND launch_href LIKE '%imsmanifest.xml';