-- Fix SCO launch URLs to match actual file structure
UPDATE scorm_scos 
SET launch_href = 'index.html' 
WHERE package_id = '5b9cf247-af05-41cc-b849-a8d86cc07b51' 
  AND identifier = 'sco-1';

UPDATE scorm_scos 
SET launch_href = 'module1/index.html' 
WHERE package_id = '5b9cf247-af05-41cc-b849-a8d86cc07b51' 
  AND identifier = 'sco-2';