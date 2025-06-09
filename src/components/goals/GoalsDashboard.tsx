
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Target,
  TrendingUp,
  Calendar,
  CheckCircle,
  Clock,
  Pause,
  Filter
} from 'lucide-react';
import { useGoals } from '@/hooks/useGoals';
import GoalCreateForm from './GoalCreateForm';
import GoalCard from './GoalCard';
import DualLanguageText from '@/components/DualLanguageText';

const GoalsDashboard = () => {
  const { goals, loading, updateGoal, completeGoal, deleteGoal } = useGoals();
  const [filter, setFilter] = useState('all');

  const activeGoals = goals.filter(goal => goal.status === 'active');
  const completedGoals = goals.filter(goal => goal.status === 'completed');
  const pausedGoals = goals.filter(goal => goal.status === 'paused');

  const getFilteredGoals = () => {
    switch (filter) {
      case 'active':
        return activeGoals;
      case 'completed':
        return completedGoals;
      case 'paused':
        return pausedGoals;
      default:
        return goals;
    }
  };

  const getOverdueGoals = () => {
    return activeGoals.filter(goal => 
      goal.target_date && new Date(goal.target_date) < new Date()
    );
  };

  const getCompletionRate = () => {
    if (goals.length === 0) return 0;
    return Math.round((completedGoals.length / goals.length) * 100);
  };

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center">
        <div className="text-gray-500">Loading your goals...</div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            My Goals
          </h1>
          <p className="text-gray-600">
            Track your progress and achieve your dreams, one step at a time
          </p>
        </div>
        <GoalCreateForm />
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="fpk-card border-0 shadow-md">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Target className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Goals</p>
                <p className="text-xl font-bold">{goals.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="fpk-card border-0 shadow-md">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-600" />
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
                <TrendingUp className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Completion Rate</p>
                <p className="text-xl font-bold">{getCompletionRate()}%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="fpk-card border-0 shadow-md">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-100 rounded-lg">
                <Clock className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Active Goals</p>
                <p className="text-xl font-bold">{activeGoals.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Overdue Goals Alert */}
      {getOverdueGoals().length > 0 && (
        <Card className="border-amber-200 bg-amber-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Calendar className="h-5 w-5 text-amber-600" />
              <div>
                <p className="font-medium text-amber-800">
                  You have {getOverdueGoals().length} overdue goal{getOverdueGoals().length !== 1 ? 's' : ''}
                </p>
                <p className="text-sm text-amber-700">
                  Consider updating your target dates or breaking them into smaller steps
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Goals List */}
      <Card className="fpk-card border-0 shadow-lg">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-purple-600" />
              Your Goals
            </CardTitle>
            <div className="flex gap-2">
              <Button
                variant={filter === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilter('all')}
              >
                All ({goals.length})
              </Button>
              <Button
                variant={filter === 'active' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilter('active')}
              >
                Active ({activeGoals.length})
              </Button>
              <Button
                variant={filter === 'completed' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilter('completed')}
              >
                Completed ({completedGoals.length})
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {getFilteredGoals().length === 0 ? (
            <div className="text-center py-12">
              <Target className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {filter === 'all' ? 'No goals yet' : `No ${filter} goals`}
              </h3>
              <p className="text-gray-600 mb-6">
                {filter === 'all' 
                  ? 'Create your first goal to start your journey!'
                  : `You don't have any ${filter} goals at the moment.`
                }
              </p>
              {filter === 'all' && <GoalCreateForm />}
            </div>
          ) : (
            <div className="grid gap-4">
              {getFilteredGoals().map((goal) => (
                <GoalCard
                  key={goal.id}
                  goal={goal}
                  onComplete={completeGoal}
                  onUpdate={updateGoal}
                  onDelete={deleteGoal}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default GoalsDashboard;
