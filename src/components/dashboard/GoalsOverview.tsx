
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useGoals } from '@/hooks/useGoals';
import { Target, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const GoalsOverview = () => {
  const { goals, loading } = useGoals();
  const navigate = useNavigate();

  const activeGoals = goals.filter(goal => goal.status === 'active').slice(0, 3);

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
            <div className="space-y-3">
              {[1, 2, 3].map(i => (
                <div key={i}>
                  <div className="h-3 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-2 bg-gray-200 rounded"></div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (activeGoals.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-blue-600" />
            Your Goals
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Target className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-semibold mb-2">No active goals</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Set learning goals to track your progress and stay motivated
            </p>
            <Button onClick={() => navigate('/dashboard/goals')}>
              <Plus className="h-4 w-4 mr-2" />
              Create Your First Goal
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Target className="h-5 w-5 text-blue-600" />
            Your Goals
          </div>
          <Button variant="outline" size="sm" onClick={() => navigate('/dashboard/goals')}>
            View All
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activeGoals.map((goal) => (
            <div key={goal.id} className="space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">{goal.title}</h4>
                <Badge variant="secondary">{goal.category}</Badge>
              </div>
              <Progress value={goal.progress} className="h-2" />
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>{goal.progress}% complete</span>
                {goal.target_date && (
                  <span>Due: {new Date(goal.target_date).toLocaleDateString()}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default GoalsOverview;
