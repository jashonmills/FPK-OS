
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Target, Trophy, Calendar } from 'lucide-react';
import { useGoals } from '@/hooks/useGoals';

const SimpleGoalsOverview = () => {
  const { goals = [], loading } = useGoals();

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  // Safe filtering with comprehensive null checks
  const activeGoals = goals?.filter(goal => goal?.status === 'active') || [];
  const completedGoals = goals?.filter(goal => goal?.status === 'completed') || [];
  const totalGoals = goals?.length || 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <Card className="fpk-card border-0 shadow-md">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Target className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Goals</p>
              <p className="text-xl font-bold">{totalGoals}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="fpk-card border-0 shadow-md">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <Target className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Active</p>
              <p className="text-xl font-bold">{activeGoals.length}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="fpk-card border-0 shadow-md">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-100 rounded-lg">
              <Trophy className="h-5 w-5 text-amber-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Completed</p>
              <p className="text-xl font-bold">{completedGoals.length}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="fpk-card border-0 shadow-md">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Calendar className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Success Rate</p>
              <p className="text-xl font-bold">
                {totalGoals > 0 ? Math.round((completedGoals.length / totalGoals) * 100) : 0}%
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SimpleGoalsOverview;
