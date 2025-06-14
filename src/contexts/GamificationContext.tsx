
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
  const isSubscribedRef = useRef<boolean>(false);
  const currentUserIdRef = useRef<string | null>(null);

  const refreshStats = async () => {
    await fetchUserStats();
    setLastUpdate(Date.now());
  };

  // Cleanup function
  const cleanup = () => {
    if (channelRef.current && isSubscribedRef.current) {
      try {
        supabase.removeChannel(channelRef.current);
        console.log('🧹 Cleaned up gamification channel');
      } catch (error) {
        console.log('Error removing channel:', error);
      }
      channelRef.current = null;
      isSubscribedRef.current = false;
    }
  };

  useEffect(() => {
    // Only setup subscription if user changed or we don't have an active subscription
    if (user?.id && (currentUserIdRef.current !== user.id || !isSubscribedRef.current)) {
      console.log('🔗 Setting up gamification real-time subscription for user:', user.id);
      
      // Clean up previous subscription if exists
      cleanup();
      
      // Update current user reference
      currentUserIdRef.current = user.id;

      // Create a single channel with a unique name
      const channelName = `gamification-updates-${user.id}-${Date.now()}`;
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

      // Subscribe to the channel only once
      channel.subscribe((status) => {
        console.log('Gamification channel subscription status:', status);
        if (status === 'SUBSCRIBED') {
          isSubscribedRef.current = true;
        } else if (status === 'CLOSED' || status === 'CHANNEL_ERROR') {
          isSubscribedRef.current = false;
        }
      });

      // Store the channel reference for cleanup
      channelRef.current = channel;
    }

    // Cleanup when user logs out
    if (!user?.id) {
      cleanup();
      currentUserIdRef.current = null;
    }

    // Cleanup function for effect
    return () => {
      // Only cleanup if user is changing, not on every re-render
      if (!user?.id || currentUserIdRef.current !== user.id) {
        cleanup();
      }
    };
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
