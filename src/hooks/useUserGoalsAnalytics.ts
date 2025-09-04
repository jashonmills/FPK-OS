import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface UserGoalsAnalytics {
  activeGoals: number;
  completedGoals: number;
  totalGoals: number;
  completionRate: number;
  recentGoals: Array<{
    id: string;
    title: string;
    status: string;
    progress: number;
    dueDate?: string;
    completedAt?: string;
  }>;
  goalsByCategory: Record<string, number>;
}

export const useUserGoalsAnalytics = (userId?: string) => {
  return useQuery({
    queryKey: ['user-goals-analytics', userId],
    queryFn: async (): Promise<UserGoalsAnalytics> => {
      if (!userId) throw new Error('User ID is required');

      // Get all goals for the user
      const { data: goals, error: goalsError } = await supabase
        .from('goals')
        .select(`
          id,
          title,
          description,
          status,
          progress,
          category,
          due_date,
          completed_at,
          created_at
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (goalsError) throw goalsError;

      // Calculate metrics
      const totalGoals = goals?.length || 0;
      const activeGoals = goals?.filter(goal => goal.status === 'active').length || 0;
      const completedGoals = goals?.filter(goal => goal.status === 'completed').length || 0;
      const completionRate = totalGoals > 0 
        ? Math.round((completedGoals / totalGoals) * 100) 
        : 0;

      // Group by category
      const goalsByCategory = goals?.reduce((acc, goal) => {
        const category = goal.category || 'Uncategorized';
        acc[category] = (acc[category] || 0) + 1;
        return acc;
      }, {} as Record<string, number>) || {};

      // Format recent goals
      const recentGoals = (goals?.slice(0, 10) || []).map(goal => ({
        id: goal.id,
        title: goal.title || 'Untitled Goal',
        status: goal.status,
        progress: goal.progress || 0,
        dueDate: goal.due_date ? new Date(goal.due_date).toLocaleDateString() : undefined,
        completedAt: goal.completed_at ? new Date(goal.completed_at).toLocaleDateString() : undefined
      }));

      return {
        activeGoals,
        completedGoals,
        totalGoals,
        completionRate,
        recentGoals,
        goalsByCategory
      };
    },
    enabled: !!userId
  });
};