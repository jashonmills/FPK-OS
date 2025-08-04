
import { useContext } from 'react';
import { GamificationContext } from '@/contexts/GamificationContext';

export const useGamification = () => {
  const context = useContext(GamificationContext);
  if (!context) {
    // Return default values instead of throwing error for now
    return {
      userStats: null,
      isLoading: false,
      error: null,
      awardXP: async () => {},
      updateStreak: async () => {},
      fetchUserStats: () => {},
      checkBadges: () => {}
    };
  }
  return {
    ...context,
    fetchUserStats: () => {},
    checkBadges: () => {}
  };
};
