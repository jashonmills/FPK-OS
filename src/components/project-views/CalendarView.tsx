import { useMemo, useCallback } from 'react';
import { Calendar, momentLocalizer, Event as BigCalendarEvent, View } from 'react-big-calendar';
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop';
import moment from 'moment';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { getEventTypeColor } from '@/components/calendar/EventTypeIcon';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Calendar as CalendarIcon, Info } from 'lucide-react';
import './calendar-styles.css';

const localizer = momentLocalizer(moment);
const DnDCalendar = withDragAndDrop(Calendar);

interface Task {
  id: string;
  title: string;
  description: string | null;
  status: string;
  priority: string;
  type?: 'story' | 'bug' | 'epic' | 'chore' | 'meeting' | 'deadline' | 'focus_time' | 'personal' | 'reminder';
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

  const { events, tasksWithDates, tasksWithoutDates } = useMemo(() => {
    console.log('=== CalendarView Debug ===');
    console.log('Input tasks:', tasks);
    console.log('Project color:', projectColor);
    
    const withDates = tasks.filter(task => task.due_date);
    const withoutDates = tasks.filter(task => !task.due_date);
    
    console.log('Tasks with dates:', withDates);
    console.log('Tasks without dates:', withoutDates);
    
    const calendarEvents = withDates
      .filter(task => {
        const dueDate = new Date(task.due_date!);
        const isValid = !isNaN(dueDate.getTime());
        if (!isValid) {
          console.warn(`Invalid date for task ${task.id}:`, task.due_date);
        }
        return isValid;
      })
      .map(task => {
        // Create dates and normalize to midnight for all-day events
        const start = task.start_date ? new Date(task.start_date) : new Date(task.due_date!);
        const end = new Date(task.due_date!);
        
        // Set to midnight for all-day display in calendar
        start.setHours(0, 0, 0, 0);
        end.setHours(23, 59, 59, 999);
        
        console.log(`Task: ${task.title}`);
        console.log(`  Due date string: ${task.due_date}`);
        console.log(`  Start date object:`, start);
        console.log(`  End date object:`, end);
        console.log(`  Color:`, projectColor || 'rgba(139, 92, 246, 0.9)');
        
        return {
          title: task.title,
          start,
          end,
          task,
          color: projectColor || 'rgba(139, 92, 246, 0.9)',
          allDay: true, // Mark as all-day event for month view
        };
      });

    console.log('Final calendar events:', calendarEvents);
    console.log('=== End CalendarView Debug ===');

    return {
      events: calendarEvents,
      tasksWithDates: withDates.length,
      tasksWithoutDates: withoutDates.length,
    };
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
    // Use event type color if it's a calendar event (meeting, deadline, etc.)
    const isCalendarEvent = ['meeting', 'deadline', 'focus_time', 'personal', 'reminder'].includes(event.task.type);
    const eventColor = isCalendarEvent ? getEventTypeColor(event.task.type) : event.color;
    
    return {
      style: {
        backgroundColor: eventColor,
        borderColor: eventColor,
        color: 'white',
        border: `1px solid ${eventColor}`,
        display: 'block',
        opacity: '1',
        minHeight: '20px',
        fontSize: '0.8125rem',
        padding: '2px 5px',
        borderRadius: '4px',
        cursor: 'pointer',
      },
    };
  }, []);

  const handleSelectSlot = useCallback(({ start, end }: { start: Date; end: Date }) => {
    if (onSlotSelect) {
      onSlotSelect(start, end);
    }
  }, [onSlotSelect]);

  return (
    <div className="space-y-4">
      {tasksWithoutDates > 0 && (
        <Alert>
          <Info className="h-4 w-4" />
          <AlertTitle>Calendar View</AlertTitle>
          <AlertDescription>
            <div className="space-y-1 text-sm">
              <p>
                <strong>Showing {tasksWithDates} task{tasksWithDates !== 1 ? 's' : ''} with due dates</strong>
              </p>
              {tasksWithoutDates > 0 && (
                <p className="text-muted-foreground">
                  {tasksWithoutDates} task{tasksWithoutDates !== 1 ? 's' : ''} without due dates {tasksWithoutDates !== 1 ? 'are' : 'is'} hidden. 
                  Add due dates to see them on the calendar, or switch to List view to see all tasks.
                </p>
              )}
            </div>
          </AlertDescription>
        </Alert>
      )}
      
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
    </div>
  );
};
