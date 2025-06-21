
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Target, Trophy, Star, TrendingUp } from 'lucide-react';
import { useGoals } from '@/hooks/useGoals';
import { useUserProfile } from '@/hooks/useUserProfile';
import { useXPProgression } from '@/hooks/useXPProgression';
import EmptyState from '@/components/analytics/EmptyState';

const GoalsGamificationAnalytics = () => {
  const { goals, loading: goalsLoading } = useGoals();
  const { profile, loading: profileLoading } = useUserProfile();
  const { data: xpProgressionData, loading: xpLoading } = useXPProgression();

  const loading = goalsLoading || profileLoading;

  // Process goal completion trends
  const goalCompletionData = React.useMemo(() => {
    if (!goals?.length) return [];
    
    const completedGoals = goals.filter(goal => goal.status === 'completed');
    const monthlyData = completedGoals.reduce((acc, goal) => {
      if (goal.completed_at) {
        const month = new Date(goal.completed_at).toISOString().slice(0, 7);
        acc[month] = (acc[month] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(monthlyData)
      .sort(([a], [b]) => a.localeCompare(b))
      .slice(-6) // Last 6 months
      .map(([month, count]) => ({
        month: new Date(month + '-01').toLocaleDateString('en-US', { month: 'short', year: '2-digit' }),
        completed: count
      }));
  }, [goals]);

  // Process goal categories
  const goalCategoriesData = React.useMemo(() => {
    if (!goals?.length) return [];
    
    const categories = goals.reduce((acc, goal) => {
      const category = goal.category;
      if (!acc[category]) {
        acc[category] = { total: 0, completed: 0 };
      }
      acc[category].total += 1;
      if (goal.status === 'completed') {
        acc[category].completed += 1;
      }
      return acc;
    }, {} as Record<string, { total: number; completed: number }>);

    return Object.entries(categories).map(([category, stats]) => ({
      category: category.charAt(0).toUpperCase() + category.slice(1),
      total: stats.total,
      completed: stats.completed,
      completionRate: Math.round((stats.completed / stats.total) * 100)
    }));
  }, [goals]);

  if (loading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="border-0 shadow-lg">
            <CardContent className="p-4 sm:p-6">
              <div className="animate-pulse space-y-4">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-32 bg-gray-200 rounded"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const chartConfig = {
    completed: {
      label: 'Goals Completed',
      color: '#10B981',
    },
    total: {
      label: 'Total Goals',
      color: '#8B5CF6',
    },
    xp: {
      label: 'XP Earned',
      color: '#F59E0B',
    },
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
      {/* Goal Completion Trends */}
      <Card className="border-0 shadow-lg">
        <CardHeader className="p-4 sm:p-6">
          <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
            <Target className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 flex-shrink-0" />
            Goal Completion Trends
          </CardTitle>
          <p className="text-xs sm:text-sm text-gray-500">
            Monthly goal completion progress
          </p>
        </CardHeader>
        <CardContent className="p-4 sm:p-6 pt-0">
          {goalCompletionData.length > 0 ? (
            <ChartContainer config={chartConfig} className="h-[200px] sm:h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={goalCompletionData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" fontSize={10} />
                  <YAxis fontSize={10} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line 
                    type="monotone" 
                    dataKey="completed" 
                    stroke="var(--color-completed)" 
                    strokeWidth={2}
                    dot={{ r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          ) : (
            <EmptyState 
              icon={Target}
              title="No completed goals yet"
              description="Set and complete goals to see your progress trends"
            />
          )}
        </CardContent>
      </Card>

      {/* Goal Categories Performance */}
      <Card className="border-0 shadow-lg">
        <CardHeader className="p-4 sm:p-6">
          <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
            <Trophy className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-600 flex-shrink-0" />
            Goal Categories Performance
          </CardTitle>
          <p className="text-xs sm:text-sm text-gray-500">
            Success rate by goal category
          </p>
        </CardHeader>
        <CardContent className="p-4 sm:p-6 pt-0">
          {goalCategoriesData.length > 0 ? (
            <ChartContainer config={chartConfig} className="h-[200px] sm:h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={goalCategoriesData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="category" fontSize={10} />
                  <YAxis fontSize={10} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="total" fill="var(--color-total)" radius={[2, 2, 0, 0]} />
                  <Bar dataKey="completed" fill="var(--color-completed)" radius={[2, 2, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          ) : (
            <EmptyState 
              icon={Trophy}
              title="No goals set yet"
              description="Create goals in different categories to see performance analytics"
            />
          )}
        </CardContent>
      </Card>

      {/* XP & Level Progression */}
      <Card className="border-0 shadow-lg">
        <CardHeader className="p-4 sm:p-6">
          <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
            <Star className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600 flex-shrink-0" />
            XP & Level Progression
          </CardTitle>
          <p className="text-xs sm:text-sm text-gray-500">
            Experience points earned over time
          </p>
        </CardHeader>
        <CardContent className="p-4 sm:p-6 pt-0">
          {!xpLoading && xpProgressionData.length > 0 ? (
            <ChartContainer config={chartConfig} className="h-[200px] sm:h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={xpProgressionData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="week" fontSize={10} />
                  <YAxis fontSize={10} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line 
                    type="monotone" 
                    dataKey="xp" 
                    stroke="var(--color-xp)" 
                    strokeWidth={2}
                    dot={{ r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          ) : (
            <EmptyState 
              icon={Star}
              title="No XP progression data"
              description="Complete activities to earn XP and see your progression"
            />
          )}
        </CardContent>
      </Card>

      {/* Gamification Summary */}
      <Card className="border-0 shadow-lg">
        <CardHeader className="p-4 sm:p-6">
          <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
            <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-green-600 flex-shrink-0" />
            Gamification Summary
          </CardTitle>
          <p className="text-xs sm:text-sm text-gray-500">
            Your achievement and progress metrics
          </p>
        </CardHeader>
        <CardContent className="p-4 sm:p-6 pt-0">
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-purple-600 mb-1">
                {profile?.total_xp || 0}
              </div>
              <p className="text-xs text-gray-500">Total XP</p>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-600 mb-1">
                {goals?.filter(g => g.status === 'completed').length || 0}
              </div>
              <p className="text-xs text-gray-500">Goals Completed</p>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600 mb-1">
                {profile?.current_streak || 0}
              </div>
              <p className="text-xs text-gray-500">Current Streak</p>
            </div>
            <div>
              <div className="text-2xl font-bold text-yellow-600 mb-1">
                {goals?.filter(g => g.status === 'active').length || 0}
              </div>
              <p className="text-xs text-gray-500">Active Goals</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GoalsGamificationAnalytics;
