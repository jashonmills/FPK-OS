import { useCallback } from 'react';
import { ga4 } from '@/utils/ga4Setup';
import { useAuth } from '@/hooks/useAuth';

export const useGoalsAnalytics = () => {
  const { user } = useAuth();

  const trackGoalCreated = useCallback((goalType: string, category?: string) => {
    ga4.trackCustomEvent('goal_created', {
      user_id: user?.id,
      goal_type: goalType,
      category: category,
      timestamp: new Date().toISOString()
    });
  }, [user?.id]);

  const trackGoalCompleted = useCallback((goalId: string, goalType: string) => {
    ga4.trackCustomEvent('goal_completed', {
      user_id: user?.id,
      goal_id: goalId,
      goal_type: goalType,
      timestamp: new Date().toISOString()
    });
  }, [user?.id]);

  const trackGoalUpdated = useCallback((goalId: string, updateType: string) => {
    ga4.trackCustomEvent('goal_updated', {
      user_id: user?.id,
      goal_id: goalId,
      update_type: updateType,
      timestamp: new Date().toISOString()
    });
  }, [user?.id]);

  const trackNoteCreated = useCallback((noteType: string, contextType?: string) => {
    ga4.trackCustomEvent('note_created', {
      user_id: user?.id,
      note_type: noteType,
      context_type: contextType,
      timestamp: new Date().toISOString()
    });
  }, [user?.id]);

  const trackContextLinked = useCallback((sourceType: string, targetType: string) => {
    ga4.trackCustomEvent('context_linked', {
      user_id: user?.id,
      source_type: sourceType,
      target_type: targetType,
      timestamp: new Date().toISOString()
    });
  }, [user?.id]);

  return {
    trackGoalCreated,
    trackGoalCompleted,
    trackGoalUpdated,
    trackNoteCreated,
    trackContextLinked
  };
};
