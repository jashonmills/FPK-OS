import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

interface GoalEditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  goal: any;
  onSuccess: () => void;
}

export function GoalEditDialog({ open, onOpenChange, goal, onSuccess }: GoalEditDialogProps) {
  const [title, setTitle] = useState(goal.goal_title);
  const [description, setDescription] = useState(goal.goal_description || '');
  const [type, setType] = useState(goal.goal_type || '');
  const [targetValue, setTargetValue] = useState(goal.target_value?.toString() || '');
  const [targetDate, setTargetDate] = useState(goal.target_date || '');
  const [unit, setUnit] = useState(goal.unit || '');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!title.trim()) {
      toast.error('Please enter a goal title');
      return;
    }

    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('goals')
        .update({
          goal_title: title,
          goal_description: description || null,
          goal_type: type || 'general',
          target_value: targetValue ? parseFloat(targetValue) : null,
          target_date: targetDate || null,
          unit: unit || null,
          updated_at: new Date().toISOString(),
        })
        .eq('id', goal.id);

      if (error) throw error;

      toast.success('Goal updated successfully!');
      onSuccess();
    } catch (error: any) {
      console.error('Error updating goal:', error);
      toast.error('Failed to update goal: ' + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Edit Goal</DialogTitle>
          <DialogDescription>
            Update the goal details and tracking parameters
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="title">Goal Title *</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Increase independent task completion"
            />
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the goal and how progress will be measured..."
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="type">Goal Type</Label>
            <Select value={type} onValueChange={setType}>
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="academic">Academic</SelectItem>
                <SelectItem value="behavioral">Behavioral</SelectItem>
                <SelectItem value="communication">Communication</SelectItem>
                <SelectItem value="social">Social</SelectItem>
                <SelectItem value="motor">Motor Skills</SelectItem>
                <SelectItem value="self-care">Self-Care</SelectItem>
                <SelectItem value="general">General</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="target">Target Value</Label>
              <Input
                id="target"
                type="number"
                value={targetValue}
                onChange={(e) => setTargetValue(e.target.value)}
                placeholder="e.g., 80"
              />
            </div>
            <div>
              <Label htmlFor="unit">Unit</Label>
              <Input
                id="unit"
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                placeholder="e.g., %,  per week, minutes"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="date">Target Date</Label>
            <Input
              id="date"
              type="date"
              value={targetDate}
              onChange={(e) => setTargetDate(e.target.value)}
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
