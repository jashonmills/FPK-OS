
import React, { createContext, useContext, useState, useEffect } from 'react';

interface XPData {
  total_xp: number;
  level: number;
  next_level_xp: number;
}

interface Badge {
  id: string;
  name: string;
  icon: string;
  description: string;
  earned_at: string;
}

interface Streak {
  streak_type: 'study' | 'login';
  current_count: number;
  best_count: number;
}

interface UserStats {
  xp: XPData;
  badges: Badge[];
  streaks: Streak[];
}

interface GamificationContextType {
  userStats: UserStats | null;
  isLoading: boolean;
  error: string | null;
  awardXP: (action: string, amount: number, metadata?: any) => Promise<any>;
  updateStreak: (type: string) => Promise<any>;
}

export const GamificationContext = createContext<GamificationContextType>({
  userStats: null,
  isLoading: true,
  error: null,
  awardXP: async () => {},
  updateStreak: async () => {}
});

export const GamificationProvider = ({ children }: { children: React.ReactNode }) => {
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Simulate loading gamification data
    setTimeout(() => {
      setUserStats({
        xp: {
          total_xp: 150,
          level: 1,
          next_level_xp: 100
        },
        badges: [],
        streaks: [
          {
            streak_type: 'study',
            current_count: 0,
            best_count: 0
          }
        ]
      });
      setIsLoading(false);
    }, 1000);
  }, []);

  const awardXP = async (action: string, amount: number, metadata?: any) => {
    if (!userStats) return null;
    
    const newTotalXP = userStats.xp.total_xp + amount;
    const newLevel = Math.floor(newTotalXP / 100) + 1;
    
    setUserStats(prev => prev ? {
      ...prev,
      xp: {
        ...prev.xp,
        total_xp: newTotalXP,
        level: newLevel
      }
    } : null);
    
    return { level: newLevel, xp: newTotalXP };
  };

  const updateStreak = async (type: string) => {
    if (!userStats) return null;
    
    const streak = userStats.streaks.find(s => s.streak_type === type);
    if (streak) {
      streak.current_count += 1;
      streak.best_count = Math.max(streak.best_count, streak.current_count);
      setUserStats({ ...userStats });
      return { streak: streak.current_count };
    }
    
    return null;
  };

  return (
    <GamificationContext.Provider value={{
      userStats,
      isLoading,
      error,
      awardXP,
      updateStreak
    }}>
      {children}
    </GamificationContext.Provider>
  );
};

export const useGamificationContext = () => useContext(GamificationContext);
