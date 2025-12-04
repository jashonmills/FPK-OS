-- Delete all duplicate "Logo's" folders except the newest one
DELETE FROM file_folders 
WHERE name = 'Logo''s' 
AND id != '8feb9ad6-b41b-4217-bef8-96fab8ac5d56';

-- Add foreign key constraint for project_files.uploader_id
ALTER TABLE project_files
DROP CONSTRAINT IF EXISTS project_files_uploader_id_fkey;

ALTER TABLE project_files
ADD CONSTRAINT project_files_uploader_id_fkey
FOREIGN KEY (uploader_id) REFERENCES profiles(id) ON DELETE CASCADE;

-- Add unique constraint on folder names within same parent and project
CREATE UNIQUE INDEX IF NOT EXISTS file_folders_unique_name_parent_project 
ON file_folders(name, COALESCE(parent_folder_id::text, 'root'), COALESCE(project_id::text, 'null'));