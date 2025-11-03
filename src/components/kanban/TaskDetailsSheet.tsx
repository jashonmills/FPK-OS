import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Separator } from '@/components/ui/separator';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, Plus, X, Trash2, Send, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { MentionTextarea } from '@/components/mentions/MentionTextarea';
import { AIAssistButton } from '@/components/ai/AIAssistButton';
import { TaskTypeIcon, getTaskTypeLabel } from '@/components/tasks/TaskTypeIcon';
import { AssigneeSelect } from '@/components/assignee/AssigneeSelect';
import { TimeEntryForm } from '@/components/budget/TimeEntryForm';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

interface Task {
  id: string;
  title: string;
  description: string | null;
  status: string;
  priority: string;
  type?: 'story' | 'bug' | 'epic' | 'chore' | 'meeting' | 'deadline' | 'focus_time' | 'personal' | 'reminder';
  assignee_id: string | null;
  due_date: string | null;
  position: number;
  created_by: string;
  project_id: string;
}

interface SubTask {
  id: string;
  task_id: string;
  title: string;
  completed: boolean;
  position: number;
}

interface Comment {
  id: string;
  task_id: string;
  user_id: string;
  content: string;
  created_at: string;
  profiles: {
    full_name: string;
    email: string;
  };
}

interface Label {
  id: string;
  task_id: string;
  name: string;
  color: string;
}

interface ActivityLog {
  id: string;
  task_id: string;
  user_id: string;
  action: string;
  details: string | null;
  created_at: string;
  profiles: {
    full_name: string;
  };
}

interface TimeEntry {
  id: string;
  user_id: string;
  task_id: string;
  project_id: string;
  hours_logged: number;
  description: string | null;
  entry_date: string;
  created_at: string;
  profiles: {
    full_name: string;
  };
}

interface TaskDetailsSheetProps {
  task: Task | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onTaskUpdate: () => void;
}

const COLUMNS = [
  { id: 'backlog', title: 'Backlog' },
  { id: 'todo', title: 'To Do' },
  { id: 'in_progress', title: 'In Progress' },
  { id: 'review', title: 'Review' },
  { id: 'done', title: 'Done' },
];

const PRIORITIES = ['low', 'medium', 'high', 'critical'];

export const TaskDetailsSheet = ({ task, open, onOpenChange, onTaskUpdate }: TaskDetailsSheetProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('');
  const [priority, setPriority] = useState('');
  const [assigneeId, setAssigneeId] = useState<string | null>(null);
  const [dueDate, setDueDate] = useState<Date | undefined>();
  const [subTasks, setSubTasks] = useState<SubTask[]>([]);
  const [newSubTask, setNewSubTask] = useState('');
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [labels, setLabels] = useState<Label[]>([]);
  const [newLabel, setNewLabel] = useState('');
  const [activityLog, setActivityLog] = useState<ActivityLog[]>([]);
  const [showTimeEntry, setShowTimeEntry] = useState(false);
  const [timeEntries, setTimeEntries] = useState<TimeEntry[]>([]);
  const [timeLogOpen, setTimeLogOpen] = useState(false);

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description || '');
      setStatus(task.status);
      setPriority(task.priority);
      setAssigneeId(task.assignee_id);
      setDueDate(task.due_date ? new Date(task.due_date) : undefined);
      fetchSubTasks();
      fetchComments();
      fetchLabels();
      fetchActivityLog();
      fetchTimeEntries();
    }
  }, [task]);

  const fetchSubTasks = async () => {
    if (!task) return;
    const { data, error } = await supabase
      .from('sub_tasks')
      .select('*')
      .eq('task_id', task.id)
      .order('position');
    if (!error && data) setSubTasks(data);
  };

  const fetchComments = async () => {
    if (!task) return;
    const { data, error } = await supabase
      .from('task_comments')
      .select('*, profiles(full_name, email)')
      .eq('task_id', task.id)
      .order('created_at', { ascending: false });
    if (!error && data) setComments(data as any);
  };

  const fetchLabels = async () => {
    if (!task) return;
    const { data, error } = await supabase
      .from('task_labels')
      .select('*')
      .eq('task_id', task.id);
    if (!error && data) setLabels(data);
  };

  const fetchActivityLog = async () => {
    if (!task) return;
    const { data, error } = await supabase
      .from('task_activity_log')
      .select('*, profiles(full_name)')
      .eq('task_id', task.id)
      .order('created_at', { ascending: false })
      .limit(20);
    if (!error && data) setActivityLog(data as any);
  };

  const fetchTimeEntries = async () => {
    if (!task) return;
    const { data, error } = await supabase
      .from('time_entries')
      .select('*, profiles(full_name)')
      .eq('task_id', task.id)
      .order('entry_date', { ascending: false });
    if (!error && data) setTimeEntries(data as any);
  };

  const logActivity = async (action: string, details?: string) => {
    if (!task || !user) return;
    await supabase.from('task_activity_log').insert({
      task_id: task.id,
      user_id: user.id,
      action,
      details,
    });
    fetchActivityLog();
  };

  const updateTask = async (field: string, value: any, logMessage: string) => {
    if (!task) return;
    const { error } = await supabase
      .from('tasks')
      .update({ [field]: value })
      .eq('id', task.id);

    if (error) {
      toast({
        title: 'Error',
        description: 'Failed to update task',
        variant: 'destructive',
      });
    } else {
      logActivity(logMessage);
      onTaskUpdate();
    }
  };

  const handleTitleBlur = () => {
    if (title !== task?.title) {
      updateTask('title', title, `Updated title to "${title}"`);
    }
  };

  const handleDescriptionBlur = () => {
    if (description !== (task?.description || '')) {
      updateTask('description', description, 'Updated description');
    }
  };

  const handleStatusChange = (newStatus: string) => {
    setStatus(newStatus);
    const statusLabel = COLUMNS.find(c => c.id === newStatus)?.title;
    updateTask('status', newStatus, `Moved to ${statusLabel}`);
  };

  const handlePriorityChange = (newPriority: string) => {
    setPriority(newPriority);
    updateTask('priority', newPriority, `Changed priority to ${newPriority}`);
  };

  const handleDueDateChange = (date: Date | undefined) => {
    setDueDate(date);
    updateTask('due_date', date?.toISOString(), date ? `Set due date to ${format(date, 'PPP')}` : 'Removed due date');
  };

  const handleAssigneeChange = (newAssigneeId: string | null) => {
    setAssigneeId(newAssigneeId);
    updateTask('assignee_id', newAssigneeId, newAssigneeId ? 'Assigned task' : 'Unassigned task');
  };

  const addSubTask = async () => {
    if (!task || !newSubTask.trim()) return;
    const { error } = await supabase.from('sub_tasks').insert({
      task_id: task.id,
      title: newSubTask,
      position: subTasks.length,
    });

    if (error) {
      toast({
        title: 'Error',
        description: 'Failed to add sub-task',
        variant: 'destructive',
      });
    } else {
      setNewSubTask('');
      fetchSubTasks();
      logActivity('Added sub-task', newSubTask);
    }
  };

  const toggleSubTask = async (subTask: SubTask) => {
    const { error } = await supabase
      .from('sub_tasks')
      .update({ completed: !subTask.completed })
      .eq('id', subTask.id);

    if (!error) {
      fetchSubTasks();
      logActivity(subTask.completed ? 'Unchecked sub-task' : 'Completed sub-task', subTask.title);
    }
  };

  const deleteSubTask = async (id: string) => {
    const { error } = await supabase.from('sub_tasks').delete().eq('id', id);
    if (!error) {
      fetchSubTasks();
      logActivity('Deleted sub-task');
    }
  };

  const addComment = async () => {
    if (!task || !user || !newComment.trim()) return;
    const { data: insertedComment, error } = await supabase.from('task_comments').insert({
      task_id: task.id,
      user_id: user.id,
      content: newComment,
    }).select().single();

    if (error) {
      toast({
        title: 'Error',
        description: 'Failed to add comment',
        variant: 'destructive',
      });
    } else {
      // Process mentions
      if (insertedComment) {
        await supabase.functions.invoke('process-mentions', {
          body: {
            taskId: task.id,
            commentId: insertedComment.id,
            content: newComment,
            senderId: user.id
          }
        });
      }
      setNewComment('');
      fetchComments();
      logActivity('Added comment');
    }
  };

  const addLabel = async () => {
    if (!task || !newLabel.trim()) return;
    const colors = ['#EF4444', '#F59E0B', '#10B981', '#3B82F6', '#8B5CF6', '#EC4899'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];

    const { error } = await supabase.from('task_labels').insert({
      task_id: task.id,
      name: newLabel,
      color: randomColor,
    });

    if (!error) {
      setNewLabel('');
      fetchLabels();
      logActivity('Added label', newLabel);
    }
  };

  const deleteLabel = async (id: string) => {
    const { error } = await supabase.from('task_labels').delete().eq('id', id);
    if (!error) {
      fetchLabels();
      logActivity('Removed label');
    }
  };

  if (!task) return null;

  const completedSubTasks = subTasks.filter(st => st.completed).length;
  const subTaskProgress = subTasks.length > 0 ? (completedSubTasks / subTasks.length) * 100 : 0;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-2xl overflow-y-auto">
        <SheetHeader>
          <div className="flex items-start gap-2">
            <SheetTitle className="flex-1">
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onBlur={handleTitleBlur}
                className="text-2xl font-bold border-none px-0 focus-visible:ring-0"
              />
            </SheetTitle>
            <Button onClick={() => setShowTimeEntry(true)} variant="outline" size="sm" className="gap-2">
              <Clock className="h-4 w-4" />
              Log Time
            </Button>
          </div>
        </SheetHeader>

        <div className="space-y-6 mt-6">
          {/* Status and Priority */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Status</label>
              <Select value={status} onValueChange={handleStatusChange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {COLUMNS.map(col => (
                    <SelectItem key={col.id} value={col.id}>{col.title}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Priority</label>
              <Select value={priority} onValueChange={handlePriorityChange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PRIORITIES.map(p => (
                    <SelectItem key={p} value={p}>
                      <span className="capitalize">{p}</span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Due Date */}
          <div>
            <label className="text-sm font-medium mb-2 block">Due Date</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className={cn("w-full justify-start", !dueDate && "text-muted-foreground")}>
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dueDate ? format(dueDate, 'PPP') : 'Pick a date'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar mode="single" selected={dueDate} onSelect={handleDueDateChange} initialFocus className="pointer-events-auto" />
              </PopoverContent>
            </Popover>
          </div>

          {/* Assignee */}
          <div>
            <label className="text-sm font-medium mb-2 block">Assignee</label>
            <AssigneeSelect value={assigneeId} onChange={handleAssigneeChange} />
          </div>

          {/* Labels */}
          <div>
            <label className="text-sm font-medium mb-2 block">Labels</label>
            <div className="flex flex-wrap gap-2 mb-2">
              {labels.map(label => (
                <Badge key={label.id} style={{ backgroundColor: label.color }} className="text-white">
                  {label.name}
                  <X className="ml-1 h-3 w-3 cursor-pointer" onClick={() => deleteLabel(label.id)} />
                </Badge>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                value={newLabel}
                onChange={(e) => setNewLabel(e.target.value)}
                placeholder="Add label..."
                onKeyPress={(e) => e.key === 'Enter' && addLabel()}
              />
              <Button onClick={addLabel} size="sm">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <Separator />

          {/* Description */}
          <div>
            <label className="text-sm font-medium mb-2 block">Description</label>
            <MentionTextarea
              value={description}
              onChange={setDescription}
              placeholder="Add a description... Type @ to mention someone"
              minHeight="min-h-[120px]"
            />
          </div>

          {/* AI Assist */}
          {task && (
            <AIAssistButton
              taskId={task.id}
              taskTitle={title}
              taskDescription={description}
              onSubTasksAdded={fetchSubTasks}
            />
          )}

          {/* Sub-tasks */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium">Sub-tasks</label>
              {subTasks.length > 0 && (
                <span className="text-xs text-muted-foreground">
                  {completedSubTasks}/{subTasks.length} Completed
                </span>
              )}
            </div>
            {subTasks.length > 0 && (
              <Progress value={subTaskProgress} className="mb-4" />
            )}
            <div className="space-y-2 mb-3">
              {subTasks.map(subTask => (
                <div key={subTask.id} className="flex items-center gap-2">
                  <Checkbox
                    checked={subTask.completed}
                    onCheckedChange={() => toggleSubTask(subTask)}
                  />
                  <span className={cn("flex-1", subTask.completed && "line-through text-muted-foreground")}>
                    {subTask.title}
                  </span>
                  <Button variant="ghost" size="sm" onClick={() => deleteSubTask(subTask.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                value={newSubTask}
                onChange={(e) => setNewSubTask(e.target.value)}
                placeholder="Add sub-task..."
                onKeyPress={(e) => e.key === 'Enter' && addSubTask()}
              />
              <Button onClick={addSubTask} size="sm">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <Separator />

          {/* Time Log */}
          {timeEntries.length > 0 && (
            <Collapsible open={timeLogOpen} onOpenChange={setTimeLogOpen}>
              <CollapsibleTrigger className="flex items-center justify-between w-full">
                <label className="text-sm font-medium">Time Log</label>
                <Badge variant="secondary" className="ml-2">
                  {timeEntries.reduce((sum, entry) => sum + parseFloat(entry.hours_logged.toString()), 0).toFixed(2)} hrs
                </Badge>
              </CollapsibleTrigger>
              <CollapsibleContent className="mt-3">
                <div className="border rounded-lg divide-y">
                  {timeEntries.map(entry => (
                    <div key={entry.id} className="p-3 hover:bg-accent/50">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="font-medium text-sm">{entry.profiles.full_name}</div>
                          <div className="text-xs text-muted-foreground">
                            {format(new Date(entry.entry_date), 'MMM dd, yyyy')} • {parseFloat(entry.hours_logged.toString()).toFixed(2)} hrs
                          </div>
                          {entry.description && (
                            <p className="text-sm mt-1 text-muted-foreground">{entry.description}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CollapsibleContent>
            </Collapsible>
          )}

          <Separator />

          {/* Comments */}
          <div>
            <label className="text-sm font-medium mb-3 block">Comments</label>
            <div className="space-y-4 mb-4">
              {comments.map(comment => (
                <div key={comment.id} className="border rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-semibold text-sm">{comment.profiles.full_name || comment.profiles.email}</span>
                    <span className="text-xs text-muted-foreground">
                      {format(new Date(comment.created_at), 'PPp')}
                    </span>
                  </div>
                  <p className="text-sm">{comment.content}</p>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <MentionTextarea
                value={newComment}
                onChange={setNewComment}
                placeholder="Add a comment... Type @ to mention someone"
              />
              <Button onClick={addComment} size="sm">
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <Separator />

          {/* Activity Log */}
          <div>
            <label className="text-sm font-medium mb-3 block">Activity</label>
            <div className="space-y-2 max-h-[300px] overflow-y-auto">
              {activityLog.map(log => (
                <div key={log.id} className="text-sm">
                  <span className="font-medium">{log.profiles.full_name}</span>
                  {' '}{log.action}
                  {log.details && <span className="text-muted-foreground"> - {log.details}</span>}
                  <div className="text-xs text-muted-foreground">
                    {format(new Date(log.created_at), 'PPp')}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Time Entry Form */}
        {task && (
          <TimeEntryForm
            taskId={task.id}
            projectId={task.project_id}
            open={showTimeEntry}
            onOpenChange={setShowTimeEntry}
            onSuccess={() => {
              fetchTimeEntries();
              logActivity('Logged time');
            }}
          />
        )}
      </SheetContent>
    </Sheet>
  );
};
