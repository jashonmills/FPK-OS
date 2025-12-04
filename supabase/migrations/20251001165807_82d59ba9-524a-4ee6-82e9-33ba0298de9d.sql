-- Fix corrupted organization name
UPDATE organizations 
SET name = 'St. Joseph''s Mell NS'
WHERE id = '69b18aa0-a2ae-4afe-ae45-15971f74dfff';