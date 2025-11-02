import { useMemo, useCallback } from 'react';
import { Calendar, momentLocalizer, Event as BigCalendarEvent, View } from 'react-big-calendar';
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import './calendar-styles.css';

const localizer = momentLocalizer(moment);
const DnDCalendar = withDragAndDrop(Calendar);

interface Task {
  id: string;
  title: string;
  description: string | null;
  status: string;
  priority: string;
  assignee_id: string | null;
  due_date: string | null;
  start_date: string | null;
  position: number;
  created_by: string;
  project_id: string;
}

interface CalendarViewProps {
  tasks: Task[];
  projectColor: string;
  projectId: string;
  onTaskClick: (task: Task) => void;
  onTaskUpdate: () => void;
  onSlotSelect?: (start: Date, end: Date) => void;
}

interface CalendarEvent extends BigCalendarEvent {
  task: Task;
  color: string;
}

export const CalendarView = ({ tasks, projectColor, projectId, onTaskClick, onTaskUpdate, onSlotSelect }: CalendarViewProps) => {
  const { toast } = useToast();

  const events: CalendarEvent[] = useMemo(() => {
    return tasks
      .filter(task => task.due_date)
      .map(task => ({
        title: task.title,
        start: task.start_date ? new Date(task.start_date) : new Date(task.due_date!),
        end: new Date(task.due_date!),
        task,
        color: projectColor,
      }));
  }, [tasks, projectColor]);

  const handleEventDrop = useCallback(async ({ event, start, end }: any) => {
    const { error } = await supabase
      .from('tasks')
      .update({ 
        start_date: start.toISOString(),
        due_date: end.toISOString(),
      })
      .eq('id', event.task.id);

    if (error) {
      toast({
        title: 'Error',
        description: 'Failed to update task dates',
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Success',
        description: 'Task dates updated',
      });
      onTaskUpdate();
    }
  }, [onTaskUpdate, toast]);

  const handleSelectEvent = useCallback((event: CalendarEvent) => {
    onTaskClick(event.task);
  }, [onTaskClick]);

  const eventStyleGetter = useCallback((event: CalendarEvent) => {
    return {
      style: {
        backgroundColor: event.color,
        borderColor: event.color,
        color: 'white',
      },
    };
  }, []);

  const handleSelectSlot = useCallback(({ start, end }: { start: Date; end: Date }) => {
    if (onSlotSelect) {
      onSlotSelect(start, end);
    }
  }, [onSlotSelect]);

  return (
    <div className="h-[calc(100vh-250px)] bg-background p-4 border rounded-lg">
      <DnDCalendar
        localizer={localizer}
        events={events}
        startAccessor={(event: CalendarEvent) => event.start as Date}
        endAccessor={(event: CalendarEvent) => event.end as Date}
        onSelectEvent={handleSelectEvent}
        onEventDrop={handleEventDrop}
        onEventResize={handleEventDrop}
        onSelectSlot={handleSelectSlot}
        eventPropGetter={eventStyleGetter}
        selectable
        resizable
        popup
        views={['month', 'week', 'day', 'agenda']}
        defaultView="month"
      />
    </div>
  );
};
