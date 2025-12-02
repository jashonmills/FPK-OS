
import { useCallback } from 'react';
import { useNotifications } from './useNotifications';
import { supabase } from '@/integrations/supabase/client';

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

  // Notify educators when a student starts a course
  const notifyEducatorsOfCourseStart = useCallback(async (
    orgId: string,
    studentId: string,
    studentName: string,
    courseId: string,
    courseTitle: string
  ) => {
    try {
      const client = supabase as any;
      const { data: educators, error } = await client
        .from('org_members')
        .select('user_id, role')
        .eq('organization_id', orgId);

      if (error || !educators) return;

      const educatorList = educators.filter((m: { role: string }) => 
        ['owner', 'admin', 'instructor'].includes(m.role)
      );

      for (const educator of educatorList) {
        await supabase.functions.invoke('notification-system', {
          body: {
            type: 'student_course_started',
            userId: educator.user_id,
            data: { studentId, studentName, courseId, courseTitle, orgId }
          }
        });
      }
    } catch (error) {
      console.error('Error notifying educators of course start:', error);
    }
  }, []);

  // Notify educators when a student completes a lesson
  const notifyEducatorsOfLessonComplete = useCallback(async (
    orgId: string,
    studentId: string,
    studentName: string,
    courseId: string,
    courseTitle: string,
    lessonId: string,
    lessonTitle: string
  ) => {
    try {
      const client = supabase as any;
      const { data: educators, error } = await client
        .from('org_members')
        .select('user_id, role')
        .eq('organization_id', orgId);

      if (error || !educators) return;

      const educatorList = educators.filter((m: { role: string }) => 
        ['owner', 'admin', 'instructor'].includes(m.role)
      );

      for (const educator of educatorList) {
        await supabase.functions.invoke('notification-system', {
          body: {
            type: 'student_lesson_completed',
            userId: educator.user_id,
            data: { studentId, studentName, courseId, courseTitle, lessonId, lessonTitle, orgId }
          }
        });
      }
    } catch (error) {
      console.error('Error notifying educators of lesson complete:', error);
    }
  }, []);

  // Notify educators when a student completes a course
  const notifyEducatorsOfCourseComplete = useCallback(async (
    orgId: string,
    studentId: string,
    studentName: string,
    courseId: string,
    courseTitle: string
  ) => {
    try {
      const client = supabase as any;
      const { data: educators, error } = await client
        .from('org_members')
        .select('user_id, role')
        .eq('organization_id', orgId);

      if (error || !educators) return;

      const educatorList = educators.filter((m: { role: string }) => 
        ['owner', 'admin', 'instructor'].includes(m.role)
      );

      for (const educator of educatorList) {
        await supabase.functions.invoke('notification-system', {
          body: {
            type: 'student_course_completed',
            userId: educator.user_id,
            data: { studentId, studentName, courseId, courseTitle, orgId }
          }
        });
      }
    } catch (error) {
      console.error('Error notifying educators of course completion:', error);
    }
  }, []);

  // Notify educators when a student completes a goal
  const notifyEducatorsOfGoalComplete = useCallback(async (
    orgId: string,
    studentId: string,
    studentName: string,
    goalId: string,
    goalTitle: string
  ) => {
    try {
      const client = supabase as any;
      const { data: educators, error } = await client
        .from('org_members')
        .select('user_id, role')
        .eq('organization_id', orgId);

      if (error || !educators) return;

      const educatorList = educators.filter((m: { role: string }) => 
        ['owner', 'admin', 'instructor'].includes(m.role)
      );

      for (const educator of educatorList) {
        await supabase.functions.invoke('notification-system', {
          body: {
            type: 'student_goal_completed',
            userId: educator.user_id,
            data: { studentId, studentName, goalId, goalTitle, orgId }
          }
        });
      }
    } catch (error) {
      console.error('Error notifying educators of goal completion:', error);
    }
  }, []);

  return {
    triggerGoalCompletion,
    triggerStudyStreak,
    triggerAchievement,
    triggerCourseReminder,
    triggerAIInsight,
    notifyEducatorsOfCourseStart,
    notifyEducatorsOfLessonComplete,
    notifyEducatorsOfCourseComplete,
    notifyEducatorsOfGoalComplete
  };
};
