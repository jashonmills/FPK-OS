import { useState, useEffect } from 'react';
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
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { EventTypeSelector } from './EventTypeSelector';
import { CalendarEventType, getEventTypeLabel } from './EventTypeIcon';
import { AssigneeSelect } from '@/components/assignee/AssigneeSelect';
import { MentionTextarea } from '@/components/mentions/MentionTextarea';

interface CreateCalendarEventDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectId?: string;
  prefilledDates?: { start: Date; end: Date } | null;
  onEventCreated: () => void;
}

export const CreateCalendarEventDialog = ({
  open,
  onOpenChange,
  projectId,
  prefilledDates,
  onEventCreated,
}: CreateCalendarEventDialogProps) => {
  const [step, setStep] = useState<'type' | 'details'>('type');
  const [eventType, setEventType] = useState<CalendarEventType>('meeting');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('10:00');
  const [assigneeId, setAssigneeId] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (open) {
      setStep('type');
      setTitle('');
      setDescription('');
      setAssigneeId('');
      
      if (prefilledDates?.start) {
        const date = new Date(prefilledDates.start);
        setStartDate(date.toISOString().split('T')[0]);
      }
    }
  }, [open, prefilledDates]);

  const handleTypeSelect = (type: CalendarEventType) => {
    setEventType(type);
    setStep('details');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!projectId) {
      toast({
        title: 'Error',
        description: 'Please select a project first',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);

    const startDateTime = new Date(`${startDate}T${startTime}`);
    const endDateTime = new Date(`${startDate}T${endTime}`);

    const { data: { user } } = await supabase.auth.getUser();
    
    const { error } = await supabase
      .from('tasks')
      .insert({
        title,
        description,
        type: eventType,
        status: 'todo',
        priority: 'medium',
        project_id: projectId,
        created_by: user?.id,
        assignee_id: assigneeId || null,
        start_date: startDateTime.toISOString(),
        due_date: endDateTime.toISOString(),
      });

    setLoading(false);

    if (error) {
      toast({
        title: 'Error',
        description: 'Failed to create calendar event',
        variant: 'destructive',
      });
    } else {
      // Process mentions in description
      if (description) {
        await supabase.functions.invoke('process-mentions', {
          body: {
            content: description,
            taskId: null,
            mentionType: 'task_description',
          },
        });
      }

      toast({
        title: 'Success',
        description: 'Calendar event created',
      });
      
      onEventCreated();
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        {step === 'type' ? (
          <>
            <DialogHeader>
              <DialogTitle>Select Event Type</DialogTitle>
              <DialogDescription>
                Choose the type of calendar event you want to create
              </DialogDescription>
            </DialogHeader>
            <EventTypeSelector onSelect={handleTypeSelect} />
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>Create {getEventTypeLabel(eventType)}</DialogTitle>
              <DialogDescription>
                Fill in the details for your calendar event
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder={`e.g., Q4 Review ${eventType === 'meeting' ? 'Meeting' : ''}`}
                  required
                  autoFocus
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-3 sm:col-span-1">
                  <Label htmlFor="date">Date *</Label>
                  <Input
                    id="date"
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="startTime">Start Time *</Label>
                  <Input
                    id="startTime"
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="endTime">End Time *</Label>
                  <Input
                    id="endTime"
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    required
                  />
                </div>
              </div>

              {(eventType === 'task' || eventType === 'deadline') && (
                <div>
                  <Label htmlFor="assignee">Assignee</Label>
                  <AssigneeSelect
                    value={assigneeId}
                    onValueChange={setAssigneeId}
                    placeholder="Select assignee (optional)"
                  />
                </div>
              )}

              <div>
                <Label htmlFor="description">
                  Description {eventType === 'meeting' ? '(Add attendees with @)' : ''}
                </Label>
                <MentionTextarea
                  value={description}
                  onChange={setDescription}
                  placeholder={
                    eventType === 'meeting'
                      ? 'Add meeting notes and mention attendees with @...'
                      : 'Add additional details...'
                  }
                  minRows={3}
                />
              </div>

              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setStep('type')}
                >
                  Back
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? 'Creating...' : 'Create Event'}
                </Button>
              </div>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};
