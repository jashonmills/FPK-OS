
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useXPSystem } from '@/hooks/useXPSystem';
import { useAnalyticsEventBus } from '@/hooks/useAnalyticsEventBus';

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
  const { awardXP, calculateModuleXP, calculateProgressXP } = useXPSystem();
  const { publishEvent } = useAnalyticsEventBus();

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
          // Safely handle the Json type conversion
          const progressData = data.progress as unknown as CourseProgress;
          setCurrentProgress(progressData);
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
      let xpAwarded = false;

      switch (update.type) {
        case 'module_complete':
          if (update.moduleId && !newProgress.completed_modules.includes(update.moduleId)) {
            newProgress.completed_modules = [...newProgress.completed_modules, update.moduleId];
            newProgress.current_module = update.moduleId;
            
            // Award XP for module completion
            const moduleXP = calculateModuleXP(update.moduleId);
            await awardXP(moduleXP, `Completed ${update.moduleId.replace('-', ' ')}`);
            xpAwarded = true;
            
            // Track analytics event
            await publishEvent('module_completed', {
              moduleId: update.moduleId,
              courseId,
              timestamp: update.timestamp || new Date().toISOString(),
              xpAwarded: moduleXP
            });
          }
          break;

        case 'course_complete':
          newProgress.completed = true;
          newProgress.completion_percentage = 100;
          if (update.completedAt) {
            newProgress.completed_at = update.completedAt;
          }
          
          // Award course completion XP
          if (!currentProgress.completed) {
            await awardXP(200, 'Completed Learning State Course!');
            xpAwarded = true;
            
            // Track analytics event
            await publishEvent('course_completed', {
              courseId,
              completedAt: update.completedAt || new Date().toISOString(),
              xpAwarded: 200
            });
          }
          break;

        case 'progress_update':
          if (update.completionPercentage !== undefined) {
            const oldPercentage = newProgress.completion_percentage;
            newProgress.completion_percentage = update.completionPercentage;
            
            // Award XP for milestone progress
            const progressXP = calculateProgressXP(update.completionPercentage);
            const oldProgressXP = calculateProgressXP(oldPercentage);
            
            if (progressXP > oldProgressXP) {
              await awardXP(progressXP - oldProgressXP, `Reached ${update.completionPercentage}% progress`);
              xpAwarded = true;
            }
            
            // Track analytics event
            await publishEvent('progress_updated', {
              courseId,
              oldProgress: oldPercentage,
              newProgress: update.completionPercentage,
              progressDelta: update.completionPercentage - oldPercentage,
              timestamp: update.timestamp || new Date().toISOString()
            });
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

      if (xpAwarded) {
        // Trigger a brief delay to allow XP toast to show
        setTimeout(() => {
          window.dispatchEvent(new CustomEvent('progressUpdated', { detail: newProgress }));
        }, 1000);
      } else {
        window.dispatchEvent(new CustomEvent('progressUpdated', { detail: newProgress }));
      }

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
