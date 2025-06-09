
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import type { Database } from '@/integrations/supabase/types';

type Profile = Database['public']['Tables']['profiles']['Row'];

export const useXPTracking = () => {
  const [xpData, setXpData] = useState({
    totalXP: 0,
    currentStreak: 0,
    level: 1,
    xpToNextLevel: 1000,
    lastActivityDate: null as string | null
  });
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    console.log('useXPTracking - User changed:', user);
    if (user) {
      loadXPData();
    } else {
      setLoading(false);
    }
  }, [user]);

  const calculateLevel = (totalXP: number) => {
    // Level calculation: Level 1 = 0-999 XP, Level 2 = 1000-2999 XP, etc.
    return Math.floor(totalXP / 1000) + 1;
  };

  const calculateXPToNextLevel = (totalXP: number) => {
    const currentLevel = calculateLevel(totalXP);
    const nextLevelXP = currentLevel * 1000;
    return nextLevelXP - totalXP;
  };

  const loadXPData = async () => {
    if (!user?.id) {
      console.log('useXPTracking - No user ID available');
      setLoading(false);
      return;
    }

    console.log('useXPTracking - Loading XP data for user:', user.id);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('total_xp, current_streak, last_activity_date')
        .eq('id', user.id)
        .maybeSingle();

      console.log('useXPTracking - Query result:', { data, error });

      if (error) {
        console.error('Error loading XP data:', error);
        // If error, use default values but still set loading to false
        setXpData({
          totalXP: 0,
          currentStreak: 0,
          level: 1,
          xpToNextLevel: 1000,
          lastActivityDate: null
        });
        setLoading(false);
        return;
      }

      // If no profile exists, create one with default values
      if (!data) {
        console.log('useXPTracking - No profile found, creating default profile');
        await createDefaultProfile();
        return;
      }

      const totalXP = data.total_xp || 0;
      const newXpData = {
        totalXP,
        currentStreak: data.current_streak || 0,
        level: calculateLevel(totalXP),
        xpToNextLevel: calculateXPToNextLevel(totalXP),
        lastActivityDate: data.last_activity_date
      };
      
      console.log('useXPTracking - Setting XP data:', newXpData);
      setXpData(newXpData);
    } catch (error) {
      console.error('Error in loadXPData:', error);
    } finally {
      setLoading(false);
    }
  };

  const createDefaultProfile = async () => {
    if (!user?.id) return;

    try {
      const { error } = await supabase
        .from('profiles')
        .insert({
          id: user.id,
          total_xp: 0,
          current_streak: 0,
          last_activity_date: new Date().toISOString().split('T')[0]
        });

      if (error) {
        console.error('Error creating default profile:', error);
      } else {
        console.log('useXPTracking - Created default profile');
        // Reload data after creating profile
        await loadXPData();
      }
    } catch (error) {
      console.error('Error in createDefaultProfile:', error);
    }
  };

  const addXP = async (amount: number, reason?: string) => {
    if (!user) return;

    try {
      const newTotalXP = xpData.totalXP + amount;
      const today = new Date().toISOString().split('T')[0];
      
      // Check if this is a new day for streak calculation
      const isNewDay = xpData.lastActivityDate !== today;
      const newStreak = isNewDay ? xpData.currentStreak + 1 : xpData.currentStreak;

      const { error } = await supabase
        .from('profiles')
        .update({
          total_xp: newTotalXP,
          current_streak: newStreak,
          last_activity_date: today
        })
        .eq('id', user.id);

      if (error) {
        console.error('Error updating XP:', error);
        return;
      }

      // Update local state
      setXpData({
        totalXP: newTotalXP,
        currentStreak: newStreak,
        level: calculateLevel(newTotalXP),
        xpToNextLevel: calculateXPToNextLevel(newTotalXP),
        lastActivityDate: today
      });

      // Show success toast
      toast({
        title: `+${amount} XP Earned! 🎉`,
        description: reason || `Great job! You now have ${newTotalXP} XP.`,
      });

    } catch (error) {
      console.error('Error in addXP:', error);
    }
  };

  return {
    xpData,
    loading,
    addXP,
    refetch: loadXPData,
  };
};
