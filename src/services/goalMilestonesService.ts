import { supabase } from '@/integrations/supabase/client';
import type { GoalMilestoneCompletion } from '@/types/goals';

export class GoalMilestonesService {
  static async trackMilestoneCompletion(
    userId: string,
    goalId: string,
    milestoneId: string,
    milestoneTitle: string,
    completionTimeSeconds?: number,
    contextData?: Record<string, any>
  ): Promise<GoalMilestoneCompletion> {
    const { data, error } = await supabase
      .from('goal_milestone_completions')
      .insert({
        user_id: userId,
        goal_id: goalId,
        milestone_id: milestoneId,
        milestone_title: milestoneTitle,
        completion_time_seconds: completionTimeSeconds,
        context_data: contextData || {}
      })
      .select()
      .single();

    if (error) {
      console.error('Error tracking milestone completion:', error);
      throw error;
    }

    return data;
  }

  static async getMilestoneCompletions(goalId: string): Promise<GoalMilestoneCompletion[]> {
    const { data, error } = await supabase
      .from('goal_milestone_completions')
      .select('*')
      .eq('goal_id', goalId)
      .order('completed_at', { ascending: false });

    if (error) {
      console.error('Error fetching milestone completions:', error);
      throw error;
    }

    return data || [];
  }

  static async getUserMilestoneAnalytics(userId: string, days: number = 30): Promise<{
    totalMilestones: number;
    averageCompletionTime: number;
    completionsByDay: Array<{ date: string; count: number }>;
    mostActiveHours: Array<{ hour: number; count: number }>;
  }> {
    const since = new Date();
    since.setDate(since.getDate() - days);

    const { data, error } = await supabase
      .from('goal_milestone_completions')
      .select('completed_at, completion_time_seconds')
      .eq('user_id', userId)
      .gte('completed_at', since.toISOString());

    if (error) {
      console.error('Error fetching milestone analytics:', error);
      throw error;
    }

    const completions = data || [];
    
    // Calculate analytics
    const totalMilestones = completions.length;
    const validTimes = completions.filter(c => c.completion_time_seconds).map(c => c.completion_time_seconds!);
    const averageCompletionTime = validTimes.length > 0 ? validTimes.reduce((a, b) => a + b, 0) / validTimes.length : 0;

    // Group by day
    const completionsByDay = completions.reduce((acc, completion) => {
      const date = new Date(completion.completed_at).toDateString();
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Group by hour
    const completionsByHour = completions.reduce((acc, completion) => {
      const hour = new Date(completion.completed_at).getHours();
      acc[hour] = (acc[hour] || 0) + 1;
      return acc;
    }, {} as Record<number, number>);

    return {
      totalMilestones,
      averageCompletionTime,
      completionsByDay: Object.entries(completionsByDay).map(([date, count]) => ({ date, count })),
      mostActiveHours: Object.entries(completionsByHour).map(([hour, count]) => ({ hour: parseInt(hour), count }))
    };
  }
}