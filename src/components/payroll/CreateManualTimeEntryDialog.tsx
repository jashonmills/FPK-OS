import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface CreateManualTimeEntryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export const CreateManualTimeEntryDialog = ({
  open,
  onOpenChange,
  onSuccess,
}: CreateManualTimeEntryDialogProps) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<Array<{ id: string; full_name: string; email: string }>>([]);
  const [projects, setProjects] = useState<Array<{ id: string; name: string }>>([]);
  const [tasks, setTasks] = useState<Array<{ id: string; title: string }>>([]);

  const [selectedUserId, setSelectedUserId] = useState('');
  const [selectedProjectId, setSelectedProjectId] = useState('');
  const [selectedTaskId, setSelectedTaskId] = useState('');
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [hours, setHours] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (open) {
      fetchUsers();
      fetchProjects();
    }
  }, [open]);

  useEffect(() => {
    if (selectedProjectId) {
      fetchTasks(selectedProjectId);
    } else {
      setTasks([]);
      setSelectedTaskId('');
    }
  }, [selectedProjectId]);

  const fetchUsers = async () => {
    const { data, error } = await supabase
      .from('profiles')
      .select('id, full_name, email')
      .order('full_name');

    if (!error && data) {
      setUsers(data);
    }
  };

  const fetchProjects = async () => {
    const { data, error } = await supabase
      .from('projects')
      .select('id, name')
      .order('name');

    if (!error && data) {
      setProjects(data);
    }
  };

  const fetchTasks = async (projectId: string) => {
    const { data, error } = await supabase
      .from('tasks')
      .select('id, title')
      .eq('project_id', projectId)
      .order('title');

    if (!error && data) {
      setTasks(data);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedUserId || !selectedProjectId || !selectedTaskId || !selectedDate || !hours) {
      toast({
        title: 'Validation Error',
        description: 'Please fill in all required fields',
        variant: 'destructive',
      });
      return;
    }

    const hoursNum = parseFloat(hours);
    if (isNaN(hoursNum) || hoursNum <= 0) {
      toast({
        title: 'Validation Error',
        description: 'Hours must be a positive number',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.from('time_entries').insert({
        user_id: selectedUserId,
        project_id: selectedProjectId,
        task_id: selectedTaskId,
        entry_date: format(selectedDate, 'yyyy-MM-dd'),
        hours_logged: hoursNum,
        description: description || null,
      });

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Time entry created successfully',
      });

      // Reset form
      setSelectedUserId('');
      setSelectedProjectId('');
      setSelectedTaskId('');
      setSelectedDate(undefined);
      setHours('');
      setDescription('');

      onSuccess();
      onOpenChange(false);
    } catch (error) {
      console.error('Error creating time entry:', error);
      toast({
        title: 'Error',
        description: 'Failed to create time entry',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Create Manual Time Entry</DialogTitle>
          <DialogDescription>
            Add a time entry on behalf of an employee
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="user">Employee *</Label>
            <Select value={selectedUserId} onValueChange={setSelectedUserId}>
              <SelectTrigger>
                <SelectValue placeholder="Select employee" />
              </SelectTrigger>
              <SelectContent>
                {users.map((user) => (
                  <SelectItem key={user.id} value={user.id}>
                    {user.full_name || user.email}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="project">Project *</Label>
            <Select value={selectedProjectId} onValueChange={setSelectedProjectId}>
              <SelectTrigger>
                <SelectValue placeholder="Select project" />
              </SelectTrigger>
              <SelectContent>
                {projects.map((project) => (
                  <SelectItem key={project.id} value={project.id}>
                    {project.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="task">Task *</Label>
            <Select 
              value={selectedTaskId} 
              onValueChange={setSelectedTaskId}
              disabled={!selectedProjectId}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select task" />
              </SelectTrigger>
              <SelectContent>
                {tasks.map((task) => (
                  <SelectItem key={task.id} value={task.id}>
                    {task.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Date *</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    'w-full justify-start text-left font-normal',
                    !selectedDate && 'text-muted-foreground'
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {selectedDate ? format(selectedDate, 'PPP') : 'Pick a date'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  initialFocus
                  className="pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label htmlFor="hours">Hours *</Label>
            <Input
              id="hours"
              type="number"
              step="0.25"
              min="0"
              placeholder="8.00"
              value={hours}
              onChange={(e) => setHours(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              placeholder="What work was performed..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Creating...' : 'Create Entry'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
