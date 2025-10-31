-- Create sub_tasks table
CREATE TABLE public.sub_tasks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  task_id UUID NOT NULL REFERENCES public.tasks(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  completed BOOLEAN NOT NULL DEFAULT false,
  position INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create task_comments table
CREATE TABLE public.task_comments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  task_id UUID NOT NULL REFERENCES public.tasks(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create task_labels table
CREATE TABLE public.task_labels (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  task_id UUID NOT NULL REFERENCES public.tasks(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  color TEXT NOT NULL DEFAULT '#6B7280',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create task_activity_log table
CREATE TABLE public.task_activity_log (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  task_id UUID NOT NULL REFERENCES public.tasks(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  action TEXT NOT NULL,
  details TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.sub_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.task_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.task_labels ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.task_activity_log ENABLE ROW LEVEL SECURITY;

-- RLS Policies for sub_tasks
CREATE POLICY "Authenticated users can view sub_tasks"
  ON public.sub_tasks FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create sub_tasks"
  ON public.sub_tasks FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update sub_tasks"
  ON public.sub_tasks FOR UPDATE
  USING (true);

CREATE POLICY "Authenticated users can delete sub_tasks"
  ON public.sub_tasks FOR DELETE
  USING (true);

-- RLS Policies for task_comments
CREATE POLICY "Authenticated users can view comments"
  ON public.task_comments FOR SELECT
  USING (true);

CREATE POLICY "Users can create comments"
  ON public.task_comments FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own comments"
  ON public.task_comments FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own comments"
  ON public.task_comments FOR DELETE
  USING (auth.uid() = user_id);

-- RLS Policies for task_labels
CREATE POLICY "Authenticated users can view labels"
  ON public.task_labels FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create labels"
  ON public.task_labels FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete labels"
  ON public.task_labels FOR DELETE
  USING (true);

-- RLS Policies for task_activity_log
CREATE POLICY "Authenticated users can view activity log"
  ON public.task_activity_log FOR SELECT
  USING (true);

CREATE POLICY "System can create activity log"
  ON public.task_activity_log FOR INSERT
  WITH CHECK (true);

-- Triggers for updated_at
CREATE TRIGGER update_sub_tasks_updated_at
  BEFORE UPDATE ON public.sub_tasks
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_task_comments_updated_at
  BEFORE UPDATE ON public.task_comments
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();