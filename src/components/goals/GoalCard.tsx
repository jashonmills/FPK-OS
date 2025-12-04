
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { MoreHorizontal, CheckCircle, Pause, Play, Trash2, Calendar, Clock, Edit2 } from 'lucide-react';
import { format } from 'date-fns';
import { useDualLanguage } from '@/hooks/useDualLanguage';
import DualLanguageText from '@/components/DualLanguageText';
import { useGoals } from '@/hooks/useGoals';
import GoalEditForm from './GoalEditForm';

interface GoalCardProps {
  goal: {
    id: string;
    title: string;
    description?: string;
    priority: 'low' | 'medium' | 'high';
    status: 'active' | 'completed' | 'paused';
    progress: number;
    target_date?: string;
    category: string;
    created_at: string;
  };
}

const GoalCard: React.FC<GoalCardProps> = ({ goal }) => {
  const { t } = useDualLanguage();
  const { updateGoal, deleteGoal } = useGoals();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const handleStatusChange = async (newStatus: 'active' | 'completed' | 'paused') => {
    try {
      await updateGoal(goal.id, { 
        status: newStatus,
        progress: newStatus === 'completed' ? 100 : goal.progress
      });
    } catch (error) {
      console.error('Error updating goal status:', error);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteGoal(goal.id);
      setShowDeleteDialog(false);
    } catch (error) {
      console.error('Error deleting goal:', error);
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'paused': return 'bg-yellow-100 text-yellow-800';
      case 'active': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <>
      <Card className="fpk-card border-0 shadow-md hover:shadow-lg transition-shadow h-full flex flex-col">
        <CardHeader className="pb-2 sm:pb-3 p-3 sm:p-4">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0 overflow-hidden">
              <CardTitle className="text-sm sm:text-lg font-semibold text-gray-900 mb-2 line-clamp-2 break-words">
                {goal.title}
              </CardTitle>
              <div className="flex flex-wrap items-center gap-1 sm:gap-2">
                <Badge className={`${getPriorityColor(goal.priority)} text-xs px-1.5 py-0.5`}>
                  <DualLanguageText 
                    translationKey={`goals.priority.${goal.priority}`} 
                    fallback={goal.priority} 
                  />
                </Badge>
                <Badge className={`${getStatusColor(goal.status)} text-xs px-1.5 py-0.5`}>
                  <DualLanguageText 
                    translationKey={`goals.status.${goal.status}`} 
                    fallback={goal.status} 
                  />
                </Badge>
              </div>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-6 w-6 sm:h-8 sm:w-8 p-0 flex-shrink-0">
                  <MoreHorizontal className="h-3 w-3 sm:h-4 sm:w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-white">
                <GoalEditForm 
                  goal={goal}
                  trigger={
                    <DropdownMenuItem className="text-xs sm:text-sm cursor-pointer">
                      <Edit2 className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                      <DualLanguageText translationKey="goals.actions.edit" fallback="Edit" />
                    </DropdownMenuItem>
                  }
                />
                {goal.status !== 'completed' && (
                  <DropdownMenuItem onClick={() => handleStatusChange('completed')} className="text-xs sm:text-sm">
                    <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                    <DualLanguageText translationKey="goals.actions.markComplete" fallback="Mark Complete" />
                  </DropdownMenuItem>
                )}
                {goal.status === 'active' && (
                  <DropdownMenuItem onClick={() => handleStatusChange('paused')} className="text-xs sm:text-sm">
                    <Pause className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                    <DualLanguageText translationKey="goals.actions.pause" fallback="Pause" />
                  </DropdownMenuItem>
                )}
                {goal.status === 'paused' && (
                  <DropdownMenuItem onClick={() => handleStatusChange('active')} className="text-xs sm:text-sm">
                    <Play className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                    <DualLanguageText translationKey="goals.actions.resume" fallback="Resume" />
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem 
                  onClick={() => setShowDeleteDialog(true)}
                  className="text-red-600 text-xs sm:text-sm"
                >
                  <Trash2 className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                  <DualLanguageText translationKey="goals.actions.delete" fallback="Delete" />
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-3 sm:space-y-4 p-3 sm:p-4 pt-0 flex-1">
          {goal.description && (
            <p className="text-xs sm:text-sm text-gray-600 line-clamp-3 break-words leading-relaxed">
              {goal.description}
            </p>
          )}
          
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs sm:text-sm">
              <span className="text-gray-500 truncate mr-2">
                <DualLanguageText translationKey="goals.progress" fallback="Progress" />
              </span>
              <span className="font-medium flex-shrink-0">{goal.progress}%</span>
            </div>
            <Progress value={goal.progress} className="h-1.5 sm:h-2" />
          </div>

          <div className="flex items-center justify-between text-xs text-gray-500 pt-2">
            <div className="flex items-center gap-1 min-w-0 overflow-hidden">
              <Clock className="h-2.5 w-2.5 sm:h-3 sm:w-3 flex-shrink-0" />
              <span className="truncate">
                <DualLanguageText translationKey="goals.created" fallback="Created" />{' '}
                {format(new Date(goal.created_at), 'MMM dd')}
              </span>
            </div>
            {goal.target_date && (
              <div className="flex items-center gap-1 min-w-0 overflow-hidden">
                <Calendar className="h-2.5 w-2.5 sm:h-3 sm:w-3 flex-shrink-0" />
                <span className="truncate">
                  <DualLanguageText translationKey="goals.due" fallback="Due" />{' '}
                  {format(new Date(goal.target_date), 'MMM dd')}
                </span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent className="max-w-sm mx-4">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-base">
              <DualLanguageText translationKey="goals.deleteDialog.title" fallback="Delete Goal" />
            </AlertDialogTitle>
            <AlertDialogDescription className="text-sm leading-relaxed">
              <DualLanguageText 
                translationKey="goals.deleteDialog.description" 
                fallback="Are you sure you want to delete this goal? This action cannot be undone." 
              />
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-col sm:flex-row gap-2">
            <AlertDialogCancel className="text-sm">
              <DualLanguageText translationKey="common.cancel" fallback="Cancel" />
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700 text-sm">
              <DualLanguageText translationKey="common.delete" fallback="Delete" />
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default GoalCard;
