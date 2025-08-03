import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
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
import { Plus, Edit2, Trash2, CheckCircle2, Circle } from 'lucide-react';
import { useDualLanguage } from '@/hooks/useDualLanguage';
import DualLanguageText from '@/components/DualLanguageText';
import { useGoals } from '@/hooks/useGoals';
import { useAnalyticsPublisher } from '@/hooks/useAnalyticsEventBus';
import type { GoalMilestone } from '@/types/goals';

interface Milestone extends Omit<GoalMilestone, 'order' | 'estimatedHours' | 'description' | 'completedAt'> {
  order_index: number;
  completed_at?: string;
}

interface MilestoneManagerProps {
  goalId: string;
  milestones: Milestone[];
  onMilestonesUpdate: (milestones: Milestone[]) => void;
}

const MilestoneManager: React.FC<MilestoneManagerProps> = ({
  goalId,
  milestones,
  onMilestonesUpdate
}) => {
  const { t } = useDualLanguage();
  const { updateMilestone } = useGoals();
  const analytics = useAnalyticsPublisher();
  const [isOpen, setIsOpen] = useState(false);
  const [newMilestoneTitle, setNewMilestoneTitle] = useState('');
  const [editingMilestone, setEditingMilestone] = useState<Milestone | null>(null);
  const [deletingMilestone, setDeletingMilestone] = useState<Milestone | null>(null);

  const addMilestone = () => {
    if (!newMilestoneTitle.trim()) return;

    const newMilestone: Milestone = {
      id: crypto.randomUUID(),
      title: newMilestoneTitle.trim(),
      completed: false,
      order_index: milestones.length,
    };

    const updatedMilestones = [...milestones, newMilestone];
    onMilestonesUpdate(updatedMilestones);
    setNewMilestoneTitle('');

    // Track analytics
    analytics.publishEvent('milestone_created', {
      goalId,
      milestoneId: newMilestone.id,
      milestoneTitle: newMilestone.title,
      totalMilestones: updatedMilestones.length
    });
  };

  const updateMilestoneTitle = (milestoneId: string, newTitle: string) => {
    const updatedMilestones = milestones.map(m =>
      m.id === milestoneId ? { ...m, title: newTitle } : m
    );
    onMilestonesUpdate(updatedMilestones);
    setEditingMilestone(null);
  };

  const toggleMilestoneCompletion = async (milestone: Milestone) => {
    const updatedMilestones = milestones.map(m =>
      m.id === milestone.id 
        ? { 
            ...m, 
            completed: !m.completed,
            completed_at: !m.completed ? new Date().toISOString() : undefined
          } 
        : m
    );
    onMilestonesUpdate(updatedMilestones);

    // Track completion via existing hook
    await updateMilestone(goalId, milestone.id, !milestone.completed);
  };

  const deleteMilestone = (milestoneId: string) => {
    const updatedMilestones = milestones
      .filter(m => m.id !== milestoneId)
      .map((m, index) => ({ ...m, order_index: index }));
    
    onMilestonesUpdate(updatedMilestones);
    setDeletingMilestone(null);

    // Track analytics
    analytics.publishEvent('milestone_deleted', {
      goalId,
      milestoneId,
      remainingMilestones: updatedMilestones.length
    });
  };

  const completedCount = milestones.filter(m => m.completed).length;
  const totalCount = milestones.length;

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm" className="text-xs">
            <CheckCircle2 className="h-3 w-3 mr-1" />
            <DualLanguageText translationKey="goals.milestones.manage" fallback="Milestones" />
            {totalCount > 0 && (
              <Badge variant="secondary" className="ml-1 text-xs">
                {completedCount}/{totalCount}
              </Badge>
            )}
          </Button>
        </DialogTrigger>
        
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5" />
              <DualLanguageText translationKey="goals.milestones.title" fallback="Goal Milestones" />
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            {/* Progress Summary */}
            {totalCount > 0 && (
              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <span className="text-sm font-medium">
                  <DualLanguageText translationKey="goals.milestones.progress" fallback="Progress" />
                </span>
                <Badge variant="outline">
                  {completedCount}/{totalCount} completed
                </Badge>
              </div>
            )}

            {/* Add New Milestone */}
            <div className="flex gap-2">
              <Input
                placeholder="Add a milestone..."
                value={newMilestoneTitle}
                onChange={(e) => setNewMilestoneTitle(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addMilestone()}
                className="text-sm"
              />
              <Button onClick={addMilestone} size="sm" disabled={!newMilestoneTitle.trim()}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            {/* Milestones List */}
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {milestones.length === 0 ? (
                <p className="text-center text-muted-foreground text-sm py-4">
                  <DualLanguageText 
                    translationKey="goals.milestones.empty" 
                    fallback="No milestones yet. Add one above to break down your goal." 
                  />
                </p>
              ) : (
                milestones.map((milestone) => (
                  <div key={milestone.id} className="flex items-center gap-2 p-2 border rounded-lg">
                    <Checkbox
                      checked={milestone.completed}
                      onCheckedChange={() => toggleMilestoneCompletion(milestone)}
                      className="flex-shrink-0"
                    />
                    
                    {editingMilestone?.id === milestone.id ? (
                      <Input
                        value={editingMilestone.title}
                        onChange={(e) => setEditingMilestone({ ...editingMilestone, title: e.target.value })}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            updateMilestoneTitle(milestone.id, editingMilestone.title);
                          }
                        }}
                        onBlur={() => updateMilestoneTitle(milestone.id, editingMilestone.title)}
                        className="text-sm"
                        autoFocus
                      />
                    ) : (
                      <span 
                        className={`flex-1 text-sm ${milestone.completed ? 'line-through text-muted-foreground' : ''}`}
                      >
                        {milestone.title}
                      </span>
                    )}

                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setEditingMilestone(milestone)}
                        className="h-6 w-6 p-0"
                      >
                        <Edit2 className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setDeletingMilestone(milestone)}
                        className="h-6 w-6 p-0 text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deletingMilestone} onOpenChange={() => setDeletingMilestone(null)}>
        <AlertDialogContent className="max-w-sm mx-4">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-base">
              <DualLanguageText translationKey="goals.milestones.deleteTitle" fallback="Delete Milestone" />
            </AlertDialogTitle>
            <AlertDialogDescription className="text-sm">
              <DualLanguageText 
                translationKey="goals.milestones.deleteDescription" 
                fallback="Are you sure you want to delete this milestone? This action cannot be undone." 
              />
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-col sm:flex-row gap-2">
            <AlertDialogCancel className="text-sm">
              <DualLanguageText translationKey="common.cancel" fallback="Cancel" />
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => deletingMilestone && deleteMilestone(deletingMilestone.id)}
              className="bg-red-600 hover:bg-red-700 text-sm"
            >
              <DualLanguageText translationKey="common.delete" fallback="Delete" />
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default MilestoneManager;