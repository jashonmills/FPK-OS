-- Create doc_page_comments table for inline comments and discussions
CREATE TABLE IF NOT EXISTS public.doc_page_comments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  page_id UUID NOT NULL REFERENCES public.doc_pages(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  highlighted_text TEXT,
  selection_json JSONB,
  parent_comment_id UUID REFERENCES public.doc_page_comments(id) ON DELETE CASCADE,
  resolved BOOLEAN NOT NULL DEFAULT false,
  resolved_by UUID REFERENCES auth.users(id),
  resolved_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.doc_page_comments ENABLE ROW LEVEL SECURITY;

-- Users can view comments on pages they can access
CREATE POLICY "Users can view comments on accessible pages"
  ON public.doc_page_comments
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.doc_pages dp
      JOIN public.doc_spaces ds ON ds.id = dp.space_id
      WHERE dp.id = doc_page_comments.page_id
      AND has_space_access(auth.uid(), ds.id, 'viewer')
    )
  );

-- Users can create comments on pages they can at least comment on
CREATE POLICY "Users can create comments on accessible pages"
  ON public.doc_page_comments
  FOR INSERT
  WITH CHECK (
    auth.uid() = user_id
    AND EXISTS (
      SELECT 1 FROM public.doc_pages dp
      JOIN public.doc_spaces ds ON ds.id = dp.space_id
      WHERE dp.id = doc_page_comments.page_id
      AND has_space_access(auth.uid(), ds.id, 'commenter')
    )
  );

-- Users can update their own comments
CREATE POLICY "Users can update their own comments"
  ON public.doc_page_comments
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Users can delete their own comments, or admins can delete any
CREATE POLICY "Users can delete own comments or admins can delete any"
  ON public.doc_page_comments
  FOR DELETE
  USING (
    auth.uid() = user_id
    OR EXISTS (
      SELECT 1 FROM public.doc_pages dp
      JOIN public.doc_spaces ds ON ds.id = dp.space_id
      WHERE dp.id = doc_page_comments.page_id
      AND has_space_access(auth.uid(), ds.id, 'admin')
    )
  );

-- Create trigger for updated_at
CREATE TRIGGER update_doc_page_comments_updated_at
  BEFORE UPDATE ON public.doc_page_comments
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to notify mentioned users in comments
CREATE OR REPLACE FUNCTION public.process_doc_comment_mentions()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  mention_regex TEXT := '@\[([^\]]+)\]\(([a-f0-9-]{36})\)';
  mention_record RECORD;
  page_title TEXT;
BEGIN
  -- Get page title for notification context
  SELECT title INTO page_title
  FROM public.doc_pages
  WHERE id = NEW.page_id;
  
  -- Extract and process mentions
  FOR mention_record IN
    SELECT 
      (regexp_matches(NEW.content, mention_regex, 'g'))[2]::UUID AS mentioned_user_id
  LOOP
    -- Don't notify if user mentions themselves
    IF mention_record.mentioned_user_id != NEW.user_id THEN
      INSERT INTO public.notifications (
        recipient_id,
        sender_id,
        type,
        content,
        metadata
      ) VALUES (
        mention_record.mentioned_user_id,
        NEW.user_id,
        'doc_comment_mention',
        'mentioned you in a comment on "' || page_title || '"',
        jsonb_build_object(
          'comment_id', NEW.id,
          'page_id', NEW.page_id,
          'parent_comment_id', NEW.parent_comment_id
        )
      );
    END IF;
  END LOOP;
  
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_doc_comment_created
  AFTER INSERT ON public.doc_page_comments
  FOR EACH ROW
  EXECUTE FUNCTION public.process_doc_comment_mentions();

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_doc_page_comments_page_id ON public.doc_page_comments(page_id);
CREATE INDEX IF NOT EXISTS idx_doc_page_comments_user_id ON public.doc_page_comments(user_id);
CREATE INDEX IF NOT EXISTS idx_doc_page_comments_parent_id ON public.doc_page_comments(parent_comment_id);
CREATE INDEX IF NOT EXISTS idx_doc_page_comments_resolved ON public.doc_page_comments(resolved);
CREATE INDEX IF NOT EXISTS idx_doc_page_comments_created_at ON public.doc_page_comments(created_at DESC);