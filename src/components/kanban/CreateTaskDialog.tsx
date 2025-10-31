import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { TaskTypeIcon, getTaskTypeLabel, BUG_TEMPLATE } from '@/components/tasks/TaskTypeIcon';
import { MentionTextarea } from '@/components/mentions/MentionTextarea';
import { Card } from '@/components/ui/card';

interface CreateTaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectId: string;
}

export const CreateTaskDialog = ({ open, onOpenChange, projectId }: CreateTaskDialogProps) => {
  const [step, setStep] = useState<'type' | 'details'>('type');
  const [taskType, setTaskType] = useState<'story' | 'bug' | 'epic' | 'chore'>('story');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('medium');
  const [status, setStatus] = useState('backlog');
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const handleTypeSelect = (type: 'story' | 'bug' | 'epic' | 'chore') => {
    setTaskType(type);
    if (type === 'bug' && !description) {
      setDescription(BUG_TEMPLATE);
    }
    setStep('details');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      const { data: insertedTask, error } = await supabase.from('tasks').insert([{
        title,
        description: description || null,
        priority: priority as any,
        status: status as any,
        type: taskType,
        project_id: projectId,
        created_by: user.id,
        position: 0,
      }]).select().single();

      if (error) throw error;

      // Process mentions in description
      if (description && insertedTask) {
        await supabase.functions.invoke('process-mentions', {
          body: {
            taskId: insertedTask.id,
            content: description,
            senderId: user.id
          }
        });
      }

      toast({
        title: 'Success',
        description: 'Task created successfully',
      });

      setStep('type');
      setTaskType('story');
      setTitle('');
      setDescription('');
      setPriority('medium');
      setStatus('backlog');
      onOpenChange(false);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const taskTypes = [
    { id: 'story', label: 'Story', icon: TaskTypeIcon },
    { id: 'bug', label: 'Bug', icon: TaskTypeIcon },
    { id: 'epic', label: 'Epic', icon: TaskTypeIcon },
    { id: 'chore', label: 'Chore', icon: TaskTypeIcon },
  ];

  return (
    <Dialog open={open} onOpenChange={(open) => {
      if (!open) {
        setStep('type');
        setTaskType('story');
      }
      onOpenChange(open);
    }}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {step === 'type' ? 'Select Task Type' : 'Create New Task'}
          </DialogTitle>
        </DialogHeader>

        {step === 'type' ? (
          <div className="grid grid-cols-2 gap-3 py-4">
            {taskTypes.map((type) => (
              <Card
                key={type.id}
                className="p-4 cursor-pointer hover:bg-accent transition-colors flex flex-col items-center gap-2 text-center"
                onClick={() => handleTypeSelect(type.id as any)}
              >
                <TaskTypeIcon type={type.id as any} className="h-8 w-8" />
                <span className="font-medium">{type.label}</span>
              </Card>
            ))}
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <TaskTypeIcon type={taskType} className="h-4 w-4" />
              <span>{getTaskTypeLabel(taskType)}</span>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setStep('type')}
                className="ml-auto"
              >
                Change
              </Button>
            </div>

            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter task title"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <MentionTextarea
                value={description}
                onChange={setDescription}
                placeholder="Add task description (optional). Type @ to mention someone"
              />
            </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="priority">Priority</Label>
              <Select value={priority} onValueChange={setPriority}>
                <SelectTrigger id="priority">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger id="status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="backlog">Backlog</SelectItem>
                  <SelectItem value="todo">To Do</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="review">Review</SelectItem>
                  <SelectItem value="done">Done</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? 'Creating...' : 'Create Task'}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};
