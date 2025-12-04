-- Create table for tracking document mentions
CREATE TABLE doc_mentions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_id UUID NOT NULL REFERENCES doc_pages(id) ON DELETE CASCADE,
  entity_type TEXT NOT NULL CHECK (entity_type IN ('user', 'task', 'page', 'project', 'file')),
  entity_id UUID NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create indexes for efficient queries
CREATE INDEX idx_doc_mentions_page_id ON doc_mentions(page_id);
CREATE INDEX idx_doc_mentions_entity ON doc_mentions(entity_type, entity_id);

-- RLS policies for doc_mentions
ALTER TABLE doc_mentions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view mentions in pages they can access"
ON doc_mentions FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM doc_pages
    JOIN doc_spaces ON doc_spaces.id = doc_pages.space_id
    WHERE doc_pages.id = doc_mentions.page_id
    AND (doc_spaces.project_id IS NULL OR is_project_member(auth.uid(), doc_spaces.project_id))
  )
);

CREATE POLICY "Users can create mentions in pages they can edit"
ON doc_mentions FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM doc_pages
    JOIN doc_spaces ON doc_spaces.id = doc_pages.space_id
    WHERE doc_pages.id = doc_mentions.page_id
    AND (doc_spaces.project_id IS NULL OR is_project_member(auth.uid(), doc_spaces.project_id))
  )
);

CREATE POLICY "System can delete mentions"
ON doc_mentions FOR DELETE
USING (true);

-- Create table for bidirectional task-document links
CREATE TABLE task_document_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
  page_id UUID NOT NULL REFERENCES doc_pages(id) ON DELETE CASCADE,
  created_by UUID NOT NULL REFERENCES profiles(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(task_id, page_id)
);

-- Create index for efficient queries
CREATE INDEX idx_task_document_links_task_id ON task_document_links(task_id);
CREATE INDEX idx_task_document_links_page_id ON task_document_links(page_id);

-- RLS policies for task_document_links
ALTER TABLE task_document_links ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view task document links"
ON task_document_links FOR SELECT
USING (true);

CREATE POLICY "Users can create task document links"
ON task_document_links FOR INSERT
WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can delete their own task document links"
ON task_document_links FOR DELETE
USING (auth.uid() = created_by);