
import { useCallback } from 'react';
import { useNotifications } from './useNotifications';

export const useNotificationTriggers = () => {
  const { createNotification } = useNotifications();

  const triggerGoalCompletion = useCallback(async (goalTitle: string, progress: number) => {
    await createNotification({
      type: 'goal_milestone',
      title: '🎯 Goal Milestone',
      message: `You've reached ${progress}% completion on "${goalTitle}". Great progress!`,
      action_url: '/dashboard/goals',
      metadata: { goalTitle, progress }
    });
  }, [createNotification]);

  const triggerStudyStreak = useCallback(async (streakDays: number) => {
    await createNotification({
      type: 'study_streak',
      title: '🔥 Study Streak!',
      message: `Amazing! You're on a ${streakDays}-day study streak. Keep it up!`,
      action_url: '/dashboard/analytics',
      metadata: { streakDays }
    });
  }, [createNotification]);

  const triggerAchievement = useCallback(async (achievementName: string) => {
    await createNotification({
      type: 'achievement_unlocked',
      title: '🏆 Achievement Unlocked!',
      message: `Congratulations! You've earned the "${achievementName}" achievement.`,
      action_url: '/dashboard/gamification',
      metadata: { achievementName }
    });
  }, [createNotification]);

  const triggerCourseReminder = useCallback(async (courseTitle: string, courseId: string) => {
    await createNotification({
      type: 'course_reminder',
      title: '📚 Time to Study',
      message: `Don't forget to continue your progress in "${courseTitle}".`,
      action_url: `/dashboard/courses/${courseId}`,
      metadata: { courseTitle, courseId }
    });
  }, [createNotification]);

  const triggerAIInsight = useCallback(async (insight: string) => {
    await createNotification({
      type: 'ai_insight',
      title: '🧠 AI Learning Insight',
      message: insight || 'Your AI coach has new personalized insights for you.',
      action_url: '/dashboard/ai-study-coach',
      metadata: { insight }
    });
  }, [createNotification]);

  return {
    triggerGoalCompletion,
    triggerStudyStreak,
    triggerAchievement,
    triggerCourseReminder,
    triggerAIInsight
  };
};
