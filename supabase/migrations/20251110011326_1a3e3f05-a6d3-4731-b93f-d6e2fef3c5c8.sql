-- Add missing UPDATE policy for ai_coach_study_materials
-- This allows users to update folder_id and other fields on their own materials
CREATE POLICY "Users can update their own study materials"
  ON public.ai_coach_study_materials FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);