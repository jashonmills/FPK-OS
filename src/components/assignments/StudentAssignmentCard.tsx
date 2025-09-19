import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { BookOpen, Calendar, Clock, CheckCircle2, PlayCircle, AlertCircle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import type { StudentAssignment } from '@/hooks/useStudentAssignments';

interface StudentAssignmentCardProps {
  assignment: StudentAssignment;
  onStart?: (assignmentId: string) => void;
  onContinue?: (assignmentId: string) => void;
}

export function StudentAssignmentCard({ 
  assignment, 
  onStart, 
  onContinue 
}: StudentAssignmentCardProps) {
  const { target, metadata } = assignment;
  const dueDate = metadata?.due_date ? new Date(metadata.due_date) : null;
  const isOverdue = dueDate && dueDate < new Date() && target.status !== 'completed';
  
  const getStatusIcon = () => {
    switch (target.status) {
      case 'completed':
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case 'started':
        return <PlayCircle className="h-4 w-4 text-blue-500" />;
      case 'pending':
      default:
        return <Clock className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getStatusBadge = () => {
    if (isOverdue) {
      return <Badge variant="destructive" className="gap-1">
        <AlertCircle className="h-3 w-3" />
        Overdue
      </Badge>;
    }
    
    switch (target.status) {
      case 'completed':
        return <Badge variant="default" className="gap-1 bg-green-500">
          <CheckCircle2 className="h-3 w-3" />
          Completed
        </Badge>;
      case 'started':
        return <Badge variant="default" className="gap-1 bg-blue-500">
          <PlayCircle className="h-3 w-3" />
          In Progress
        </Badge>;
      case 'pending':
      default:
        return <Badge variant="secondary" className="gap-1">
          <Clock className="h-3 w-3" />
          Not Started
        </Badge>;
    }
  };

  const getActionButton = () => {
    switch (target.status) {
      case 'completed':
        return (
          <Button variant="outline" size="sm" disabled>
            <CheckCircle2 className="h-4 w-4 mr-2" />
            Completed
          </Button>
        );
      case 'started':
        return (
          <Button 
            onClick={() => onContinue?.(assignment.id)}
            size="sm"
            className="gap-2"
          >
            <PlayCircle className="h-4 w-4" />
            Continue
          </Button>
        );
      case 'pending':
      default:
        return (
          <Button 
            onClick={() => onStart?.(assignment.id)}
            size="sm"
            className="gap-2"
          >
            <PlayCircle className="h-4 w-4" />
            Start Assignment
          </Button>
        );
    }
  };

  return (
    <Card className={`transition-all hover:shadow-md ${isOverdue ? 'border-destructive' : ''}`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-lg flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              {assignment.title}
            </CardTitle>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span>Course Assignment</span>
              <span>•</span>
              <span>Assigned {formatDistanceToNow(new Date(target.assigned_at), { addSuffix: true })}</span>
            </div>
          </div>
          {getStatusBadge()}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Due Date */}
        {dueDate && (
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="h-4 w-4" />
            <span className={isOverdue ? 'text-destructive font-medium' : ''}>
              Due {formatDistanceToNow(dueDate, { addSuffix: true })}
            </span>
          </div>
        )}

        {/* Instructions */}
        {metadata?.instructions && (
          <div className="bg-muted/30 p-3 rounded-lg">
            <p className="text-sm">{metadata.instructions}</p>
          </div>
        )}

        {/* Progress for started assignments */}
        {target.status === 'started' && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progress</span>
              <span>45%</span> {/* This would come from actual progress data */}
            </div>
            <Progress value={45} className="h-2" />
          </div>
        )}

        {/* Action Button */}
        <div className="flex justify-between items-center pt-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            {getStatusIcon()}
            <span className="capitalize">{target.status || 'pending'}</span>
          </div>
          {getActionButton()}
        </div>

        {/* Required Badge */}
        {metadata?.required && (
          <div className="pt-2">
            <Badge variant="outline" className="text-xs">
              Required Assignment
            </Badge>
          </div>
        )}
      </CardContent>
    </Card>
  );
}