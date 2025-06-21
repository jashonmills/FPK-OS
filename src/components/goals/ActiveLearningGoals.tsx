
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BookOpen, Clock, Target, TrendingUp } from 'lucide-react';
import { useGoals } from '@/hooks/useGoals';

const ActiveLearningGoals = () => {
  const { goals = [] } = useGoals();
  
  // Filter for active learning-specific goals
  const learningGoals = goals.filter(goal => 
    goal?.status === 'active' && 
    (goal?.category === 'learning' || goal?.category === 'reading' || goal?.category === 'study')
  ) || [];

  if (learningGoals.length === 0) {
    return (
      <Card className="fpk-card border-0 shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-green-600" />
            Active Learning Goals
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6">
            <BookOpen className="h-12 w-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 mb-4">No active learning goals</p>
            <Button size="sm" className="fpk-gradient text-white">
              Create Learning Goal
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="fpk-card border-0 shadow-md">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-green-600" />
            Active Learning Goals
          </div>
          <Badge variant="secondary">{learningGoals.length} active</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {learningGoals.slice(0, 3).map((goal) => (
            <div key={goal.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h4 className="font-medium text-sm mb-1">{goal.title}</h4>
                  <p className="text-xs text-gray-500 mb-2">{goal.description}</p>
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <div className="flex items-center gap-1">
                      <Target className="h-3 w-3" />
                      <span className="capitalize">{goal.priority} priority</span>
                    </div>
                    {goal.target_date && (
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>Due {new Date(goal.target_date).toLocaleDateString()}</span>
                      </div>
                    )}
                  </div>
                </div>
                <Badge 
                  variant="outline" 
                  className={`
                    ${goal.progress >= 75 ? 'border-green-500 text-green-700' : 
                      goal.progress >= 50 ? 'border-yellow-500 text-yellow-700' : 
                      'border-gray-500 text-gray-700'}
                  `}
                >
                  {Math.round(goal.progress || 0)}%
                </Badge>
              </div>
              
              <div className="space-y-2">
                <Progress value={goal.progress || 0} className="h-2" />
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500">
                    {Math.round(goal.progress || 0)}% complete
                  </span>
                  <div className="flex items-center gap-1 text-xs text-green-600">
                    <TrendingUp className="h-3 w-3" />
                    <span>On track</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          {learningGoals.length > 3 && (
            <Button variant="outline" size="sm" className="w-full">
              View All Learning Goals ({learningGoals.length})
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ActiveLearningGoals;
