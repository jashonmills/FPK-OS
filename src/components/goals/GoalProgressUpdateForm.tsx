import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

interface GoalProgressUpdateFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  goal: any;
  onSuccess: () => void;
}

export function GoalProgressUpdateForm({ open, onOpenChange, goal, onSuccess }: GoalProgressUpdateFormProps) {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [value, setValue] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!value.trim()) {
      toast.error('Please enter a value');
      return;
    }

    setIsSubmitting(true);
    try {
      const metricValue = parseFloat(value);
      
      // Insert progress metric
      const { error: metricError } = await supabase
        .from('progress_metrics')
        .insert({
          family_id: goal.family_id,
          student_id: goal.student_id,
          metric_date: date,
          metric_value: metricValue,
          target_value: goal.target_value,
          metric_category: goal.goal_type || 'general',
          metric_name: goal.goal_title,
          metric_unit: goal.unit,
          notes: notes || null,
        });

      if (metricError) throw metricError;

      // Update the goal's current value
      const { error: goalError } = await supabase
        .from('goals')
        .update({
          current_value: metricValue,
          updated_at: new Date().toISOString(),
        })
        .eq('id', goal.id);

      if (goalError) throw goalError;

      toast.success('Progress update added successfully!');
      onSuccess();
    } catch (error: any) {
      console.error('Error adding progress update:', error);
      toast.error('Failed to add progress update: ' + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Progress Update</DialogTitle>
          <DialogDescription>
            Record a new observation for "{goal.goal_title}"
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="date">Date *</Label>
            <Input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="value">
              Current Value * {goal.unit && `(${goal.unit})`}
              {goal.target_value && (
                <span className="text-muted-foreground ml-2">
                  Target: {goal.target_value}
                </span>
              )}
            </Label>
            <Input
              id="value"
              type="number"
              step="0.01"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="Enter the current value"
            />
          </div>

          <div>
            <Label htmlFor="notes">Observations / Notes</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Describe what happened, any triggers, strategies used, etc..."
              rows={4}
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
              {isSubmitting ? 'Saving...' : 'Add Update'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
