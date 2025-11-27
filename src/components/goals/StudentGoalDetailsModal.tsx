import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Slider } from '@/components/ui/slider';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { CheckCircle, Calendar, Target, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';
import { useStudentGoals } from '@/hooks/useStudentGoals';
import { toast } from 'sonner';

interface StudentGoalDetailsModalProps {
  goal: {
    id: string;
    title: string;
    description: string;
    category: string;
    priority: string;
    status: string;
    target_date?: string;
    progress: number;
    target_status: string;
    created_at: string;
  };
  isOpen: boolean;
  onClose: () => void;
  onUpdate: () => void;
}

const StudentGoalDetailsModal: React.FC<StudentGoalDetailsModalProps> = ({
  goal,
  isOpen,
  onClose,
  onUpdate,
}) => {
  const { updateProgress, markComplete } = useStudentGoals();
  const [localProgress, setLocalProgress] = useState(goal.progress);
  const [response, setResponse] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  const handleUpdateProgress = async () => {
    setIsUpdating(true);
    try {
      await updateProgress(goal.id, localProgress);
      onUpdate();
      if (localProgress === 100) {
        toast.success('Great job! Goal completed!');
      }
    } catch (error) {
      toast.error('Failed to update progress');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleMarkComplete = async () => {
    setIsUpdating(true);
    try {
      await markComplete(goal.id);
      onUpdate();
      onClose();
    } catch (error) {
      toast.error('Failed to mark as complete');
    } finally {
      setIsUpdating(false);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
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
          {/* Description */}
          <div>
            <h3 className="font-semibold mb-2">Goal Description</h3>
            <p className="text-sm text-muted-foreground">{goal.description}</p>
          </div>

          {/* Current Progress */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold">Current Progress</h3>
              <span className="text-2xl font-bold text-primary">{goal.progress}%</span>
            </div>
            <Progress value={goal.progress} className="h-3" />
          </div>

          {/* Update Progress */}
          {goal.target_status !== 'completed' && (
            <div className="space-y-4 p-4 bg-muted rounded-lg">
              <div>
                <Label htmlFor="progress-slider">Update Your Progress</Label>
                <div className="flex items-center gap-4 mt-2">
                  <Slider
                    id="progress-slider"
                    value={[localProgress]}
                    onValueChange={(value) => setLocalProgress(value[0])}
                    max={100}
                    step={5}
                    className="flex-1"
                  />
                  <span className="text-sm font-medium w-12 text-right">{localProgress}%</span>
                </div>
              </div>

              <Button
                onClick={handleUpdateProgress}
                disabled={isUpdating || localProgress === goal.progress}
                className="w-full"
              >
                {isUpdating ? 'Updating...' : 'Update Progress'}
              </Button>
            </div>
          )}

          {/* Mark as Complete */}
          {goal.target_status !== 'completed' && goal.progress >= 80 && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <h4 className="font-semibold text-green-900 mb-1">Almost there!</h4>
                  <p className="text-sm text-green-800 mb-3">
                    You've made great progress on this goal. Mark it as complete when you're ready!
                  </p>
                  <Button
                    onClick={handleMarkComplete}
                    disabled={isUpdating}
                    variant="default"
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    {isUpdating ? 'Marking...' : 'Mark as Complete'}
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Completed Status */}
          {goal.target_status === 'completed' && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <div>
                  <h4 className="font-semibold text-green-900">Goal Completed!</h4>
                  <p className="text-sm text-green-800">
                    Congratulations on achieving this goal!
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Add Response (Coming Soon) */}
          <div className="space-y-2">
            <Label htmlFor="response">Add a Note or Update</Label>
            <Textarea
              id="response"
              placeholder="Share your progress, challenges, or questions with your instructor..."
              value={response}
              onChange={(e) => setResponse(e.target.value)}
              rows={4}
            />
            <Button variant="outline" disabled className="w-full">
              <AlertCircle className="h-4 w-4 mr-2" />
              Response Feature Coming Soon
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default StudentGoalDetailsModal;
