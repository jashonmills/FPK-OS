
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
import { MoreHorizontal, CheckCircle, Pause, Play, Trash2, Calendar, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { useDualLanguage } from '@/hooks/useDualLanguage';
import DualLanguageText from '@/components/DualLanguageText';
import { useGoals } from '@/hooks/useGoals';

interface GoalCardProps {
  goal: {
    id: string;
    title: string;
    description?: string;
    priority: 'low' | 'medium' | 'high';
    status: 'active' | 'completed' | 'paused';
    progress: number;
    target_date?: string;
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
      case 'high': return 'bg-red-500/10 text-red-700 border-red-500/20';
      case 'medium': return 'bg-yellow-500/10 text-yellow-700 border-yellow-500/20';
      case 'low': return 'bg-green-500/10 text-green-700 border-green-500/20';
      default: return 'bg-gray-500/10 text-gray-700 border-gray-500/20';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500/10 text-green-700 border-green-500/20';
      case 'paused': return 'bg-yellow-500/10 text-yellow-700 border-yellow-500/20';
      case 'active': return 'bg-blue-500/10 text-blue-700 border-blue-500/20';
      default: return 'bg-gray-500/10 text-gray-700 border-gray-500/20';
    }
  };

  return (
    <>
      <Card className="fpk-enhanced-card border-0 hover:shadow-xl hover:scale-[1.02] transition-all duration-300 group">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <CardTitle className="text-lg font-semibold text-foreground mb-3 line-clamp-2">
                {goal.title}
              </CardTitle>
              <div className="flex flex-wrap items-center gap-2">
                <Badge className={`${getPriorityColor(goal.priority)} border font-medium`}>
                  <DualLanguageText 
                    translationKey={`goals.priority.${goal.priority}`} 
                    fallback={goal.priority} 
                  />
                </Badge>
                <Badge className={`${getStatusColor(goal.status)} border font-medium`}>
                  <DualLanguageText 
                    translationKey={`goals.status.${goal.status}`} 
                    fallback={goal.status} 
                  />
                </Badge>
              </div>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                {goal.status !== 'completed' && (
                  <DropdownMenuItem onClick={() => handleStatusChange('completed')} className="text-green-600">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    <DualLanguageText translationKey="goals.actions.markComplete" fallback="Mark Complete" />
                  </DropdownMenuItem>
                )}
                {goal.status === 'active' && (
                  <DropdownMenuItem onClick={() => handleStatusChange('paused')} className="text-yellow-600">
                    <Pause className="h-4 w-4 mr-2" />
                    <DualLanguageText translationKey="goals.actions.pause" fallback="Pause" />
                  </DropdownMenuItem>
                )}
                {goal.status === 'paused' && (
                  <DropdownMenuItem onClick={() => handleStatusChange('active')} className="text-blue-600">
                    <Play className="h-4 w-4 mr-2" />
                    <DualLanguageText translationKey="goals.actions.resume" fallback="Resume" />
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem 
                  onClick={() => setShowDeleteDialog(true)}
                  className="text-red-600 focus:text-red-600"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  <DualLanguageText translationKey="goals.actions.delete" fallback="Delete" />
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {goal.description && (
            <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">{goal.description}</p>
          )}
          
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground font-medium">
                <DualLanguageText translationKey="goals.progress" fallback="Progress" />
              </span>
              <span className="font-bold fpk-gradient-text">{goal.progress}%</span>
            </div>
            <div className="relative">
              <Progress value={goal.progress} className="h-2" />
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-primary/5 rounded-full"></div>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t border-border/20">
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              <span>
                <DualLanguageText translationKey="goals.created" fallback="Created" />{' '}
                {format(new Date(goal.created_at), 'MMM dd')}
              </span>
            </div>
            {goal.target_date && (
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                <span>
                  <DualLanguageText translationKey="goals.due" fallback="Due" />{' '}
                  {format(new Date(goal.target_date), 'MMM dd')}
                </span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent className="sm:max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="fpk-gradient-text">
              <DualLanguageText translationKey="goals.deleteDialog.title" fallback="Delete Goal" />
            </AlertDialogTitle>
            <AlertDialogDescription className="text-muted-foreground">
              <DualLanguageText 
                translationKey="goals.deleteDialog.description" 
                fallback="Are you sure you want to delete this goal? This action cannot be undone." 
              />
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-border/50">
              <DualLanguageText translationKey="common.cancel" fallback="Cancel" />
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete} 
              className="bg-red-600 hover:bg-red-700 text-white border-0"
            >
              <DualLanguageText translationKey="common.delete" fallback="Delete" />
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default GoalCard;
