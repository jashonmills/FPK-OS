-- Add focus_area column to document_reports table
ALTER TABLE document_reports 
ADD COLUMN IF NOT EXISTS focus_area TEXT DEFAULT 'comprehensive';

-- Add comment for documentation
COMMENT ON COLUMN document_reports.focus_area IS 'Assessment focus area: comprehensive, behavioral, skill, intervention, sensory, environmental';

-- Create index for faster filtering by focus area
CREATE INDEX IF NOT EXISTS idx_document_reports_focus_area 
ON document_reports(focus_area);