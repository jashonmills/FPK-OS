import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { CalendarDays, Clock, CheckCircle2, TrendingUp } from 'lucide-react';

interface Assignment {
  id: string;
  course_id: string;
  status: 'not_started' | 'in_progress' | 'completed';
  progress_percentage: number;
  due_at?: string;
  completed_at?: string;
  created_at: string;
}

interface AssignmentStatsProps {
  assignments: Assignment[];
}

export function AssignmentStats({ assignments }: AssignmentStatsProps) {
  const totalAssignments = assignments.length;
  const completedCount = assignments.filter(a => a.status === 'completed').length;
  const inProgressCount = assignments.filter(a => a.status === 'in_progress').length;
  const notStartedCount = assignments.filter(a => a.status === 'not_started').length;

  const completionRate = totalAssignments > 0 ? (completedCount / totalAssignments) * 100 : 0;
  const averageProgress = totalAssignments > 0 
    ? assignments.reduce((sum, a) => sum + a.progress_percentage, 0) / totalAssignments 
    : 0;

  // Calculate assignments due this week
  const now = new Date();
  const weekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
  const dueThisWeek = assignments.filter(a => {
    if (!a.due_at || a.status === 'completed') return false;
    const dueDate = new Date(a.due_at);
    return dueDate >= now && dueDate <= weekFromNow;
  }).length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Assignments</CardTitle>
          <CalendarDays className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalAssignments}</div>
          <div className="text-xs text-muted-foreground mt-1">
            {completedCount} completed, {inProgressCount} in progress
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
          <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{completionRate.toFixed(1)}%</div>
          <Progress value={completionRate} className="mt-2" />
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Average Progress</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{averageProgress.toFixed(1)}%</div>
          <Progress value={averageProgress} className="mt-2" />
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Due This Week</CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{dueThisWeek}</div>
          <div className="text-xs text-muted-foreground mt-1">
            {dueThisWeek === 0 ? 'All caught up!' : 'Stay focused'}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}