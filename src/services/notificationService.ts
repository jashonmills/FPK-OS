import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useAnalyticsPublisher } from '@/hooks/useAnalyticsEventBus';

interface NotificationData {
  userId?: string;
  title: string;
  message: string;
  type: 'deadline_reminder' | 'progress_nudge' | 'achievement' | 'weekly_review' | 'goal_completed';
  actionUrl?: string;
  metadata?: Record<string, any>;
}

export class NotificationService {
  static async sendNotification(data: NotificationData) {
    try {
      const { data: notification, error } = await supabase
        .from('notifications')
        .insert({
          user_id: data.userId,
          title: data.title,
          message: data.message,
          type: data.type,
          action_url: data.actionUrl,
          metadata: data.metadata || {},
          read_status: false
        })
        .select()
        .single();

      if (error) throw error;
      return notification;
    } catch (error) {
      console.error('Error sending notification:', error);
      throw error;
    }
  }

  static async sendGoalCompletionNotification(userId: string, goalTitle: string, xpEarned: number) {
    return this.sendNotification({
      userId,
      title: 'Goal Completed! 🎉',
      message: `Congratulations! You've completed "${goalTitle}" and earned ${xpEarned} XP!`,
      type: 'achievement',
      actionUrl: '/dashboard/learner/goals',
      metadata: { goalTitle, xpEarned, event: 'goal_completed' }
    });
  }

  static async sendLevelUpNotification(userId: string, newLevel: number) {
    return this.sendNotification({
      userId,
      title: 'Level Up! 🚀',
      message: `Amazing! You've reached Level ${newLevel}! Keep up the great work!`,
      type: 'achievement',
      actionUrl: '/dashboard/learner',
      metadata: { newLevel, event: 'level_up' }
    });
  }

  static async sendMilestoneCompletionNotification(userId: string, goalTitle: string, milestoneTitle: string) {
    return this.sendNotification({
      userId,
      title: 'Milestone Achieved! ✅',
      message: `Great progress! You've completed "${milestoneTitle}" in "${goalTitle}"`,
      type: 'achievement',
      actionUrl: '/dashboard/learner/goals',
      metadata: { goalTitle, milestoneTitle, event: 'milestone_completed' }
    });
  }

  static async sendProgressNudge(userId: string, goalTitle: string, daysSinceUpdate: number) {
    return this.sendNotification({
      userId,
      title: 'Time to make progress! 📈',
      message: `Need help getting back on track with "${goalTitle}"? Try completing a milestone today!`,
      type: 'progress_nudge',
      actionUrl: '/dashboard/learner/goals',
      metadata: { goalTitle, daysSinceUpdate, event: 'progress_nudge' }
    });
  }
}

// Hook for easy notification usage in components
export const useNotifications = () => {
  const { user } = useAuth();
  const analytics = useAnalyticsPublisher();

  const sendGoalCompletedNotification = async (goalTitle: string, xpEarned: number) => {
    if (!user?.id) return;
    
    try {
      await NotificationService.sendGoalCompletionNotification(user.id, goalTitle, xpEarned);
      
      // Track analytics
      analytics.publishEvent('notification_sent', {
        type: 'goal_completed',
        goalTitle,
        xpEarned
      });
    } catch (error) {
      console.error('Error sending goal completion notification:', error);
    }
  };

  const sendLevelUpNotification = async (newLevel: number) => {
    if (!user?.id) return;
    
    try {
      await NotificationService.sendLevelUpNotification(user.id, newLevel);
      
      // Track analytics
      analytics.publishEvent('notification_sent', {
        type: 'level_up',
        newLevel
      });
    } catch (error) {
      console.error('Error sending level up notification:', error);
    }
  };

  const sendMilestoneNotification = async (goalTitle: string, milestoneTitle: string) => {
    if (!user?.id) return;
    
    try {
      await NotificationService.sendMilestoneCompletionNotification(user.id, goalTitle, milestoneTitle);
      
      // Track analytics
      analytics.publishEvent('notification_sent', {
        type: 'milestone_completed',
        goalTitle,
        milestoneTitle
      });
    } catch (error) {
      console.error('Error sending milestone notification:', error);
    }
  };

  return {
    sendGoalCompletedNotification,
    sendLevelUpNotification,
    sendMilestoneNotification
  };
};