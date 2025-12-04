import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { supabase } from '@/integrations/supabase/client';
import { Target, TrendingUp, Users, Award } from 'lucide-react';

interface GoalCategoryStats {
  category: string;
  count: number;
  completed: number;
}

interface UserPerformance {
  total: number;
  completed: number;
}

interface TopGoal {
  title: string;
  count: number;
}

const AdminGoalsAnalytics = () => {
  const { data: goalsStats, isLoading } = useQuery({
    queryKey: ['admin-goals-analytics'],
    queryFn: async () => {
      const { data: goals, error } = await supabase
        .from('goals')
        .select('*');

      if (error) throw error;

      const totalGoals = goals?.length || 0;
      const completedGoals = goals?.filter(g => g.status === 'completed').length || 0;
      const uniqueUsers = new Set(goals?.map(g => g.user_id) || []).size;
      const completionRate = totalGoals > 0 ? Math.round((completedGoals / totalGoals) * 100) : 0;

interface GoalCategoryStats {
  category: string;
  count: number;
  completed: number;
}

interface UserPerformance {
  total: number;
  completed: number;
}

      // Group by category for breakdown
      const categoryStats = goals?.reduce((acc: Record<string, GoalCategoryStats>, goal) => {
        const category = goal.category || 'Other';
        if (!acc[category]) {
          acc[category] = { category, count: 0, completed: 0 };
        }
        acc[category].count++;
        if (goal.status === 'completed') {
          acc[category].completed++;
        }
        return acc;
      }, {}) || {};

      const goalCategories = Object.values(categoryStats)
        .sort((a: GoalCategoryStats, b: GoalCategoryStats) => b.count - a.count)
        .slice(0, 5);

      // Calculate user performance insights
      const userPerformance = goals?.reduce((acc: Record<string, UserPerformance>, goal) => {
        const userId = goal.user_id;
        if (!acc[userId]) {
          acc[userId] = { total: 0, completed: 0 };
        }
        acc[userId].total++;
        if (goal.status === 'completed') {
          acc[userId].completed++;
        }
        return acc;
      }, {}) || {};

      const performanceCategories = Object.values(userPerformance).map((user: UserPerformance) => {
        const rate = user.total > 0 ? (user.completed / user.total) * 100 : 0;
        return rate;
      });

      const highPerformers = performanceCategories.filter(rate => rate >= 75).length;
      const atRisk = performanceCategories.filter(rate => rate >= 25 && rate < 75).length;
      const inactive = performanceCategories.filter(rate => rate < 25).length;

      // Get top goals by title frequency
      const goalTitles = goals?.reduce((acc: Record<string, number>, goal) => {
        const title = goal.title || 'Untitled Goal';
        acc[title] = (acc[title] || 0) + 1;
        return acc;
      }, {}) || {};

      const topGoals = Object.entries(goalTitles)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 4)
        .map(([title, count]) => ({ title, count }));

      return {
        totalGoals,
        completedGoals,
        activeUsers: uniqueUsers,
        completionRate,
        goalCategories,
        performanceInsights: {
          highPerformers,
          atRisk,
          inactive
        },
        topGoals
      };
    }
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="animate-pulse space-y-3">
                  <div className="h-4 bg-muted rounded w-3/4"></div>
                  <div className="h-8 bg-muted rounded w-1/2"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Platform Goals Analytics</h2>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Target className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Total Goals</p>
                <p className="text-2xl font-bold">{goalsStats?.totalGoals || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Award className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Completed Goals</p>
                <p className="text-2xl font-bold">{goalsStats?.completedGoals || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Users with Goals</p>
                <p className="text-2xl font-bold">{goalsStats?.activeUsers || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <TrendingUp className="h-8 w-8 text-orange-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Completion Rate</p>
                <p className="text-2xl font-bold">{goalsStats?.completionRate || 0}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Goal Categories Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Goal Categories Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {goalsStats?.goalCategories?.map((category: GoalCategoryStats) => {
              const completionPercentage = Math.round((category.completed / category.count) * 100);
              return (
                <div key={category.category}>
                  <div className="flex justify-between items-center mb-2">
                    <div>
                      <p className="font-semibold">{category.category}</p>
                      <p className="text-sm text-muted-foreground">
                        {category.completed} of {category.count} completed
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-primary">{completionPercentage}%</p>
                    </div>
                  </div>
                  <Progress value={completionPercentage} className="h-3" />
                </div>
              );
            }) || (
              <p className="text-center text-muted-foreground py-8">
                No goals data available yet
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Goals Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>User Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                <span className="font-medium">High Performers (≥75%)</span>
                <span className="text-green-600 font-bold">{goalsStats?.performanceInsights?.highPerformers || 0} users</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg">
                <span className="font-medium">At Risk (25-74%)</span>
                <span className="text-yellow-600 font-bold">{goalsStats?.performanceInsights?.atRisk || 0} users</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                <span className="font-medium">Low Activity (&lt;25%)</span>
                <span className="text-red-600 font-bold">{goalsStats?.performanceInsights?.inactive || 0} users</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Most Popular Goals</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {goalsStats?.topGoals?.map((goal: TopGoal, index: number) => (
                <div key={goal.title} className="flex items-center justify-between">
                  <span className="text-sm">{goal.title}</span>
                  <span className="text-sm font-semibold">{goal.count} users</span>
                </div>
              )) || (
                <p className="text-center text-muted-foreground py-4">
                  No goal data available yet
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminGoalsAnalytics;