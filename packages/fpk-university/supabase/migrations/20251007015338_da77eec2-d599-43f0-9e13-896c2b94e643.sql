-- Create org_note_replies table for threaded conversations
CREATE TABLE public.org_note_replies (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  note_id UUID NOT NULL REFERENCES public.org_notes(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  read_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.org_note_replies ENABLE ROW LEVEL SECURITY;

-- Users can view replies to notes they have access to
CREATE POLICY "Users can view note replies"
ON public.org_note_replies
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.org_notes
    WHERE org_notes.id = org_note_replies.note_id
    AND (
      org_notes.created_by = auth.uid()
      OR org_notes.student_id IN (
        SELECT linked_user_id FROM public.org_students 
        WHERE linked_user_id = auth.uid()
      )
      OR EXISTS (
        SELECT 1 FROM public.org_members
        WHERE org_members.org_id = org_notes.organization_id
        AND org_members.user_id = auth.uid()
        AND org_members.status = 'active'
      )
    )
  )
);

-- Users can create replies to notes they have access to
CREATE POLICY "Users can create note replies"
ON public.org_note_replies
FOR INSERT
WITH CHECK (
  user_id = auth.uid()
  AND EXISTS (
    SELECT 1 FROM public.org_notes
    WHERE org_notes.id = org_note_replies.note_id
    AND (
      org_notes.created_by = auth.uid()
      OR org_notes.student_id IN (
        SELECT linked_user_id FROM public.org_students 
        WHERE linked_user_id = auth.uid()
      )
      OR EXISTS (
        SELECT 1 FROM public.org_members
        WHERE org_members.org_id = org_notes.organization_id
        AND org_members.user_id = auth.uid()
        AND org_members.status = 'active'
      )
    )
  )
);

-- Users can update their own replies
CREATE POLICY "Users can update own replies"
ON public.org_note_replies
FOR UPDATE
USING (user_id = auth.uid());

-- Create index for performance
CREATE INDEX idx_org_note_replies_note_id ON public.org_note_replies(note_id);
CREATE INDEX idx_org_note_replies_user_id ON public.org_note_replies(user_id);

-- Add updated_at trigger
CREATE TRIGGER update_org_note_replies_updated_at
  BEFORE UPDATE ON public.org_note_replies
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column_before();