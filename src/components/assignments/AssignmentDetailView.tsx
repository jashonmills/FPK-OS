import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { CalendarDays, Clock, CheckCircle2, BookOpen, Play, Target, TrendingUp, AlertCircle } from 'lucide-react';
import { format, formatDistanceToNow } from 'date-fns';

interface Assignment {
  id: string;
  course_id: string;
  course?: {
    title: string;
  };
  status: 'not_started' | 'in_progress' | 'completed';
  progress_percentage: number;
  due_at?: string;
  completed_at?: string;
  started_at?: string;
  created_at: string;
}

interface AssignmentDetailViewProps {
  assignment: Assignment;
}

export function AssignmentDetailView({ assignment }: AssignmentDetailViewProps) {
  const isOverdue = assignment.due_at && new Date(assignment.due_at) < new Date() && assignment.status !== 'completed';
  const daysUntilDue = assignment.due_at 
    ? Math.ceil((new Date(assignment.due_at).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
    : null;

  const getStatusInfo = () => {
    switch (assignment.status) {
      case 'completed':
        return {
          color: 'text-success',
          bgColor: 'bg-success/10',
          icon: <CheckCircle2 className="h-4 w-4" />,
          label: 'Completed'
        };
      case 'in_progress':
        return {
          color: 'text-primary',
          bgColor: 'bg-primary/10',
          icon: <Play className="h-4 w-4" />,
          label: 'In Progress'
        };
      case 'not_started':
        return {
          color: 'text-muted-foreground',
          bgColor: 'bg-muted/50',
          icon: <Target className="h-4 w-4" />,
          label: 'Not Started'
        };
      default:
        return {
          color: 'text-muted-foreground',
          bgColor: 'bg-muted/50',
          icon: <Target className="h-4 w-4" />,
          label: 'Unknown'
        };
    }
  };

  const statusInfo = getStatusInfo();

  return (
    <div className="space-y-6">
      {/* Assignment Overview */}
      <div>
        <h3 className="text-lg font-semibold mb-3">Assignment Overview</h3>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-muted-foreground" />
                <span className="font-medium">{assignment.course?.title || `Course ${assignment.course_id}`}</span>
              </div>
              <Badge className={`${statusInfo.bgColor} ${statusInfo.color} border-current/20`}>
                {statusInfo.icon}
                <span className="ml-1">{statusInfo.label}</span>
              </Badge>
            </div>

            <div className="space-y-3">
              <div>
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-muted-foreground flex items-center gap-1">
                    <TrendingUp className="h-4 w-4" />
                    Progress
                  </span>
                  <span className="font-medium">{assignment.progress_percentage}%</span>
                </div>
                <Progress value={assignment.progress_percentage} className="h-2" />
              </div>

              {assignment.due_at && (
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground flex items-center gap-2">
                    <CalendarDays className="h-4 w-4" />
                    Due Date
                  </span>
                  <span className={isOverdue ? 'text-destructive font-medium' : ''}>
                    {format(new Date(assignment.due_at), 'MMM d, yyyy')}
                  </span>
                </div>
              )}

              {daysUntilDue !== null && assignment.status !== 'completed' && (
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Time Remaining
                  </span>
                  <span className={daysUntilDue < 0 ? 'text-destructive font-medium' : daysUntilDue <= 3 ? 'text-warning font-medium' : ''}>
                    {daysUntilDue < 0 
                      ? `${Math.abs(daysUntilDue)} day${Math.abs(daysUntilDue) !== 1 ? 's' : ''} overdue`
                      : `${daysUntilDue} day${daysUntilDue !== 1 ? 's' : ''} remaining`
                    }
                  </span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Separator />

      {/* Timeline */}
      <div>
        <h3 className="text-lg font-semibold mb-3">Timeline</h3>
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Assigned</span>
                <span>{format(new Date(assignment.created_at), 'MMM d, yyyy')}</span>
              </div>

              {assignment.started_at && (
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Started</span>
                  <span>{format(new Date(assignment.started_at), 'MMM d, yyyy')}</span>
                </div>
              )}

              {assignment.completed_at && (
                <div className="flex items-center justify-between">
                  <span className="text-success">Completed</span>
                  <span className="text-success font-medium">
                    {format(new Date(assignment.completed_at), 'MMM d, yyyy')}
                  </span>
                </div>
              )}

              {assignment.due_at && !assignment.completed_at && (
                <div className="flex items-center justify-between">
                  <span className={isOverdue ? 'text-destructive' : 'text-muted-foreground'}>
                    Due
                  </span>
                  <span className={isOverdue ? 'text-destructive font-medium' : ''}>
                    {format(new Date(assignment.due_at), 'MMM d, yyyy')}
                  </span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Actions */}
      <div>
        <h3 className="text-lg font-semibold mb-3">Actions</h3>
        <div className="flex gap-2">
          <Button asChild className="flex-1">
            <a href={`/courses/${assignment.course_id}`}>
              <BookOpen className="h-4 w-4 mr-2" />
              {assignment.status === 'not_started' ? 'Start Course' : 
               assignment.status === 'completed' ? 'Review Course' : 'Continue Course'}
            </a>
          </Button>
        </div>
      </div>

      {/* Alert for overdue */}
      {isOverdue && (
        <Card className="border-destructive/50 bg-destructive/5">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-destructive">
              <AlertCircle className="h-5 w-5" />
              <span className="font-medium">This assignment is overdue</span>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              Complete it as soon as possible to stay on track with your learning goals.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}