import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { supabase } from '@/integrations/supabase/client';
import { Target, TrendingUp, Users, Award } from 'lucide-react';

const AdminGoalsAnalytics = () => {
  const { data: goalsStats, isLoading } = useQuery({
    queryKey: ['admin-goals-analytics'],
    queryFn: async () => {
      // Mock data since we don't have goals tables yet
      // In a real implementation, you would query actual goals data
      return {
        totalGoals: 156,
        completedGoals: 89,
        activeUsers: 42,
        completionRate: 57,
        goalCategories: [
          { category: 'Study Time', count: 45, completed: 28 },
          { category: 'Course Completion', count: 38, completed: 22 },
          { category: 'Reading Hours', count: 32, completed: 18 },
          { category: 'Exercise Sessions', count: 24, completed: 15 },
          { category: 'Skill Development', count: 17, completed: 6 }
        ]
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
            {goalsStats?.goalCategories?.map((category: any) => {
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
            <CardTitle>Completion Insights</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                <span className="font-medium">High Performers</span>
                <span className="text-green-600 font-bold">12 users</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg">
                <span className="font-medium">At Risk</span>
                <span className="text-yellow-600 font-bold">8 users</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                <span className="font-medium">Inactive</span>
                <span className="text-red-600 font-bold">5 users</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Trending Goals</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">📚 Complete 5 courses</span>
                <span className="text-sm font-semibold">23 users</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">⏰ Study 30 min daily</span>
                <span className="text-sm font-semibold">19 users</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">📖 Read 2 books/month</span>
                <span className="text-sm font-semibold">15 users</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">🎯 90% course completion</span>
                <span className="text-sm font-semibold">12 users</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminGoalsAnalytics;