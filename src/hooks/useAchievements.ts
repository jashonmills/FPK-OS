import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import type { Database } from '@/integrations/supabase/types';

type Achievement = Database['public']['Tables']['achievements']['Row'];

export interface AchievementTemplate {
  type: string;
  name: string;
  description: string;
  xpReward: number;
  icon: string;
}

export const predefinedAchievements: AchievementTemplate[] = [
  {
    type: 'learning_state_beginner',
    name: 'Learning State Beginner',
    description: 'Complete your first Learning State module',
    xpReward: 100,
    icon: '🎯'
  },
  {
    type: 'cognitive_load_master',
    name: 'Cognitive Load Master',
    description: 'Complete all cognitive load theory modules',
    xpReward: 250,
    icon: '🧠'
  },
  {
    type: 'study_streak_7',
    name: 'Study Streak 7 Days',
    description: 'Study consistently for 7 days in a row',
    xpReward: 200,
    icon: '🔥'
  },
  {
    type: 'quiz_champion',
    name: 'Quiz Champion',
    description: 'Complete 10 Learning State quizzes',
    xpReward: 150,
    icon: '🏆'
  },
  {
    type: 'knowledge_seeker',
    name: 'Knowledge Seeker',
    description: 'Earn 500 XP in Learning State course',
    xpReward: 75,
    icon: '⭐'
  },
  {
    type: 'learning_enthusiast',
    name: 'Learning Enthusiast',
    description: 'Study for 10 hours total',
    xpReward: 300,
    icon: '📚'
  }
];

export const useAchievements = () => {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      loadAchievements();
    } else {
      setLoading(false);
    }
  }, [user]);

  const loadAchievements = async () => {
    if (!user?.id) {
      console.log('useAchievements - No user ID available');
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('achievements')
        .select('*')
        .eq('user_id', user.id)
        .order('unlocked_at', { ascending: false });

      if (error) {
        console.error('Error loading achievements:', error);
        setAchievements([]);
      } else {
        setAchievements(data || []);
      }
    } catch (error) {
      console.error('Error in loadAchievements:', error);
      setAchievements([]);
    } finally {
      setLoading(false);
    }
  };

  const unlockAchievement = async (achievementType: string) => {
    if (!user) return;

    const template = predefinedAchievements.find(a => a.type === achievementType);
    if (!template) return;

    // Check if already unlocked
    const alreadyUnlocked = achievements.some(a => a.achievement_type === achievementType);
    if (alreadyUnlocked) return;

    try {
      const { data, error } = await supabase
        .from('achievements')
        .insert({
          user_id: user.id,
          achievement_type: achievementType,
          achievement_name: template.name,
          xp_reward: template.xpReward
        })
        .select()
        .single();

      if (error) {
        console.error('Error unlocking achievement:', error);
        return;
      }

      setAchievements(prev => [data, ...prev]);
      
      toast({
        title: `🏆 Achievement Unlocked!`,
        description: `You earned "${template.name}" and ${template.xpReward} XP!`,
      });

      return data;
    } catch (error) {
      console.error('Error in unlockAchievement:', error);
    }
  };

  const hasAchievement = (achievementType: string) => {
    return achievements.some(a => a.achievement_type === achievementType);
  };

  return {
    achievements,
    loading,
    unlockAchievement,
    hasAchievement,
    predefinedAchievements,
    refetch: loadAchievements,
  };
};
