
import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useGamification } from '@/hooks/useGamification';

interface GamificationContextType {
  userStats: any;
  refreshStats: () => Promise<void>;
  isLoading: boolean;
}

const GamificationContext = createContext<GamificationContextType | undefined>(undefined);

export const useGamificationContext = () => {
  const context = useContext(GamificationContext);
  if (!context) {
    throw new Error('useGamificationContext must be used within a GamificationProvider');
  }
  return context;
};

export const GamificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const { userStats, fetchUserStats, isLoading } = useGamification();
  const [lastUpdate, setLastUpdate] = useState<number>(Date.now());
  const channelRef = useRef<any>(null);

  const refreshStats = async () => {
    await fetchUserStats();
    setLastUpdate(Date.now());
  };

  useEffect(() => {
    if (user) {
      // Clean up any existing channel before creating a new one
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }

      // Create a single channel with a unique name to prevent conflicts
      const channelName = `gamification-updates-${user.id}`;
      const channel = supabase.channel(channelName);

      // Configure all the real-time listeners
      channel
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'user_xp',
            filter: `user_id=eq.${user.id}`
          },
          () => {
            console.log('Real-time XP update detected');
            refreshStats();
          }
        )
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'user_badges',
            filter: `user_id=eq.${user.id}`
          },
          () => {
            console.log('Real-time badge update detected');
            refreshStats();
          }
        )
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'achievements',
            filter: `user_id=eq.${user.id}`
          },
          () => {
            console.log('Real-time achievement update detected');
            refreshStats();
          }
        )
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'streaks',
            filter: `user_id=eq.${user.id}`
          },
          () => {
            console.log('Real-time streak update detected');
            refreshStats();
          }
        );

      // Subscribe to the channel
      channel.subscribe((status) => {
        console.log('Gamification channel subscription status:', status);
      });

      // Store the channel reference for cleanup
      channelRef.current = channel;

      return () => {
        if (channelRef.current) {
          supabase.removeChannel(channelRef.current);
          channelRef.current = null;
        }
      };
    }
  }, [user?.id]); // Only depend on user.id to avoid recreation

  // Auto-refresh on mount
  useEffect(() => {
    if (user) {
      fetchUserStats();
    }
  }, [user, fetchUserStats]);

  const value = {
    userStats,
    refreshStats,
    isLoading
  };

  return (
    <GamificationContext.Provider value={value}>
      {children}
    </GamificationContext.Provider>
  );
};
