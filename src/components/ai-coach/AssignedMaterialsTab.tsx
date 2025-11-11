import React from 'react';
import { useStudentAssignments, type StudentAssignment } from '@/hooks/useStudentAssignments';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles, Clock, User, FileText, AlertCircle, CheckCircle2, PlayCircle, Users } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';

interface AssignedMaterialsTabProps {
  orgId?: string;
  onStartStudying: (assignment: StudentAssignment) => void;
}

export function AssignedMaterialsTab({ orgId, onStartStudying }: AssignedMaterialsTabProps) {
  const { assignments, isLoading } = useStudentAssignments(orgId);

  // Filter for study materials only
  const materialAssignments = assignments.filter(a => a.type === 'study_material');

  // Categorize assignments
  const pendingAssignments = materialAssignments.filter(a => a.target.status === 'pending');
  const inProgressAssignments = materialAssignments.filter(a => a.target.status === 'started');
  const completedAssignments = materialAssignments.filter(a => a.target.status === 'completed');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'started':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getUrgencyColor = (dueDate?: string) => {
    if (!dueDate) return '';
    const now = new Date();
    const due = new Date(dueDate);
    const daysUntilDue = (due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
    
    if (daysUntilDue < 0) return 'border-red-400 bg-red-50';
    if (daysUntilDue < 2) return 'border-orange-400 bg-orange-50';
    if (daysUntilDue < 7) return 'border-yellow-400 bg-yellow-50';
    return '';
  };

  const renderAssignmentCard = (assignment: StudentAssignment) => {
    const metadata = assignment.metadata || {};
    const instructions = metadata.instructions;
    const dueAt = metadata.due_at;
    const isOverdue = dueAt && new Date(dueAt) < new Date();
    const urgencyColor = getUrgencyColor(dueAt);

    return (
      <Card
        key={assignment.id}
        className={cn(
          'transition-all hover:shadow-md',
          urgencyColor
        )}
      >
        <CardHeader>
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <CardTitle className="text-base truncate">{assignment.title}</CardTitle>
              <CardDescription className="flex items-center gap-2 mt-1">
                <User className="h-3 w-3 flex-shrink-0" />
                <span className="truncate">Assigned by Instructor</span>
                {assignment.groupName && (
                  <>
                    <Users className="h-3 w-3 flex-shrink-0 ml-2" />
                    <span className="truncate">via {assignment.groupName}</span>
                  </>
                )}
              </CardDescription>
            </div>
            <Badge className={getStatusColor(assignment.target.status || 'pending')}>
              {assignment.target.status === 'pending' && 'Not Started'}
              {assignment.target.status === 'started' && 'In Progress'}
              {assignment.target.status === 'completed' && 'Completed'}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-3">
          {/* Material Type */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <FileText className="h-4 w-4" />
            <span>Study Material</span>
          </div>

          {/* Instructions Preview */}
          {instructions && (
            <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">
              <div className="flex items-start gap-2">
                <Sparkles className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-primary mb-1">AI Coaching Instructions</p>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {instructions}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Due Date */}
          {dueAt && (
            <div className={cn(
              "flex items-center gap-2 text-sm",
              isOverdue ? "text-red-600 font-medium" : "text-muted-foreground"
            )}>
              {isOverdue ? (
                <AlertCircle className="h-4 w-4" />
              ) : (
                <Clock className="h-4 w-4" />
              )}
              <span>
                {isOverdue ? 'Overdue' : 'Due'} {formatDistanceToNow(new Date(dueAt), { addSuffix: true })}
              </span>
            </div>
          )}

          {/* Assignment Dates */}
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
            <span>Assigned {formatDistanceToNow(new Date(assignment.target.assigned_at), { addSuffix: true })}</span>
            {assignment.target.started_at && (
              <span>Started {formatDistanceToNow(new Date(assignment.target.started_at), { addSuffix: true })}</span>
            )}
            {assignment.target.completed_at && (
              <span>Completed {formatDistanceToNow(new Date(assignment.target.completed_at), { addSuffix: true })}</span>
            )}
          </div>
        </CardContent>

        <CardFooter>
          <Button
            onClick={() => onStartStudying(assignment)}
            className="w-full"
            variant={assignment.target.status === 'completed' ? 'outline' : 'default'}
          >
            {assignment.target.status === 'completed' ? (
              <>
                <CheckCircle2 className="mr-2 h-4 w-4" />
                Review Again
              </>
            ) : assignment.target.status === 'started' ? (
              <>
                <PlayCircle className="mr-2 h-4 w-4" />
                Continue Studying
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                Start Studying
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-sm text-muted-foreground">Loading assignments...</p>
        </div>
      </div>
    );
  }

  if (materialAssignments.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center max-w-md">
          <FileText className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No Assignments Yet</h3>
          <p className="text-sm text-muted-foreground">
            Your instructor hasn't assigned any study materials yet. Check back later!
          </p>
        </div>
      </div>
    );
  }

  return (
    <ScrollArea className="h-full pr-4">
      <div className="space-y-6 pb-4">
        {/* Pending Assignments */}
        {pendingAssignments.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-yellow-600" />
              Not Started ({pendingAssignments.length})
            </h3>
            <div className="grid gap-3">
              {pendingAssignments.map(renderAssignmentCard)}
            </div>
          </div>
        )}

        {/* In Progress Assignments */}
        {inProgressAssignments.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
              <PlayCircle className="h-4 w-4 text-blue-600" />
              In Progress ({inProgressAssignments.length})
            </h3>
            <div className="grid gap-3">
              {inProgressAssignments.map(renderAssignmentCard)}
            </div>
          </div>
        )}

        {/* Completed Assignments */}
        {completedAssignments.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              Completed ({completedAssignments.length})
            </h3>
            <div className="grid gap-3">
              {completedAssignments.map(renderAssignmentCard)}
            </div>
          </div>
        )}
      </div>
    </ScrollArea>
  );
}
