import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Separator } from '@/components/ui/separator';
import { useGoals } from '@/hooks/useGoals';
import { useToast } from '@/hooks/use-toast';
import { Edit2 } from 'lucide-react';
import GoalMilestonesManager from './GoalMilestonesManager';
import type { GoalMilestone } from '@/types/goals';

interface GoalEditFormProps {
  goal: {
    id: string;
    title: string;
    description?: string;
    priority: 'low' | 'medium' | 'high';
    status: 'active' | 'completed' | 'paused';
    progress: number;
    target_date?: string;
    category: string;
    milestones?: any;
  };
  trigger?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const GoalEditForm: React.FC<GoalEditFormProps> = ({ goal, trigger, open: controlledOpen, onOpenChange: controlledOnOpenChange }) => {
  const [internalOpen, setInternalOpen] = useState(false);
  const { updateGoal, updateMilestone } = useGoals();
  const { toast } = useToast();
  
  // Use controlled or internal state
  const open = controlledOpen !== undefined ? controlledOpen : internalOpen;
  const setOpen = controlledOnOpenChange || setInternalOpen;

  // Parse milestones from goal data
  const parseMilestones = (milestones: any): GoalMilestone[] => {
    if (!milestones) return [];
    if (Array.isArray(milestones)) return milestones;
    if (typeof milestones === 'string') {
      try {
        return JSON.parse(milestones);
      } catch {
        return [];
      }
    }
    return [];
  };
  
  const [formData, setFormData] = useState({
    title: goal.title,
    description: goal.description || '',
    priority: goal.priority,
    category: goal.category,
    progress: goal.progress,
    target_date: goal.target_date || '',
    milestones: parseMilestones(goal.milestones)
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      toast({
        title: "Error",
        description: "Goal title is required",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Calculate progress based on milestones if they exist
      let finalProgress = formData.progress;
      if (formData.milestones.length > 0) {
        const completedCount = formData.milestones.filter(m => m.completed).length;
        finalProgress = Math.round((completedCount / formData.milestones.length) * 100);
      }

      await updateGoal(goal.id, {
        title: formData.title.trim(),
        description: formData.description.trim() || null,
        priority: formData.priority,
        category: formData.category,
        progress: finalProgress,
        target_date: formData.target_date || null,
        milestones: JSON.parse(JSON.stringify(formData.milestones)) // Convert to JSON-compatible format
      });
      
      toast({
        title: "Goal Updated",
        description: "Your goal has been successfully updated.",
      });
      
      setOpen(false);
    } catch (error) {
      console.error('Error updating goal:', error);
      toast({
        title: "Error",
        description: "Failed to update goal. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      // Reset form when closing
      setFormData({
        title: goal.title,
        description: goal.description || '',
        priority: goal.priority,
        category: goal.category,
        progress: goal.progress,
        target_date: goal.target_date || '',
        milestones: parseMilestones(goal.milestones)
      });
    }
    setOpen(newOpen);
  };

  const handleMilestoneComplete = async (milestoneId: string) => {
    try {
      await updateMilestone(goal.id, milestoneId, true);
      toast({
        title: "Milestone Completed!",
        description: "Great job on completing this milestone!",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update milestone. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      {!controlledOpen && (
        <div onClick={() => setOpen(true)} className="cursor-pointer">
          {trigger || (
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <Edit2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      )}
      
      <DialogContent className="max-w-md mx-4 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Goal</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Enter goal title"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Enter goal description (optional)"
              rows={3}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="priority">Priority</Label>
              <Select value={formData.priority} onValueChange={(value) => setFormData({ ...formData, priority: value as 'low' | 'medium' | 'high' })}>
                <SelectTrigger id="priority">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                <SelectTrigger id="category">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="learning">Learning</SelectItem>
                  <SelectItem value="reading">Reading</SelectItem>
                  <SelectItem value="study">Study</SelectItem>
                  <SelectItem value="achievement">Achievement</SelectItem>
                  <SelectItem value="personal">Personal</SelectItem>
                  <SelectItem value="career">Career</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {/* Only show manual progress slider if no milestones */}
          {formData.milestones.length === 0 && (
            <div className="space-y-2">
              <Label htmlFor="progress">Progress: {formData.progress}%</Label>
              <Slider
                id="progress"
                min={0}
                max={100}
                step={5}
                value={[formData.progress]}
                onValueChange={(value) => setFormData({ ...formData, progress: value[0] })}
                className="w-full"
              />
            </div>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="target_date">Target Date (Optional)</Label>
            <Input
              id="target_date"
              type="date"
              value={formData.target_date}
              onChange={(e) => setFormData({ ...formData, target_date: e.target.value })}
            />
          </div>

          <Separator className="my-6" />

          <GoalMilestonesManager
            milestones={formData.milestones}
            onChange={(milestones) => setFormData({ ...formData, milestones })}
            onMilestoneComplete={handleMilestoneComplete}
          />
          
          <DialogFooter className="flex gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Updating...' : 'Update Goal'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default GoalEditForm;