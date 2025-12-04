-- Drop the problematic policies
DROP POLICY IF EXISTS "Users can view folders in their projects" ON file_folders;
DROP POLICY IF EXISTS "Users can view files in accessible folders" ON project_files;
DROP POLICY IF EXISTS "Users can view file versions" ON file_versions;
DROP POLICY IF EXISTS "Users can view tag assignments for accessible files" ON file_tag_assignments;
DROP POLICY IF EXISTS "Users can view pages in accessible spaces" ON doc_pages;
DROP POLICY IF EXISTS "Users can create pages in accessible spaces" ON doc_pages;
DROP POLICY IF EXISTS "Users can update pages in accessible spaces" ON doc_pages;
DROP POLICY IF EXISTS "Users can view spaces in their projects" ON doc_spaces;

-- Create security definer function to check project membership
CREATE OR REPLACE FUNCTION public.is_project_member(_user_id uuid, _project_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.project_members
    WHERE user_id = _user_id
    AND project_id = _project_id
  )
$$;

-- Update file_folders policies
CREATE POLICY "Users can view all folders"
  ON file_folders FOR SELECT
  USING (
    project_id IS NULL OR 
    public.is_project_member(auth.uid(), project_id)
  );

-- Update project_files policies
CREATE POLICY "Users can view files"
  ON project_files FOR SELECT
  USING (
    folder_id IS NULL OR
    EXISTS (
      SELECT 1 FROM file_folders 
      WHERE file_folders.id = project_files.folder_id
      AND (
        file_folders.project_id IS NULL OR
        public.is_project_member(auth.uid(), file_folders.project_id)
      )
    )
  );

-- Update file_versions policies
CREATE POLICY "Users can view file versions"
  ON file_versions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM project_files 
      WHERE project_files.id = file_versions.file_id
      AND (
        project_files.folder_id IS NULL OR
        EXISTS (
          SELECT 1 FROM file_folders 
          WHERE file_folders.id = project_files.folder_id
          AND (
            file_folders.project_id IS NULL OR
            public.is_project_member(auth.uid(), file_folders.project_id)
          )
        )
      )
    )
  );

-- Update file_tag_assignments policies
CREATE POLICY "Users can view tag assignments"
  ON file_tag_assignments FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM project_files 
      WHERE project_files.id = file_tag_assignments.file_id
      AND (
        project_files.folder_id IS NULL OR
        EXISTS (
          SELECT 1 FROM file_folders 
          WHERE file_folders.id = project_files.folder_id
          AND (
            file_folders.project_id IS NULL OR
            public.is_project_member(auth.uid(), file_folders.project_id)
          )
        )
      )
    )
  );

-- Update doc_spaces policies
CREATE POLICY "Users can view spaces"
  ON doc_spaces FOR SELECT
  USING (
    project_id IS NULL OR 
    public.is_project_member(auth.uid(), project_id)
  );

-- Update doc_pages policies
CREATE POLICY "Users can view pages"
  ON doc_pages FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM doc_spaces 
      WHERE doc_spaces.id = doc_pages.space_id
      AND (
        doc_spaces.project_id IS NULL OR
        public.is_project_member(auth.uid(), doc_spaces.project_id)
      )
    )
  );

CREATE POLICY "Users can create pages"
  ON doc_pages FOR INSERT
  WITH CHECK (
    auth.uid() = author_id AND
    EXISTS (
      SELECT 1 FROM doc_spaces 
      WHERE doc_spaces.id = doc_pages.space_id
      AND (
        doc_spaces.project_id IS NULL OR
        public.is_project_member(auth.uid(), doc_spaces.project_id)
      )
    )
  );

CREATE POLICY "Users can update pages"
  ON doc_pages FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM doc_spaces 
      WHERE doc_spaces.id = doc_pages.space_id
      AND (
        doc_spaces.project_id IS NULL OR
        public.is_project_member(auth.uid(), doc_spaces.project_id)
      )
    )
  );