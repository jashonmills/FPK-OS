import { supabase } from '@/integrations/supabase/client';

export interface GoalInsight {
  totalGoals: number;
  activeGoals: number;
  completedGoals: number;
  pausedGoals: number;
  completionRate: number;
  totalXpEarned: number;
  averageCompletionDays: number;
}

export interface GoalCompletionTrend {
  date: string;
  completed: number;
  created: number;
  xpEarned: number;
}

export interface CategoryPerformance {
  category: string;
  total: number;
  completed: number;
  avgCompletionDays: number;
  totalXp: number;
  completionRate: number;
}

export interface PriorityDistribution {
  priority: string;
  count: number;
  completed: number;
  xpEarned: number;
}

export class GoalAnalyticsService {
  static async getGoalInsights(userId: string, days: number = 30): Promise<GoalInsight> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);

    const { data: goals, error } = await supabase
      .from('goals')
      .select('*')
      .eq('user_id', userId)
      .gte('created_at', cutoffDate.toISOString());

    if (error) throw error;

    const totalGoals = goals?.length || 0;
    const activeGoals = goals?.filter(g => g.status === 'active').length || 0;
    const completedGoals = goals?.filter(g => g.status === 'completed').length || 0;
    const pausedGoals = goals?.filter(g => g.status === 'paused').length || 0;
    const completionRate = totalGoals > 0 ? (completedGoals / totalGoals) * 100 : 0;

    // Calculate average completion time
    const completedWithDates = goals?.filter(g => 
      g.status === 'completed' && g.completed_at && g.created_at
    ) || [];
    
    const avgCompletionDays = completedWithDates.length > 0 
      ? completedWithDates.reduce((sum, goal) => {
          const created = new Date(goal.created_at).getTime();
          const completed = new Date(goal.completed_at).getTime();
          return sum + Math.ceil((completed - created) / (1000 * 60 * 60 * 24));
        }, 0) / completedWithDates.length
      : 0;

    // Get XP data from analytics_metrics
    const { data: xpMetrics } = await supabase
      .from('analytics_metrics')
      .select('value')
      .eq('user_id', userId)
      .eq('metric_name', 'xp_earned')
      .gte('created_at', cutoffDate.toISOString());

    const totalXpEarned = xpMetrics?.reduce((sum, metric) => sum + Number(metric.value), 0) || 0;

    return {
      totalGoals,
      activeGoals,
      completedGoals,
      pausedGoals,
      completionRate,
      totalXpEarned,
      averageCompletionDays: Math.round(avgCompletionDays)
    };
  }

  static async getCompletionTrends(userId: string, days: number = 30): Promise<GoalCompletionTrend[]> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);

    // Get goals data
    const { data: goals, error } = await supabase
      .from('goals')
      .select('created_at, completed_at, status')
      .eq('user_id', userId)
      .gte('created_at', cutoffDate.toISOString());

    if (error) throw error;

    // Get XP data
    const { data: xpMetrics } = await supabase
      .from('analytics_metrics')
      .select('value, created_at')
      .eq('user_id', userId)
      .eq('metric_name', 'xp_earned')
      .gte('created_at', cutoffDate.toISOString());

    // Create daily aggregation
    const dailyData: Record<string, GoalCompletionTrend> = {};
    
    // Initialize all days
    for (let i = 0; i < days; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      dailyData[dateStr] = {
        date: dateStr,
        completed: 0,
        created: 0,
        xpEarned: 0
      };
    }

    // Aggregate goals data
    goals?.forEach(goal => {
      const createdDate = new Date(goal.created_at).toISOString().split('T')[0];
      if (dailyData[createdDate]) {
        dailyData[createdDate].created++;
      }

      if (goal.status === 'completed' && goal.completed_at) {
        const completedDate = new Date(goal.completed_at).toISOString().split('T')[0];
        if (dailyData[completedDate]) {
          dailyData[completedDate].completed++;
        }
      }
    });

    // Aggregate XP data
    xpMetrics?.forEach(metric => {
      const date = new Date(metric.created_at).toISOString().split('T')[0];
      if (dailyData[date]) {
        dailyData[date].xpEarned += Number(metric.value);
      }
    });

    return Object.values(dailyData).sort((a, b) => a.date.localeCompare(b.date));
  }

  static async getCategoryPerformance(userId: string): Promise<CategoryPerformance[]> {
    const { data: goals, error } = await supabase
      .from('goals')
      .select('category, status, created_at, completed_at, priority')
      .eq('user_id', userId);

    if (error) throw error;

    const categoryMap: Record<string, CategoryPerformance> = {};

    goals?.forEach(goal => {
      const category = goal.category || 'uncategorized';
      
      if (!categoryMap[category]) {
        categoryMap[category] = {
          category,
          total: 0,
          completed: 0,
          avgCompletionDays: 0,
          totalXp: 0,
          completionRate: 0
        };
      }

      categoryMap[category].total++;
      
      if (goal.status === 'completed') {
        categoryMap[category].completed++;
        
        // Calculate XP based on priority
        const xp = goal.priority === 'high' ? 50 : goal.priority === 'medium' ? 30 : 20;
        categoryMap[category].totalXp += xp;
      }
    });

    // Calculate completion rates and average completion times
    Object.values(categoryMap).forEach(category => {
      category.completionRate = category.total > 0 
        ? (category.completed / category.total) * 100 
        : 0;
    });

    return Object.values(categoryMap).sort((a, b) => b.completionRate - a.completionRate);
  }

  static async getPriorityDistribution(userId: string): Promise<PriorityDistribution[]> {
    const { data: goals, error } = await supabase
      .from('goals')
      .select('priority, status')
      .eq('user_id', userId);

    if (error) throw error;

    const priorityMap: Record<string, PriorityDistribution> = {
      high: { priority: 'High', count: 0, completed: 0, xpEarned: 0 },
      medium: { priority: 'Medium', count: 0, completed: 0, xpEarned: 0 },
      low: { priority: 'Low', count: 0, completed: 0, xpEarned: 0 }
    };

    goals?.forEach(goal => {
      const priority = goal.priority || 'medium';
      priorityMap[priority].count++;
      
      if (goal.status === 'completed') {
        priorityMap[priority].completed++;
        // XP based on priority
        priorityMap[priority].xpEarned += priority === 'high' ? 50 : priority === 'medium' ? 30 : 20;
      }
    });

    return Object.values(priorityMap);
  }

  static async getProductivityPatterns(userId: string): Promise<{
    hourlyActivity: Array<{ hour: number; activity: number }>;
    weeklyPattern: Array<{ day: string; activity: number }>;
    bestPerformanceTime: string;
  }> {
    const { data: activities, error } = await supabase
      .from('analytics_metrics')
      .select('created_at, metric_name')
      .eq('user_id', userId)
      .in('metric_name', ['goal_completed', 'progress_updated', 'milestone_completed'])
      .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString());

    if (error) throw error;

    const hourlyMap: Record<number, number> = {};
    const weeklyMap: Record<string, number> = {};
    
    // Initialize
    for (let i = 0; i < 24; i++) hourlyMap[i] = 0;
    ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].forEach(day => weeklyMap[day] = 0);

    activities?.forEach(activity => {
      const date = new Date(activity.created_at);
      const hour = date.getHours();
      const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });
      
      hourlyMap[hour]++;
      weeklyMap[dayName]++;
    });

    const hourlyActivity = Object.entries(hourlyMap).map(([hour, activity]) => ({
      hour: parseInt(hour),
      activity
    }));

    const weeklyPattern = Object.entries(weeklyMap).map(([day, activity]) => ({
      day,
      activity
    }));

    // Find best performance time
    const bestHour = Object.entries(hourlyMap).reduce((max, [hour, activity]) =>
      activity > max.activity ? { hour: parseInt(hour), activity } : max,
      { hour: 0, activity: 0 }
    );

    const bestPerformanceTime = bestHour.hour === 0 ? 'midnight' :
      bestHour.hour < 12 ? `${bestHour.hour}:00 AM` :
      bestHour.hour === 12 ? '12:00 PM' :
      `${bestHour.hour - 12}:00 PM`;

    return {
      hourlyActivity,
      weeklyPattern,
      bestPerformanceTime
    };
  }
}