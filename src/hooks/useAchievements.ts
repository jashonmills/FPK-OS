
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
    type: 'first_module',
    name: 'goals.achievements.firstModule',
    description: 'goals.achievementDescriptions.firstModule',
    xpReward: 100,
    icon: '🎯'
  },
  {
    type: 'study_streak_3',
    name: 'goals.achievements.studyStreak3',
    description: 'goals.achievementDescriptions.studyStreak3',
    xpReward: 150,
    icon: '🔥'
  },
  {
    type: 'xp_500',
    name: 'goals.achievements.xp500',
    description: 'goals.achievementDescriptions.xp500',
    xpReward: 50,
    icon: '⭐'
  },
  {
    type: 'learning_state_beginner',
    name: 'goals.achievements.learningStateBeginner',
    description: 'goals.achievementDescriptions.learningStateBeginner',
    xpReward: 200,
    icon: '🌟'
  },
  {
    type: 'consistent_learner',
    name: 'goals.achievements.consistentLearner',
    description: 'goals.achievementDescriptions.consistentLearner',
    xpReward: 300,
    icon: '💪'
  },
  {
    type: 'fast_learner',
    name: 'goals.achievements.fastLearner',
    description: 'goals.achievementDescriptions.fastLearner',
    xpReward: 250,
    icon: '⚡'
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
    }
  }, [user]);

  const loadAchievements = async () => {
    try {
      const { data, error } = await supabase
        .from('achievements')
        .select('*')
        .order('unlocked_at', { ascending: false });

      if (error) {
        console.error('Error loading achievements:', error);
        return;
      }

      setAchievements(data || []);
    } catch (error) {
      console.error('Error in loadAchievements:', error);
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
