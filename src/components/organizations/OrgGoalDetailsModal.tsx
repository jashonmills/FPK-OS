import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Calendar, Target, User, Clock, CheckCircle } from 'lucide-react';
import { format } from 'date-fns';
import { useGoalTargets } from '@/hooks/useOrgGoals';

interface OrgGoalDetailsModalProps {
  goal: {
    id: string;
    title: string;
    description: string;
    category: string;
    priority: string;
    status: string;
    target_date?: string;
    student_id: string;
    created_at: string;
  };
  studentName: string;
  isOpen: boolean;
  onClose: () => void;
}

const OrgGoalDetailsModal: React.FC<OrgGoalDetailsModalProps> = ({
  goal,
  studentName,
  isOpen,
  onClose,
}) => {
  const { targets, isLoading } = useGoalTargets(goal.id);
  const studentTarget = targets.find(t => t.user_id === goal.student_id);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'active': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">{goal.title}</DialogTitle>
          <DialogDescription>
            <div className="flex flex-wrap gap-2 mt-2">
              <Badge className={getPriorityColor(goal.priority)}>
                {goal.priority} priority
              </Badge>
              <Badge variant="outline">{goal.category}</Badge>
              {goal.target_date && (
                <Badge variant="outline">
                  <Calendar className="h-3 w-3 mr-1" />
                  Due {format(new Date(goal.target_date), 'MMM dd, yyyy')}
                </Badge>
              )}
            </div>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Student Info */}
          <div className="p-4 bg-muted rounded-lg">
            <div className="flex items-center gap-2">
              <User className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Assigned to</p>
                <p className="text-lg font-semibold">{studentName}</p>
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <h3 className="font-semibold mb-2">Goal Description</h3>
            <p className="text-sm text-muted-foreground">{goal.description}</p>
          </div>

          {/* Student Progress */}
          {isLoading ? (
            <div className="p-4 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground">Loading student progress...</p>
            </div>
          ) : studentTarget ? (
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold">Student Progress</h3>
                <div className="flex items-center gap-2">
                  <Badge className={getStatusColor(studentTarget.status)}>
                    {studentTarget.status}
                  </Badge>
                  <span className="text-2xl font-bold text-primary">
                    {studentTarget.progress}%
                  </span>
                </div>
              </div>
              <Progress value={studentTarget.progress} className="h-3 mb-2" />
              
              {studentTarget.status === 'completed' && (
                <div className="p-3 bg-green-50 border border-green-200 rounded-lg mt-4">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="font-semibold text-green-900">Goal Completed!</p>
                      <p className="text-sm text-green-800">
                        Student marked this goal as complete on {format(new Date(studentTarget.updated_at), 'MMM dd, yyyy')}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  Last updated: {format(new Date(studentTarget.updated_at), 'MMM dd, yyyy HH:mm')}
                </div>
              </div>
            </div>
          ) : (
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <div className="flex items-center gap-2">
                <Target className="h-5 w-5 text-amber-600" />
                <div>
                  <p className="font-semibold text-amber-900">No Progress Yet</p>
                  <p className="text-sm text-amber-800">
                    Student hasn't started working on this goal yet.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Goal Metadata */}
          <div className="grid grid-cols-2 gap-4 p-4 bg-muted rounded-lg text-sm">
            <div>
              <p className="text-muted-foreground mb-1">Created</p>
              <p className="font-medium">{format(new Date(goal.created_at), 'MMM dd, yyyy')}</p>
            </div>
            <div>
              <p className="text-muted-foreground mb-1">Status</p>
              <Badge className={getStatusColor(goal.status)}>{goal.status}</Badge>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OrgGoalDetailsModal;
