
import { useCallback } from 'react';
import { toast } from '@/components/ui/use-toast';

export const useNotificationTriggers = () => {
  const triggerAchievement = useCallback(async (message: string) => {
    toast({
      title: "Achievement Unlocked! 🎉",
      description: message,
      duration: 5000,
    });
  }, []);

  const triggerStudyStreak = useCallback(async (streakCount: number) => {
    toast({
      title: `${streakCount} Day Streak! 🔥`,
      description: "You're on fire! Keep up the great work!",
      duration: 5000,
    });
  }, []);

  return {
    triggerAchievement,
    triggerStudyStreak
  };
};
