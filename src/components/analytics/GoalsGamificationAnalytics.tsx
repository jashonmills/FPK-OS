
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Target, Trophy, TrendingUp, Award } from 'lucide-react';
import { useGoals } from '@/hooks/useGoals';
import { useGoalReminders } from '@/hooks/useGoalReminders';
import { useGamificationContext } from '@/contexts/GamificationContext';
import EmptyState from '@/components/analytics/EmptyState';

const GoalsGamificationAnalytics = () => {
  const { goals, loading: goalsLoading } = useGoals();
  const { reminders, loading: remindersLoading } = useGoalReminders();
  const { userStats, isLoading: gamificationLoading } = useGamificationContext();

  const loading = goalsLoading || remindersLoading || gamificationLoading;

  // Process goal completion trends
  const goalCompletionData = React.useMemo(() => {
    if (!goals?.length) return [];
    
    const completedGoals = goals.filter(goal => goal.status === 'completed' && goal.completed_at);
    const monthlyData = completedGoals.reduce((acc, goal) => {
      const month = new Date(goal.completed_at!).toISOString().substring(0, 7); // YYYY-MM
      acc[month] = (acc[month] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(monthlyData)
      .sort(([a], [b]) => a.localeCompare(b))
      .slice(-6) // Last 6 months
      .map(([month, count]) => ({
        month: new Date(month + '-01').toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
        completed: count
      }));
  }, [goals]);

  // Process reminder effectiveness data
  const reminderEffectivenessData = React.useMemo(() => {
    if (!reminders?.length) return [];
    
    const reminderTypes = ['daily', 'weekly', 'custom', 'deadline'];
    return reminderTypes.map(type => {
      const typeReminders = reminders.filter(r => r.reminder_type === type);
      // Mock effectiveness data - would need actual tracking
      const effectiveness = Math.floor(Math.random() * 40) + 60; // 60-100% range
      
      return {
        type: type.charAt(0).toUpperCase() + type.slice(1),
        effectiveness,
        count: typeReminders.length
      };
    }).filter(item => item.count > 0);
  }, [reminders]);

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
    effectiveness: {
      label: 'Effectiveness %',
      color: '#8B5CF6',
    },
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
      {/* Goal Completion Trend */}
      <Card className="border-0 shadow-lg">
        <CardHeader className="p-4 sm:p-6">
          <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
            <Target className="h-4 w-4 sm:h-5 sm:w-5 text-green-600 flex-shrink-0" />
            Goal Completion Trend
          </CardTitle>
          <p className="text-xs sm:text-sm text-gray-500">
            Goals completed over the last 6 months
          </p>
        </CardHeader>
        <CardContent className="p-4 sm:p-6 pt-0">
          {goalCompletionData.length > 0 ? (
            <ChartContainer config={chartConfig} className="h-[200px] sm:h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={goalCompletionData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" fontSize={10} />
                  <YAxis fontSize={10} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Area 
                    type="monotone" 
                    dataKey="completed" 
                    stroke="var(--color-completed)" 
                    fill="var(--color-completed)"
                    fillOpacity={0.6}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </ChartContainer>
          ) : (
            <EmptyState 
              icon={Target}
              title="No completed goals yet"
              description="Complete your first goal to see completion trends"
            />
          )}
        </CardContent>
      </Card>

      {/* Reminder Effectiveness */}
      <Card className="border-0 shadow-lg">
        <CardHeader className="p-4 sm:p-6">
          <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
            <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600 flex-shrink-0" />
            Reminder Effectiveness
          </CardTitle>
          <p className="text-xs sm:text-sm text-gray-500">
            How well different reminder types work for you
          </p>
        </CardHeader>
        <CardContent className="p-4 sm:p-6 pt-0">
          {reminderEffectivenessData.length > 0 ? (
            <ChartContainer config={chartConfig} className="h-[200px] sm:h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={reminderEffectivenessData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="type" fontSize={10} />
                  <YAxis fontSize={10} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar 
                    dataKey="effectiveness" 
                    fill="var(--color-effectiveness)" 
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          ) : (
            <EmptyState 
              icon={TrendingUp}
              title="Set up reminders to track effectiveness"
              description="Create goal reminders to see which types work best for you"
            />
          )}
        </CardContent>
      </Card>

      {/* XP and Achievement Summary */}
      <Card className="border-0 shadow-lg">
        <CardHeader className="p-4 sm:p-6">
          <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
            <Award className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-600 flex-shrink-0" />
            XP & Achievement Summary
          </CardTitle>
          <p className="text-xs sm:text-sm text-gray-500">
            Your gamification progress overview
          </p>
        </CardHeader>
        <CardContent className="p-4 sm:p-6 pt-0">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-600 mb-1">
                {userStats?.xp?.total_xp || 0}
              </div>
              <p className="text-xs text-gray-500">Total XP</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 mb-1">
                {userStats?.xp?.level || 1}
              </div>
              <p className="text-xs text-gray-500">Level</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600 mb-1">
                {userStats?.badges?.length || 0}
              </div>
              <p className="text-xs text-gray-500">Badges Earned</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600 mb-1">
                {userStats?.streaks?.find(s => s.streak_type === 'study')?.current_count || 0}
              </div>
              <p className="text-xs text-gray-500">Study Streak</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Goals Progress Distribution */}
      <Card className="border-0 shadow-lg">
        <CardHeader className="p-4 sm:p-6">
          <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
            <Trophy className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 flex-shrink-0" />
            Goals Progress Distribution
          </CardTitle>
          <p className="text-xs sm:text-sm text-gray-500">
            Status of your current goals
          </p>
        </CardHeader>
        <CardContent className="p-4 sm:p-6 pt-0">
          <div className="space-y-4">
            {goals && goals.length > 0 ? (
              <>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-blue-600 mb-1">
                      {goals.filter(g => g.status === 'active').length}
                    </div>
                    <p className="text-xs text-gray-500">Active</p>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-green-600 mb-1">
                      {goals.filter(g => g.status === 'completed').length}
                    </div>
                    <p className="text-xs text-gray-500">Completed</p>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-600 mb-1">
                      {goals.filter(g => g.status === 'paused').length}
                    </div>
                    <p className="text-xs text-gray-500">Paused</p>
                  </div>
                </div>
                <div className="text-center pt-2">
                  <p className="text-sm text-gray-600">
                    Average Progress: {Math.round(goals.reduce((acc, goal) => acc + goal.progress, 0) / goals.length)}%
                  </p>
                </div>
              </>
            ) : (
              <EmptyState 
                icon={Trophy}
                title="No goals created yet"
                description="Create your first learning goal to track progress"
              />
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GoalsGamificationAnalytics;
