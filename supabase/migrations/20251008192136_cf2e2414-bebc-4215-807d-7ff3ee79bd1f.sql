-- Phase 1: Question/Answer Analytics Table
CREATE TABLE IF NOT EXISTS public.question_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  course_id TEXT NOT NULL,
  lesson_id INTEGER NOT NULL,
  question_id TEXT NOT NULL,
  question_text TEXT NOT NULL,
  answer_given TEXT NOT NULL,
  correct_answer TEXT,
  is_correct BOOLEAN NOT NULL DEFAULT false,
  time_spent_seconds INTEGER DEFAULT 0,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.question_responses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can insert their own question responses"
  ON public.question_responses FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own question responses"
  ON public.question_responses FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all question responses"
  ON public.question_responses FOR SELECT
  TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Org members can view org question responses"
  ON public.question_responses FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM org_members om
      WHERE om.user_id = auth.uid()
        AND om.status = 'active'
        AND om.role IN ('owner', 'instructor')
    )
  );

CREATE INDEX idx_question_responses_user_id ON public.question_responses(user_id);
CREATE INDEX idx_question_responses_course_id ON public.question_responses(course_id);
CREATE INDEX idx_question_responses_created_at ON public.question_responses(created_at);

-- Phase 2: Enhanced Organization Analytics RPC
CREATE OR REPLACE FUNCTION public.get_organization_analytics(p_org_id UUID)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  result JSONB;
  v_total_students INTEGER;
  v_active_students INTEGER;
  v_courses_completed INTEGER;
  v_avg_progress NUMERIC;
  v_total_learning_hours NUMERIC;
  v_goals_completed INTEGER;
  v_group_count INTEGER;
  v_notes_count INTEGER;
BEGIN
  SELECT COUNT(DISTINCT user_id) INTO v_total_students
  FROM org_members
  WHERE org_id = p_org_id AND status = 'active';

  SELECT COUNT(DISTINCT user_id) INTO v_active_students
  FROM activity_log
  WHERE org_id = p_org_id 
    AND created_at >= now() - interval '7 days';

  SELECT COUNT(*) INTO v_courses_completed
  FROM interactive_course_enrollments ice
  JOIN org_members om ON om.user_id = ice.user_id
  WHERE om.org_id = p_org_id 
    AND om.status = 'active'
    AND ice.completed_at IS NOT NULL;

  SELECT COALESCE(AVG(completion_percentage), 0) INTO v_avg_progress
  FROM interactive_course_enrollments ice
  JOIN org_members om ON om.user_id = ice.user_id
  WHERE om.org_id = p_org_id AND om.status = 'active';

  SELECT COALESCE(SUM(total_time_spent_minutes) / 60.0, 0) INTO v_total_learning_hours
  FROM interactive_course_enrollments ice
  JOIN org_members om ON om.user_id = ice.user_id
  WHERE om.org_id = p_org_id AND om.status = 'active';

  SELECT COUNT(*) INTO v_goals_completed
  FROM org_goals
  WHERE organization_id = p_org_id AND status = 'completed';

  SELECT COUNT(*) INTO v_group_count
  FROM org_groups
  WHERE org_id = p_org_id;

  SELECT COUNT(*) INTO v_notes_count
  FROM org_notes
  WHERE org_id = p_org_id;

  result := jsonb_build_object(
    'totalStudents', v_total_students,
    'activeStudents', v_active_students,
    'coursesCompleted', v_courses_completed,
    'averageProgress', ROUND(v_avg_progress, 2),
    'totalLearningHours', ROUND(v_total_learning_hours, 2),
    'goalsCompleted', v_goals_completed,
    'groupCount', v_group_count,
    'notesCount', v_notes_count,
    'recentActivity', (
      SELECT COALESCE(jsonb_agg(
        jsonb_build_object(
          'id', al.id,
          'event', al.event,
          'user_id', al.user_id,
          'created_at', al.created_at,
          'metadata', al.metadata
        ) ORDER BY al.created_at DESC
      ), '[]'::jsonb)
      FROM activity_log al
      WHERE al.org_id = p_org_id
      LIMIT 10
    ),
    'topPerformers', (
      SELECT COALESCE(jsonb_agg(
        jsonb_build_object(
          'user_id', om.user_id,
          'full_name', p.full_name,
          'email', p.email,
          'courses_completed', (
            SELECT COUNT(*) 
            FROM interactive_course_enrollments ice2
            WHERE ice2.user_id = om.user_id 
              AND ice2.completed_at IS NOT NULL
          ),
          'avg_progress', (
            SELECT COALESCE(AVG(ice3.completion_percentage), 0)
            FROM interactive_course_enrollments ice3
            WHERE ice3.user_id = om.user_id
          ),
          'total_time_hours', (
            SELECT COALESCE(SUM(ice4.total_time_spent_minutes) / 60.0, 0)
            FROM interactive_course_enrollments ice4
            WHERE ice4.user_id = om.user_id
          )
        ) ORDER BY (
          SELECT COUNT(*) 
          FROM interactive_course_enrollments ice5
          WHERE ice5.user_id = om.user_id 
            AND ice5.completed_at IS NOT NULL
        ) DESC
      ), '[]'::jsonb)
      FROM org_members om
      LEFT JOIN profiles p ON p.id = om.user_id
      WHERE om.org_id = p_org_id 
        AND om.status = 'active'
      LIMIT 5
    )
  );

  RETURN result;
END;
$$;

-- Phase 5: Goal Progress History Table
CREATE TABLE IF NOT EXISTS public.goal_progress_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  goal_id UUID NOT NULL REFERENCES org_goals(id) ON DELETE CASCADE,
  old_progress INTEGER NOT NULL,
  new_progress INTEGER NOT NULL,
  trigger_type TEXT NOT NULL,
  trigger_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.goal_progress_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own goal progress history"
  ON public.goal_progress_history FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM org_goals og
      WHERE og.id = goal_progress_history.goal_id
        AND og.student_id = auth.uid()
    )
  );

CREATE POLICY "Org members can view org goal progress history"
  ON public.goal_progress_history FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM org_goals og
      WHERE og.id = goal_progress_history.goal_id
        AND EXISTS (
          SELECT 1 FROM org_members om
          WHERE om.org_id = og.organization_id
            AND om.user_id = auth.uid()
            AND om.status = 'active'
        )
    )
  );

-- Trigger for goal progress automation
CREATE OR REPLACE FUNCTION public.update_goal_progress_on_completion()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  related_goal RECORD;
BEGIN
  IF NEW.completion_percentage >= 100 AND (OLD.completion_percentage IS NULL OR OLD.completion_percentage < 100) THEN
    FOR related_goal IN
      SELECT * FROM org_goals
      WHERE student_id = NEW.user_id
        AND status = 'active'
        AND metadata->>'related_course_id' = NEW.course_id
    LOOP
      UPDATE org_goals
      SET 
        progress_percentage = LEAST(progress_percentage + 10, 100),
        updated_at = now(),
        status = CASE 
          WHEN progress_percentage + 10 >= 100 THEN 'completed'
          ELSE status
        END
      WHERE id = related_goal.id;

      INSERT INTO goal_progress_history (
        goal_id, old_progress, new_progress, trigger_type, trigger_id
      ) VALUES (
        related_goal.id, 
        related_goal.progress_percentage, 
        LEAST(related_goal.progress_percentage + 10, 100),
        'course_completion',
        NEW.course_id
      );
    END LOOP;
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trigger_update_goal_progress ON public.interactive_course_enrollments;
CREATE TRIGGER trigger_update_goal_progress
  AFTER UPDATE ON public.interactive_course_enrollments
  FOR EACH ROW
  EXECUTE FUNCTION update_goal_progress_on_completion();

-- Phase 6: Data Sync Trigger
CREATE OR REPLACE FUNCTION public.sync_enrollment_progress()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE enrollments
  SET 
    progress = NEW.completion_percentage,
    updated_at = now()
  WHERE user_id = NEW.user_id 
    AND course_id = NEW.course_id;
  
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trigger_sync_enrollment_progress ON public.interactive_course_enrollments;
CREATE TRIGGER trigger_sync_enrollment_progress
  AFTER UPDATE ON public.interactive_course_enrollments
  FOR EACH ROW
  EXECUTE FUNCTION sync_enrollment_progress();