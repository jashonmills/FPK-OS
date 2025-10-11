
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

interface BadgeItem {
  id: string;
  badge_id: string;
  name: string;
  description: string;
  icon: string;
  criteria: Record<string, unknown>;
  rarity: string;
  xp_reward: number;
  awarded_at?: string;
}

interface Streak {
  id: string;
  user_id: string;
  streak_type: string;
  current_count: number;
  max_count: number;
  best_count: number;
  last_activity: string;
  start_date: string;
  last_activity_date: string;
  created_at: string;
}

interface XPResponse {
  success: boolean;
  xp_awarded: number;
  total_xp: number;
  level: number;
  xp_to_next: number;
  leveled_up: boolean;
  multiplier: number;
  new_badges: BadgeItem[];
}

interface UserStats {
  xp: {
    total_xp: number;
    level: number;
    next_level_xp: number;
  };
  badges: BadgeItem[];
  streaks: Streak[];
}

export function useGamification() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const awardXP = useCallback(async (eventType: string, eventValue: number, metadata?: Record<string, unknown>) => {
    if (!user?.id || isProcessing) return;

    setIsProcessing(true);
    try {
      const { data, error } = await supabase.functions.invoke('xp-system', {
        body: {
          action: 'award_xp',
          event_type: eventType,
          event_value: eventValue,
          metadata
        }
      });

      if (error) throw error;

      const response = data as XPResponse;

      // Show XP notification
      let xpMessage = `+${response.xp_awarded} XP`;
      if (response.multiplier > 1) {
        xpMessage += ` (${response.multiplier}x multiplier!)`;
      }

      toast({
        title: xpMessage,
        description: `Total XP: ${response.total_xp} | Level ${response.level}`,
        duration: 3000,
      });

      // Show level up notification
      if (response.leveled_up) {
        toast({
          title: `🎉 Level Up!`,
          description: `Congratulations! You reached Level ${response.level}!`,
          duration: 5000,
        });
      }

      // Show badge notifications
      response.new_badges.forEach(badge => {
        toast({
          title: `🏆 Badge Unlocked!`,
          description: `${badge.icon} ${badge.name}: ${badge.description}`,
          duration: 4000,
        });
      });

      // Refresh user stats
      await fetchUserStats();

      return response;
    } catch (error) {
      console.error('Failed to award XP:', error);
      toast({
        title: "Error",
        description: "Failed to award XP. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  }, [user?.id, isProcessing]);

  const fetchUserStats = useCallback(async () => {
    if (!user?.id) return;

    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('xp-system', {
        body: { action: 'get_user_stats' }
      });

      if (error) throw error;
      setUserStats(data);
    } catch (error) {
      console.error('Failed to fetch user stats:', error);
      // Set default empty state to prevent crashes
      setUserStats({
        xp: {
          total_xp: 0,
          level: 1,
          next_level_xp: 100
        },
        badges: [],
        streaks: []
      });
    } finally {
      setIsLoading(false);
    }
  }, [user?.id]);

  const updateStreak = useCallback(async (streakType: string) => {
    if (!user?.id) return;

    try {
      const { data, error } = await supabase.functions.invoke('xp-system', {
        body: {
          action: 'update_streak',
          streak_type: streakType
        }
      });

      if (error) throw error;
      
      await fetchUserStats();
      return data;
    } catch (error) {
      console.error('Failed to update streak:', error);
    }
  }, [user?.id, fetchUserStats]);

  const checkBadges = useCallback(async () => {
    if (!user?.id) return;

    try {
      const { data, error } = await supabase.functions.invoke('xp-system', {
        body: { action: 'check_badges' }
      });

      if (error) throw error;

      // Show notifications for new badges
      data.newBadges?.forEach((badge: BadgeItem) => {
        toast({
          title: `🏆 Badge Unlocked!`,
          description: `${badge.icon} ${badge.name}: ${badge.description}`,
          duration: 4000,
        });
      });

      await fetchUserStats();
      return data;
    } catch (error) {
      console.error('Failed to check badges:', error);
    }
  }, [user?.id, fetchUserStats]);

  const purchaseItem = useCallback(async (itemId: string) => {
    if (!user?.id) return;

    try {
      const { data, error } = await supabase.functions.invoke('xp-system', {
        body: {
          action: 'purchase_item',
          item_id: itemId
        }
      });

      if (error) throw error;

      if (data.error) {
        toast({
          title: "Purchase Failed",
          description: data.error,
          variant: "destructive"
        });
        return null;
      }

      toast({
        title: "Purchase Successful!",
        description: `You bought ${data.item_purchased.name} for ${data.xp_spent} XP`,
        duration: 3000,
      });

      await fetchUserStats();
      return data;
    } catch (error) {
      console.error('Failed to purchase item:', error);
      toast({
        title: "Error",
        description: "Failed to purchase item. Please try again.",
        variant: "destructive"
      });
    }
  }, [user?.id, fetchUserStats]);

  return {
    awardXP,
    fetchUserStats,
    updateStreak,
    checkBadges,
    purchaseItem,
    userStats,
    isLoading,
    isProcessing
  };
}
