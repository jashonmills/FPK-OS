import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';

interface Suggestion {
  title: string;
  priority: 'low' | 'medium' | 'high';
}

interface AISubTasksDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  suggestions: Suggestion[];
  taskId: string;
  onSubTasksAdded?: () => void;
}

export const AISubTasksDialog = ({
  open,
  onOpenChange,
  suggestions,
  taskId,
  onSubTasksAdded
}: AISubTasksDialogProps) => {
  const [selectedIndexes, setSelectedIndexes] = useState<number[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const { toast } = useToast();

  const toggleSelection = (index: number) => {
    setSelectedIndexes(prev =>
      prev.includes(index)
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  const addSelectedSubTasks = async () => {
    if (selectedIndexes.length === 0) return;

    setIsAdding(true);
    try {
      // Get current max position
      const { data: existingSubTasks } = await supabase
        .from('sub_tasks')
        .select('position')
        .eq('task_id', taskId)
        .order('position', { ascending: false })
        .limit(1);

      const startPosition = existingSubTasks?.[0]?.position ?? -1;

      const subTasksToAdd = selectedIndexes.map((index, i) => ({
        task_id: taskId,
        title: suggestions[index].title,
        completed: false,
        position: startPosition + i + 1
      }));

      const { error } = await supabase
        .from('sub_tasks')
        .insert(subTasksToAdd);

      if (error) throw error;

      toast({
        title: "Sub-tasks added",
        description: `Added ${subTasksToAdd.length} sub-tasks`,
      });

      onSubTasksAdded?.();
      onOpenChange(false);
      setSelectedIndexes([]);
    } catch (error) {
      console.error('Error adding sub-tasks:', error);
      toast({
        title: "Error",
        description: "Failed to add sub-tasks",
        variant: "destructive",
      });
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>AI-Suggested Sub-Tasks</DialogTitle>
          <DialogDescription>
            Select the sub-tasks you want to add to this task
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 py-4">
          {suggestions.map((suggestion, index) => (
            <div
              key={index}
              className="flex items-start gap-3 p-3 rounded-lg border border-border hover:bg-accent/50 transition-colors"
            >
              <Checkbox
                checked={selectedIndexes.includes(index)}
                onCheckedChange={() => toggleSelection(index)}
                className="mt-1"
              />
              <div className="flex-1">
                <p className="text-sm font-medium">{suggestion.title}</p>
                <Badge 
                  variant={suggestion.priority === 'high' ? 'destructive' : 'secondary'}
                  className="mt-1"
                >
                  {suggestion.priority}
                </Badge>
              </div>
            </div>
          ))}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button 
            onClick={addSelectedSubTasks} 
            disabled={selectedIndexes.length === 0 || isAdding}
          >
            {isAdding ? 'Adding...' : `Add Selected (${selectedIndexes.length})`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
