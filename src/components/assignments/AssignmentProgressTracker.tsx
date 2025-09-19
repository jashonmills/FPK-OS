import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useAssignmentActions } from '@/hooks/useAssignmentActions';
import { CheckCircle2, Clock, Target, TrendingUp, AlertTriangle } from 'lucide-react';

interface AssignmentProgressTrackerProps {
  assignmentId: string;
  currentProgress: number;
  status: 'not_started' | 'in_progress' | 'completed';
  dueDate?: string;
  courseId: string;
}

export function AssignmentProgressTracker({ 
  assignmentId, 
  currentProgress, 
  status, 
  dueDate,
  courseId 
}: AssignmentProgressTrackerProps) {
  const { completeAssignment, updateAssignmentProgress, isCompleting, isUpdatingProgress } = useAssignmentActions();

  const isOverdue = dueDate && new Date(dueDate) < new Date() && status !== 'completed';
  const canComplete = currentProgress >= 100 && status === 'in_progress';

  const handleComplete = () => {
    if (canComplete) {
      completeAssignment(assignmentId);
    }
  };

  const getStatusBadge = () => {
    if (status === 'completed') {
      return (
        <Badge className="bg-success/10 text-success border-success/20">
          <CheckCircle2 className="h-3 w-3 mr-1" />
          Completed
        </Badge>
      );
    }

    if (isOverdue) {
      return (
        <Badge variant="destructive">
          <AlertTriangle className="h-3 w-3 mr-1" />
          Overdue
        </Badge>
      );
    }

    if (status === 'in_progress') {
      return (
        <Badge className="bg-primary/10 text-primary border-primary/20">
          <Clock className="h-3 w-3 mr-1" />
          In Progress
        </Badge>
      );
    }

    return (
      <Badge variant="outline">
        <Target className="h-3 w-3 mr-1" />
        Not Started
      </Badge>
    );
  };

  return (
    <Card className={isOverdue ? 'border-destructive/50' : ''}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Assignment Progress
          </CardTitle>
          {getStatusBadge()}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-medium">{currentProgress}%</span>
          </div>
          <Progress 
            value={currentProgress} 
            className={`h-3 ${isOverdue && status !== 'completed' ? 'bg-destructive/20' : ''}`}
          />
        </div>

        {dueDate && status !== 'completed' && (
          <div className="text-sm">
            <span className="text-muted-foreground">Due: </span>
            <span className={isOverdue ? 'text-destructive font-medium' : ''}>
              {new Date(dueDate).toLocaleDateString()}
            </span>
          </div>
        )}

        <div className="flex gap-2">
          <Button asChild variant="outline" className="flex-1">
            <a href={`/courses/${courseId}`}>
              Continue Course
            </a>
          </Button>

          {canComplete && (
            <Button 
              onClick={handleComplete} 
              disabled={isCompleting}
              className="bg-success hover:bg-success/90"
            >
              <CheckCircle2 className="h-4 w-4 mr-2" />
              Complete
            </Button>
          )}
        </div>

        {status === 'completed' && (
          <div className="text-center text-sm text-success">
            🎉 Great job! You completed this assignment.
          </div>
        )}

        {isOverdue && status !== 'completed' && (
          <div className="text-center text-sm text-destructive">
            ⚠️ This assignment is overdue. Complete it as soon as possible.
          </div>
        )}
      </CardContent>
    </Card>
  );
}