
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface ProgressUpdate {
  type: 'module_complete' | 'course_complete' | 'progress_update';
  moduleId?: string;
  completionPercentage?: number;
  completed?: boolean;
  completedAt?: string;
  timestamp?: string;
}

interface CourseProgress {
  completed: boolean;
  current_module: string | null;
  completion_percentage: number;
  completed_modules: string[];
  completed_at?: string;
}

export function useProgressTracking(courseId: string) {
  const [currentProgress, setCurrentProgress] = useState<CourseProgress>({
    completed: false,
    current_module: null,
    completion_percentage: 0,
    completed_modules: []
  });
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  // Fetch current progress on mount
  useEffect(() => {
    async function fetchProgress() {
      if (!user?.id) {
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('enrollments')
          .select('progress')
          .eq('user_id', user.id)
          .eq('course_id', courseId)
          .single();

        if (error) {
          console.error('Error fetching progress:', error);
          return;
        }

        if (data?.progress) {
          setCurrentProgress(data.progress as CourseProgress);
        }
      } catch (error) {
        console.error('Error in fetchProgress:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchProgress();
  }, [user?.id, courseId]);

  const updateProgress = async (update: ProgressUpdate) => {
    if (!user?.id) return;

    try {
      let newProgress = { ...currentProgress };

      switch (update.type) {
        case 'module_complete':
          if (update.moduleId && !newProgress.completed_modules.includes(update.moduleId)) {
            newProgress.completed_modules = [...newProgress.completed_modules, update.moduleId];
            newProgress.current_module = update.moduleId;
          }
          break;

        case 'course_complete':
          newProgress.completed = true;
          newProgress.completion_percentage = 100;
          if (update.completedAt) {
            newProgress.completed_at = update.completedAt;
          }
          break;

        case 'progress_update':
          if (update.completionPercentage !== undefined) {
            newProgress.completion_percentage = update.completionPercentage;
          }
          break;
      }

      // Update in database
      const { error } = await supabase
        .from('enrollments')
        .update({ progress: newProgress })
        .eq('user_id', user.id)
        .eq('course_id', courseId);

      if (error) {
        console.error('Error updating progress:', error);
        throw error;
      }

      // Update local state
      setCurrentProgress(newProgress);
      console.log('Progress updated successfully:', newProgress);

    } catch (error) {
      console.error('Failed to update progress:', error);
      throw error;
    }
  };

  return {
    currentProgress,
    updateProgress,
    loading
  };
}
