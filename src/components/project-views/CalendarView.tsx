import { useMemo, useCallback, useState } from 'react';
import { Calendar, dateFnsLocalizer, Event as BigCalendarEvent } from 'react-big-calendar';
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop';
import { format, parse, startOfWeek, getDay, parseISO, set } from 'date-fns';
import { enUS } from 'date-fns/locale';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { getEventTypeColor } from '@/components/calendar/EventTypeIcon';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Calendar as CalendarIcon, Info } from 'lucide-react';
import './calendar-styles.css';

const locales = { 'en-US': enUS };
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});
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
  
  // Controlled state for calendar - fixes state corruption bug
  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentView, setCurrentView] = useState<'month' | 'week' | 'day' | 'agenda'>('month');

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
        let start: Date;
        let end: Date;

        if (task.start_date) {
          // Task has specific start and end times
          // Parse as ISO strings - no timezone mutation
          start = parseISO(task.start_date);
          end = parseISO(task.due_date!);
          
          // Ensure end is after start
          if (end.getTime() <= start.getTime()) {
            end = new Date(start.getTime() + 60 * 60 * 1000); // Add 1 hour
          }
        } else {
          // Task is "all-day" - give it a specific time range (9 AM - 5 PM)
          // This completely eliminates the allDay flag bug
          const dueDate = parseISO(task.due_date!);
          
          // Set to 9 AM using immutable set function
          start = set(dueDate, { hours: 9, minutes: 0, seconds: 0, milliseconds: 0 });
          
          // Set to 5 PM using immutable set function
          end = set(dueDate, { hours: 17, minutes: 0, seconds: 0, milliseconds: 0 });
        }
        
        console.log(`Task: ${task.title}`);
        console.log(`  Due date string: ${task.due_date}`);
        console.log(`  Start:`, start.toISOString());
        console.log(`  End:`, end.toISOString());
        console.log(`  Duration (hours):`, (end.getTime() - start.getTime()) / (1000 * 60 * 60));
        
        return {
          title: task.title,
          start,
          end,
          // NEVER USE allDay flag - this eliminates the Agenda view bug
          task,
          color: projectColor || 'rgba(139, 92, 246, 0.9)',
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
      },
    };
  }, []);

  const handleSelectSlot = useCallback(({ start, end }: { start: Date; end: Date }) => {
    if (onSlotSelect) {
      onSlotSelect(start, end);
    }
  }, [onSlotSelect]);

  const handleNavigate = useCallback((newDate: Date) => {
    console.log('Calendar navigated to:', newDate);
    setCurrentDate(newDate);
  }, []);

  const handleViewChange = useCallback((newView: 'month' | 'week' | 'day' | 'agenda') => {
    console.log('View changed to:', newView);
    setCurrentView(newView);
  }, []);

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
      
      <div className="min-h-[600px] bg-background p-4 border rounded-lg">
        <DnDCalendar
          localizer={localizer}
          events={events}
          startAccessor={(event: CalendarEvent) => event.start as Date}
          endAccessor={(event: CalendarEvent) => event.end as Date}
          style={{ height: 600 }}
          
          // CONTROLLED PROPS - This fixes state corruption bug
          view={currentView}
          date={currentDate}
          onView={handleViewChange}
          onNavigate={handleNavigate}
          
          // Event handlers
          onSelectEvent={handleSelectEvent}
          onEventDrop={handleEventDrop}
          onEventResize={handleEventDrop}
          onSelectSlot={handleSelectSlot}
          eventPropGetter={eventStyleGetter}
          
          // Configuration
          views={['month', 'week', 'day', 'agenda']}
          selectable
          resizable
          popup
        />
      </div>
    </div>
  );
};
