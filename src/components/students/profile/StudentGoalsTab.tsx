import React, { useState } from 'react';
import { useStudentProfileGoals } from '@/hooks/useStudentProfileGoals';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Target, Loader2, Calendar, FolderOpen } from 'lucide-react';
import { format } from 'date-fns';

interface StudentGoalsTabProps {
  student: {
    id: string;
    full_name: string;
    linked_user_id?: string;
  };
  orgId: string;
}

export const StudentGoalsTab: React.FC<StudentGoalsTabProps> = ({ student, orgId }) => {
  const [selectedGoal, setSelectedGoal] = useState<any>(null);
  
  // Use the student's profile ID and linked user ID for fetching goals and progress
  const { goals, isLoading, refetch } = useStudentProfileGoals(
    student.id,
    student.linked_user_id
  );

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'destructive';
      case 'medium':
        return 'default';
      case 'low':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'default';
      case 'active':
        return 'secondary';
      case 'paused':
        return 'outline';
      default:
        return 'secondary';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-3 text-muted-foreground">Loading goals...</span>
      </div>
    );
  }

  if (goals.length === 0) {
    return (
      <div className="text-center py-12">
        <Target className="h-16 w-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No Goals Assigned</h3>
        <p className="text-sm text-gray-600">
          This student hasn't been assigned any goals yet.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {goals.map((goal) => (
            <Card key={goal.id} className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => setSelectedGoal(goal)}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <CardTitle className="text-lg">{goal.title}</CardTitle>
                  <div className="flex gap-2">
                    <Badge variant={getPriorityColor(goal.priority)}>
                      {goal.priority}
                    </Badge>
                    <Badge variant={getStatusColor(goal.status)}>
                      {goal.status}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {goal.description}
                </p>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Progress</span>
                    <span className="font-medium">{goal.progress}%</span>
                  </div>
                  <Progress value={goal.progress} className="h-2" />
                </div>

                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <FolderOpen className="h-3 w-3" />
                    {goal.category}
                  </div>
                  {goal.target_date && (
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {format(new Date(goal.target_date), 'MMM dd, yyyy')}
                    </div>
                  )}
                </div>

                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedGoal(goal);
                  }}
                >
                  View Details
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Goal Details Modal */}
      {selectedGoal && (
        <Dialog open={!!selectedGoal} onOpenChange={() => setSelectedGoal(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-xl">{selectedGoal.title}</DialogTitle>
            </DialogHeader>
            <div className="space-y-6">
              {/* Goal Info */}
              <div className="flex gap-2">
                <Badge variant={getPriorityColor(selectedGoal.priority)}>
                  {selectedGoal.priority} priority
                </Badge>
                <Badge variant={getStatusColor(selectedGoal.status)}>
                  {selectedGoal.status}
                </Badge>
                <Badge variant="outline">{selectedGoal.category}</Badge>
              </div>

              {/* Description */}
              <div>
                <h4 className="font-semibold mb-2">Description</h4>
                <p className="text-muted-foreground">{selectedGoal.description}</p>
              </div>

              {/* Progress */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold">Current Progress</h4>
                  <span className="text-lg font-bold">{selectedGoal.progress}%</span>
                </div>
                <Progress value={selectedGoal.progress} className="h-3" />
              </div>

              {/* Target Date */}
              {selectedGoal.target_date && (
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Target Date:</span>
                  <span className="font-medium">
                    {format(new Date(selectedGoal.target_date), 'MMMM dd, yyyy')}
                  </span>
                </div>
              )}

              {/* Dates */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Created:</span>
                  <p className="font-medium">
                    {format(new Date(selectedGoal.created_at), 'MMM dd, yyyy')}
                  </p>
                </div>
                <div>
                  <span className="text-muted-foreground">Last Updated:</span>
                  <p className="font-medium">
                    {format(new Date(selectedGoal.updated_at), 'MMM dd, yyyy')}
                  </p>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};
