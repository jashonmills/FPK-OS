-- Create user chart layouts table for persisting custom dashboard configurations
CREATE TABLE IF NOT EXISTS user_chart_layouts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  family_id UUID NOT NULL REFERENCES families(id) ON DELETE CASCADE,
  student_id UUID REFERENCES students(id) ON DELETE CASCADE,
  tab_id TEXT NOT NULL,
  layout JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create unique constraint on family, student, and tab combination
CREATE UNIQUE INDEX idx_chart_layouts_unique 
  ON user_chart_layouts(family_id, tab_id, COALESCE(student_id, '00000000-0000-0000-0000-000000000000'::uuid));

-- Enable RLS
ALTER TABLE user_chart_layouts ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Family members can view their chart layouts"
  ON user_chart_layouts FOR SELECT
  USING (is_family_member(auth.uid(), family_id));

CREATE POLICY "Family members can insert their chart layouts"
  ON user_chart_layouts FOR INSERT
  WITH CHECK (is_family_member(auth.uid(), family_id));

CREATE POLICY "Family members can update their chart layouts"
  ON user_chart_layouts FOR UPDATE
  USING (is_family_member(auth.uid(), family_id));

CREATE POLICY "Family members can delete their chart layouts"
  ON user_chart_layouts FOR DELETE
  USING (is_family_member(auth.uid(), family_id));

-- Indexes for performance
CREATE INDEX idx_chart_layouts_family ON user_chart_layouts(family_id);
CREATE INDEX idx_chart_layouts_student ON user_chart_layouts(student_id);
CREATE INDEX idx_chart_layouts_tab ON user_chart_layouts(tab_id);

-- RPC function to save layout
CREATE OR REPLACE FUNCTION save_chart_layout(
  p_family_id UUID,
  p_student_id UUID,
  p_tab_id TEXT,
  p_layout JSONB
) RETURNS VOID 
LANGUAGE plpgsql 
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO user_chart_layouts (family_id, student_id, tab_id, layout)
  VALUES (p_family_id, p_student_id, p_tab_id, p_layout)
  ON CONFLICT ON CONSTRAINT idx_chart_layouts_unique
  DO UPDATE SET 
    layout = p_layout, 
    updated_at = now();
END;
$$;

-- RPC function to get layout
CREATE OR REPLACE FUNCTION get_chart_layout(
  p_family_id UUID,
  p_student_id UUID,
  p_tab_id TEXT
) RETURNS JSONB 
LANGUAGE sql 
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT layout FROM user_chart_layouts
  WHERE family_id = p_family_id
    AND (student_id = p_student_id OR (student_id IS NULL AND p_student_id IS NULL))
    AND tab_id = p_tab_id
  LIMIT 1;
$$;