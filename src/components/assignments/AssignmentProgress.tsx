import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, CheckCircle2, Clock, PlayCircle } from 'lucide-react';
import type { AssignmentTargetCount } from '@/hooks/useAssignmentTargetCounts';

interface AssignmentProgressProps {
  assignment: {
    id: string;
    title: string;
    created_at: string;
  };
  targetCounts: AssignmentTargetCount;
}

export function AssignmentProgress({ assignment, targetCounts }: AssignmentProgressProps) {
  const completionRate = targetCounts.total_targets > 0 
    ? Math.round((targetCounts.completed_count / targetCounts.total_targets) * 100)
    : 0;

  const progressRate = targetCounts.total_targets > 0 
    ? Math.round(((targetCounts.completed_count + targetCounts.started_count) / targetCounts.total_targets) * 100)
    : 0;

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">{assignment.title}</CardTitle>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Users className="h-4 w-4" />
          <span>{targetCounts.total_targets} students assigned</span>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Overall Progress</span>
            <span>{progressRate}%</span>
          </div>
          <Progress value={progressRate} className="h-2" />
        </div>

        {/* Completion Stats */}
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="space-y-1">
            <div className="flex items-center justify-center gap-1">
              <Clock className="h-3 w-3 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">Pending</span>
            </div>
            <div className="text-lg font-semibold">{targetCounts.pending_count}</div>
          </div>
          
          <div className="space-y-1">
            <div className="flex items-center justify-center gap-1">
              <PlayCircle className="h-3 w-3 text-blue-500" />
              <span className="text-xs text-muted-foreground">In Progress</span>
            </div>
            <div className="text-lg font-semibold text-blue-600">{targetCounts.started_count}</div>
          </div>
          
          <div className="space-y-1">
            <div className="flex items-center justify-center gap-1">
              <CheckCircle2 className="h-3 w-3 text-green-500" />
              <span className="text-xs text-muted-foreground">Completed</span>
            </div>
            <div className="text-lg font-semibold text-green-600">{targetCounts.completed_count}</div>
          </div>
        </div>

        {/* Completion Rate Badge */}
        <div className="flex justify-center">
          <Badge 
            variant={completionRate >= 80 ? "default" : completionRate >= 50 ? "secondary" : "outline"}
            className={
              completionRate >= 80 
                ? "bg-green-500 hover:bg-green-600" 
                : completionRate >= 50 
                  ? "bg-yellow-500 hover:bg-yellow-600" 
                  : ""
            }
          >
            {completionRate}% Complete
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}