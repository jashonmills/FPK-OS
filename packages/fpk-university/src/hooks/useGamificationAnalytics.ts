import { useCallback } from 'react';
import { ga4 } from '@/utils/ga4Setup';
import { useAuth } from '@/hooks/useAuth';

export const useGamificationAnalytics = () => {
  const { user } = useAuth();

  const trackBadgeEarned = useCallback((badgeId: string, badgeName: string, category: string) => {
    ga4.trackCustomEvent('badge_earned', {
      user_id: user?.id,
      badge_id: badgeId,
      badge_name: badgeName,
      category: category,
      timestamp: new Date().toISOString()
    });
  }, [user?.id]);

  const trackXPAwarded = useCallback((amount: number, source: string, activity: string) => {
    ga4.trackCustomEvent('xp_awarded', {
      user_id: user?.id,
      amount: amount,
      source: source,
      activity: activity,
      timestamp: new Date().toISOString()
    });
  }, [user?.id]);

  const trackLevelUp = useCallback((newLevel: number, totalXP: number) => {
    ga4.trackCustomEvent('level_up', {
      user_id: user?.id,
      new_level: newLevel,
      total_xp: totalXP,
      timestamp: new Date().toISOString()
    });
  }, [user?.id]);

  const trackLeaderboardViewed = useCallback((leaderboardType: string) => {
    ga4.trackCustomEvent('leaderboard_viewed', {
      user_id: user?.id,
      leaderboard_type: leaderboardType,
      timestamp: new Date().toISOString()
    });
  }, [user?.id]);

  const trackStreakAchieved = useCallback((streakDays: number, streakType: string) => {
    ga4.trackCustomEvent('streak_achieved', {
      user_id: user?.id,
      streak_days: streakDays,
      streak_type: streakType,
      timestamp: new Date().toISOString()
    });
  }, [user?.id]);

  const trackAchievementUnlocked = useCallback((achievementId: string, achievementName: string) => {
    ga4.trackCustomEvent('achievement_unlocked', {
      user_id: user?.id,
      achievement_id: achievementId,
      achievement_name: achievementName,
      timestamp: new Date().toISOString()
    });
  }, [user?.id]);

  return {
    trackBadgeEarned,
    trackXPAwarded,
    trackLevelUp,
    trackLeaderboardViewed,
    trackStreakAchieved,
    trackAchievementUnlocked
  };
};
