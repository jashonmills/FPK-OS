-- =====================================================
-- PHASE 1: FILE MANAGEMENT SYSTEM SCHEMA
-- =====================================================

-- 1. File folders for organizing files
CREATE TABLE file_folders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  parent_folder_id UUID REFERENCES file_folders(id) ON DELETE CASCADE,
  created_by UUID NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Project files (main file records)
CREATE TABLE project_files (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  folder_id UUID REFERENCES file_folders(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  storage_path TEXT NOT NULL,
  file_type TEXT NOT NULL,
  file_size BIGINT NOT NULL,
  uploader_id UUID NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. File versions for version control
CREATE TABLE file_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  file_id UUID REFERENCES project_files(id) ON DELETE CASCADE NOT NULL,
  storage_path TEXT NOT NULL,
  file_size BIGINT NOT NULL,
  uploader_id UUID NOT NULL,
  version_number INTEGER NOT NULL,
  version_notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. File tags for categorization
CREATE TABLE file_tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. File tag assignments (many-to-many)
CREATE TABLE file_tag_assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  file_id UUID REFERENCES project_files(id) ON DELETE CASCADE NOT NULL,
  tag_id UUID REFERENCES file_tags(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(file_id, tag_id)
);

-- Indexes for performance
CREATE INDEX idx_file_folders_project ON file_folders(project_id);
CREATE INDEX idx_file_folders_parent ON file_folders(parent_folder_id);
CREATE INDEX idx_file_folders_created_by ON file_folders(created_by);
CREATE INDEX idx_project_files_folder ON project_files(folder_id);
CREATE INDEX idx_project_files_uploader ON project_files(uploader_id);
CREATE INDEX idx_file_versions_file ON file_versions(file_id);
CREATE INDEX idx_file_tag_assignments_file ON file_tag_assignments(file_id);
CREATE INDEX idx_file_tag_assignments_tag ON file_tag_assignments(tag_id);

-- RLS Policies for file_folders
ALTER TABLE file_folders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view folders in their projects"
  ON file_folders FOR SELECT
  USING (
    project_id IS NULL OR 
    EXISTS (
      SELECT 1 FROM project_members 
      WHERE project_members.project_id = file_folders.project_id 
      AND project_members.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create folders"
  ON file_folders FOR INSERT
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update their folders"
  ON file_folders FOR UPDATE
  USING (auth.uid() = created_by);

CREATE POLICY "Users can delete their folders"
  ON file_folders FOR DELETE
  USING (auth.uid() = created_by);

-- RLS Policies for project_files
ALTER TABLE project_files ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view files in accessible folders"
  ON project_files FOR SELECT
  USING (
    folder_id IS NULL OR
    EXISTS (
      SELECT 1 FROM file_folders 
      WHERE file_folders.id = project_files.folder_id
      AND (
        file_folders.project_id IS NULL OR
        EXISTS (
          SELECT 1 FROM project_members 
          WHERE project_members.project_id = file_folders.project_id 
          AND project_members.user_id = auth.uid()
        )
      )
    )
  );

CREATE POLICY "Users can upload files"
  ON project_files FOR INSERT
  WITH CHECK (auth.uid() = uploader_id);

CREATE POLICY "Users can update their files"
  ON project_files FOR UPDATE
  USING (auth.uid() = uploader_id);

CREATE POLICY "Users can delete their files"
  ON project_files FOR DELETE
  USING (auth.uid() = uploader_id);

-- RLS Policies for file_versions
ALTER TABLE file_versions ENABLE ROW LEVEL SECURITY;

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
            EXISTS (
              SELECT 1 FROM project_members 
              WHERE project_members.project_id = file_folders.project_id 
              AND project_members.user_id = auth.uid()
            )
          )
        )
      )
    )
  );

CREATE POLICY "Users can create file versions"
  ON file_versions FOR INSERT
  WITH CHECK (auth.uid() = uploader_id);

-- RLS Policies for file_tags
ALTER TABLE file_tags ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view tags"
  ON file_tags FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create tags"
  ON file_tags FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- RLS Policies for file_tag_assignments
ALTER TABLE file_tag_assignments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view tag assignments for accessible files"
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
            EXISTS (
              SELECT 1 FROM project_members 
              WHERE project_members.project_id = file_folders.project_id 
              AND project_members.user_id = auth.uid()
            )
          )
        )
      )
    )
  );

CREATE POLICY "Users can create tag assignments for their files"
  ON file_tag_assignments FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM project_files 
      WHERE project_files.id = file_tag_assignments.file_id
      AND project_files.uploader_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete tag assignments for their files"
  ON file_tag_assignments FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM project_files 
      WHERE project_files.id = file_tag_assignments.file_id
      AND project_files.uploader_id = auth.uid()
    )
  );

-- =====================================================
-- PHASE 2: DOCUMENTATION HUB SCHEMA
-- =====================================================

-- 1. Doc spaces (containers for pages)
CREATE TABLE doc_spaces (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  icon TEXT,
  description TEXT,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  created_by UUID NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Doc pages (individual documents)
CREATE TABLE doc_pages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  space_id UUID REFERENCES doc_spaces(id) ON DELETE CASCADE NOT NULL,
  parent_page_id UUID REFERENCES doc_pages(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content JSONB NOT NULL DEFAULT '{"type":"doc","content":[]}',
  author_id UUID NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Doc page versions
CREATE TABLE doc_page_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_id UUID REFERENCES doc_pages(id) ON DELETE CASCADE NOT NULL,
  content JSONB NOT NULL,
  editor_id UUID NOT NULL,
  version_notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_doc_spaces_project ON doc_spaces(project_id);
CREATE INDEX idx_doc_spaces_created_by ON doc_spaces(created_by);
CREATE INDEX idx_doc_pages_space ON doc_pages(space_id);
CREATE INDEX idx_doc_pages_parent ON doc_pages(parent_page_id);
CREATE INDEX idx_doc_pages_author ON doc_pages(author_id);
CREATE INDEX idx_doc_page_versions_page ON doc_page_versions(page_id);

-- RLS Policies for doc_spaces
ALTER TABLE doc_spaces ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view spaces in their projects"
  ON doc_spaces FOR SELECT
  USING (
    project_id IS NULL OR 
    EXISTS (
      SELECT 1 FROM project_members 
      WHERE project_members.project_id = doc_spaces.project_id 
      AND project_members.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create spaces"
  ON doc_spaces FOR INSERT
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update spaces they created"
  ON doc_spaces FOR UPDATE
  USING (auth.uid() = created_by);

CREATE POLICY "Users can delete spaces they created"
  ON doc_spaces FOR DELETE
  USING (auth.uid() = created_by);

-- RLS Policies for doc_pages
ALTER TABLE doc_pages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view pages in accessible spaces"
  ON doc_pages FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM doc_spaces 
      WHERE doc_spaces.id = doc_pages.space_id
      AND (
        doc_spaces.project_id IS NULL OR
        EXISTS (
          SELECT 1 FROM project_members 
          WHERE project_members.project_id = doc_spaces.project_id 
          AND project_members.user_id = auth.uid()
        )
      )
    )
  );

CREATE POLICY "Users can create pages in accessible spaces"
  ON doc_pages FOR INSERT
  WITH CHECK (
    auth.uid() = author_id AND
    EXISTS (
      SELECT 1 FROM doc_spaces 
      WHERE doc_spaces.id = doc_pages.space_id
      AND (
        doc_spaces.project_id IS NULL OR
        EXISTS (
          SELECT 1 FROM project_members 
          WHERE project_members.project_id = doc_spaces.project_id 
          AND project_members.user_id = auth.uid()
        )
      )
    )
  );

CREATE POLICY "Users can update pages in accessible spaces"
  ON doc_pages FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM doc_spaces 
      WHERE doc_spaces.id = doc_pages.space_id
      AND (
        doc_spaces.project_id IS NULL OR
        EXISTS (
          SELECT 1 FROM project_members 
          WHERE project_members.project_id = doc_spaces.project_id 
          AND project_members.user_id = auth.uid()
        )
      )
    )
  );

CREATE POLICY "Users can delete their own pages"
  ON doc_pages FOR DELETE
  USING (auth.uid() = author_id);

-- RLS Policies for doc_page_versions
ALTER TABLE doc_page_versions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view page versions"
  ON doc_page_versions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM doc_pages 
      JOIN doc_spaces ON doc_spaces.id = doc_pages.space_id
      WHERE doc_pages.id = doc_page_versions.page_id
      AND (
        doc_spaces.project_id IS NULL OR
        EXISTS (
          SELECT 1 FROM project_members 
          WHERE project_members.project_id = doc_spaces.project_id 
          AND project_members.user_id = auth.uid()
        )
      )
    )
  );

CREATE POLICY "System can create page versions"
  ON doc_page_versions FOR INSERT
  WITH CHECK (true);

-- Trigger for auto-versioning doc pages
CREATE OR REPLACE FUNCTION auto_version_doc_page()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'UPDATE' AND OLD.content IS DISTINCT FROM NEW.content THEN
    INSERT INTO doc_page_versions (page_id, content, editor_id)
    VALUES (NEW.id, NEW.content, auth.uid());
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER trigger_auto_version_doc_page
  AFTER UPDATE ON doc_pages
  FOR EACH ROW
  EXECUTE FUNCTION auto_version_doc_page();

-- =====================================================
-- PHASE 3: STORAGE BUCKETS
-- =====================================================

-- Create project-files storage bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('project-files', 'project-files', false);

-- Storage RLS Policies
CREATE POLICY "Users can upload files"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'project-files');

CREATE POLICY "Users can view files"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'project-files');

CREATE POLICY "Users can update their own files"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'project-files' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own files"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'project-files' AND auth.uid()::text = (storage.foldername(name))[1]);