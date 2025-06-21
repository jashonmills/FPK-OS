
import { useEffect } from 'react';
import { useGoals } from '@/hooks/useGoals';
import { useNotificationTriggers } from '@/hooks/useNotificationTriggers';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

export const useGoalProgressTracking = () => {
  const { goals, updateGoal } = useGoals();
  const { triggerGoalCompletion } = useNotificationTriggers();
  const { user } = useAuth();

  // Auto-update reading goals based on reading sessions
  const updateReadingGoals = async () => {
    if (!user?.id) return;

    const readingGoals = goals.filter(goal => 
      goal.category === 'reading' && goal.status === 'active'
    );

    for (const goal of readingGoals) {
      try {
        // Get reading sessions for this week
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

        const { data: sessions } = await supabase
          .from('reading_sessions')
          .select('duration_seconds')
          .eq('user_id', user.id)
          .gte('session_start', oneWeekAgo.toISOString());

        const totalMinutes = (sessions || []).reduce(
          (sum, session) => sum + Math.round((session.duration_seconds || 0) / 60),
          0
        );

        // Assume goal target is minutes per week (could be customized)
        const targetMinutes = 420; // 7 hours per week default
        const newProgress = Math.min(100, Math.round((totalMinutes / targetMinutes) * 100));

        if (newProgress !== goal.progress) {
          await updateGoal(goal.id, { progress: newProgress });

          // Trigger milestone notifications
          if (newProgress >= 25 && goal.progress < 25) {
            await triggerGoalCompletion(goal.title, 25);
          } else if (newProgress >= 50 && goal.progress < 50) {
            await triggerGoalCompletion(goal.title, 50);
          } else if (newProgress >= 75 && goal.progress < 75) {
            await triggerGoalCompletion(goal.title, 75);
          } else if (newProgress >= 100 && goal.progress < 100) {
            await updateGoal(goal.id, { 
              progress: 100, 
              status: 'completed', 
              completed_at: new Date().toISOString() 
            });
            await triggerGoalCompletion(goal.title, 100);
          }
        }
      } catch (error) {
        console.error('❌ Error updating reading goal progress:', error);
      }
    }
  };

  // Auto-update study goals based on study sessions
  const updateStudyGoals = async () => {
    if (!user?.id) return;

    const studyGoals = goals.filter(goal => 
      goal.category === 'study' && goal.status === 'active'
    );

    for (const goal of studyGoals) {
      try {
        // Get study sessions for this week
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

        const { data: sessions } = await supabase
          .from('study_sessions')
          .select('session_duration_seconds, correct_answers, total_cards')
          .eq('user_id', user.id)
          .gte('created_at', oneWeekAgo.toISOString());

        if (!sessions || sessions.length === 0) continue;

        const totalHours = sessions.reduce(
          (sum, session) => sum + ((session.session_duration_seconds || 0) / 3600),
          0
        );

        const averageAccuracy = sessions.reduce(
          (sum, session) => {
            const accuracy = session.total_cards > 0 
              ? (session.correct_answers || 0) / session.total_cards 
              : 0;
            return sum + accuracy;
          },
          0
        ) / sessions.length;

        // Calculate progress based on study time and accuracy
        const targetHours = 10; // 10 hours per week default
        const timeProgress = Math.min(100, (totalHours / targetHours) * 100);
        const accuracyBonus = averageAccuracy > 0.8 ? 20 : 0;
        
        const newProgress = Math.min(100, Math.round(timeProgress + accuracyBonus));

        if (newProgress !== goal.progress) {
          await updateGoal(goal.id, { progress: newProgress });

          // Trigger milestone notifications
          if (newProgress >= 100 && goal.progress < 100) {
            await updateGoal(goal.id, { 
              progress: 100, 
              status: 'completed', 
              completed_at: new Date().toISOString() 
            });
            await triggerGoalCompletion(goal.title, 100);
          }
        }
      } catch (error) {
        console.error('❌ Error updating study goal progress:', error);
      }
    }
  };

  // Check for overdue goals
  const checkOverdueGoals = async () => {
    const today = new Date();
    const overdueGoals = goals.filter(goal => 
      goal.status === 'active' && 
      goal.target_date && 
      new Date(goal.target_date) < today
    );

    for (const goal of overdueGoals) {
      if (goal.progress >= 100) {
        await updateGoal(goal.id, { 
          status: 'completed', 
          completed_at: new Date().toISOString() 
        });
      } else {
        // Could trigger overdue notifications here
        console.log(`Goal "${goal.title}" is overdue`);
      }
    }
  };

  useEffect(() => {
    if (goals.length > 0) {
      updateReadingGoals();
      updateStudyGoals();
      checkOverdueGoals();
    }
  }, [goals.length, user?.id]);

  return {
    updateReadingGoals,
    updateStudyGoals,
    checkOverdueGoals
  };
};
