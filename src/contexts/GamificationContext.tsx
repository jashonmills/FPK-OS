
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

// Global channel tracking to prevent multiple subscriptions
const activeChannels = new Map<string, any>();

export const GamificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const { userStats, fetchUserStats, isLoading } = useGamification();
  const [lastUpdate, setLastUpdate] = useState<number>(Date.now());
  const initializationRef = useRef<boolean>(false);

  const refreshStats = async () => {
    await fetchUserStats();
    setLastUpdate(Date.now());
  };

  // Cleanup function
  const cleanup = (userId: string) => {
    const channelKey = `gamification-${userId}`;
    const existingChannel = activeChannels.get(channelKey);
    
    if (existingChannel) {
      try {
        console.log('🧹 Cleaning up existing gamification channel for user:', userId);
        supabase.removeChannel(existingChannel);
        activeChannels.delete(channelKey);
      } catch (error) {
        console.log('Error removing channel:', error);
      }
    }
  };

  useEffect(() => {
    // Prevent multiple initializations
    if (!user?.id || initializationRef.current) {
      return;
    }

    console.log('🔗 Setting up gamification real-time subscription for user:', user.id);
    
    const channelKey = `gamification-${user.id}`;
    
    // Clean up any existing channel for this user
    cleanup(user.id);
    
    // Mark as initialized
    initializationRef.current = true;

    // Create a single channel with a stable name
    const channel = supabase.channel(channelKey, {
      config: {
        broadcast: { self: false }
      }
    });

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
        console.log('✅ Gamification channel successfully subscribed');
      } else if (status === 'CLOSED' || status === 'CHANNEL_ERROR') {
        console.log('❌ Gamification channel closed or error');
        initializationRef.current = false;
      }
    });

    // Store the channel reference for cleanup
    activeChannels.set(channelKey, channel);

    // Cleanup function for effect
    return () => {
      initializationRef.current = false;
    };
  }, [user?.id]); // Only depend on user.id

  // Cleanup when user logs out
  useEffect(() => {
    if (!user?.id && initializationRef.current) {
      // Clean up all channels when user logs out
      activeChannels.forEach((channel, key) => {
        try {
          supabase.removeChannel(channel);
        } catch (error) {
          console.log('Error removing channel during logout:', error);
        }
      });
      activeChannels.clear();
      initializationRef.current = false;
    }
  }, [user?.id]);

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
