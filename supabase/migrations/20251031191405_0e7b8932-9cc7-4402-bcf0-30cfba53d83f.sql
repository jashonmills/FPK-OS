-- Create team_discussions table for unified communication across the platform
CREATE TABLE public.team_discussions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  family_id UUID NOT NULL REFERENCES public.families(id) ON DELETE CASCADE,
  
  -- Polymorphic relationship fields to link to any entity
  entity_type TEXT NOT NULL,
  entity_id UUID NOT NULL,
  
  -- Comment metadata
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  parent_id UUID REFERENCES public.team_discussions(id) ON DELETE CASCADE,
  
  -- Mentions and notifications
  mentioned_user_ids UUID[] DEFAULT '{}',
  is_pinned BOOLEAN DEFAULT FALSE,
  
  -- Attachments stored as JSON array
  attachments JSONB DEFAULT '[]'::jsonb,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  edited_at TIMESTAMPTZ,
  
  -- Soft delete support
  deleted_at TIMESTAMPTZ,
  
  -- Constraint to ensure valid entity types
  CONSTRAINT valid_entity_type CHECK (entity_type IN (
    'goal', 'document', 'incident_log', 'educator_log', 
    'parent_log', 'assessment', 'chart', 'student', 'dashboard'
  ))
);

-- Create indexes for optimal query performance
CREATE INDEX idx_team_discussions_entity ON public.team_discussions(entity_type, entity_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_team_discussions_family ON public.team_discussions(family_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_team_discussions_mentions ON public.team_discussions USING GIN(mentioned_user_ids);
CREATE INDEX idx_team_discussions_created ON public.team_discussions(created_at DESC);
CREATE INDEX idx_team_discussions_parent ON public.team_discussions(parent_id) WHERE parent_id IS NOT NULL;

-- Enable Row Level Security
ALTER TABLE public.team_discussions ENABLE ROW LEVEL SECURITY;

-- RLS Policy: All family members can view discussions
CREATE POLICY "Family members can view discussions"
  ON public.team_discussions FOR SELECT
  USING (is_family_member(auth.uid(), family_id) AND deleted_at IS NULL);

-- RLS Policy: Owners and Contributors can create comments
CREATE POLICY "Owners and contributors can create comments"
  ON public.team_discussions FOR INSERT
  WITH CHECK (
    get_user_family_role(family_id) IN ('owner', 'contributor')
    AND user_id = auth.uid()
  );

-- RLS Policy: Users can update their own comments
CREATE POLICY "Users can update own comments"
  ON public.team_discussions FOR UPDATE
  USING (user_id = auth.uid() AND deleted_at IS NULL)
  WITH CHECK (user_id = auth.uid());

-- RLS Policy: Users can soft-delete their own comments, owners can delete any
CREATE POLICY "Users can delete own comments, owners can delete any"
  ON public.team_discussions FOR UPDATE
  USING (
    (user_id = auth.uid() OR get_user_family_role(family_id) = 'owner')
    AND deleted_at IS NULL
  )
  WITH CHECK (deleted_at IS NOT NULL);

-- Create discussion_read_status table for tracking read/unread state
CREATE TABLE public.discussion_read_status (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  discussion_id UUID NOT NULL REFERENCES public.team_discussions(id) ON DELETE CASCADE,
  read_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  
  UNIQUE(user_id, discussion_id)
);

-- Index for efficient read status queries
CREATE INDEX idx_read_status_user ON public.discussion_read_status(user_id);
CREATE INDEX idx_read_status_discussion ON public.discussion_read_status(discussion_id);

-- Enable RLS on read status table
ALTER TABLE public.discussion_read_status ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Users can view their own read status
CREATE POLICY "Users can view own read status"
  ON public.discussion_read_status FOR SELECT
  USING (user_id = auth.uid());

-- RLS Policy: Users can insert their own read status
CREATE POLICY "Users can insert own read status"
  ON public.discussion_read_status FOR INSERT
  WITH CHECK (user_id = auth.uid());

-- RLS Policy: Users can update their own read status
CREATE POLICY "Users can update own read status"
  ON public.discussion_read_status FOR UPDATE
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_team_discussions_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_team_discussions_timestamp
  BEFORE UPDATE ON public.team_discussions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_team_discussions_updated_at();