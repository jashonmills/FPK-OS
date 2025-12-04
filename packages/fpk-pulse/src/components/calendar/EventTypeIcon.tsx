import { Users, CheckSquare, Flag, Brain, User, Bell, LucideIcon } from 'lucide-react';

export type CalendarEventType = 'meeting' | 'deadline' | 'focus_time' | 'personal' | 'reminder' | 'story';

interface EventTypeConfig {
  icon: LucideIcon;
  label: string;
  color: string;
  description: string;
}

const eventTypeConfig: Record<CalendarEventType, EventTypeConfig> = {
  meeting: {
    icon: Users,
    label: 'Meeting',
    color: '#3B82F6',
    description: 'Schedule a call or meeting with team members',
  },
  story: {
    icon: CheckSquare,
    label: 'Task',
    color: '#10B981',
    description: 'A specific to-do item with a deadline',
  },
  deadline: {
    icon: Flag,
    label: 'Deadline',
    color: '#EF4444',
    description: 'Mark a critical project due date',
  },
  focus_time: {
    icon: Brain,
    label: 'Focus Time',
    color: '#8B5CF6',
    description: 'Block out time for deep work',
  },
  personal: {
    icon: User,
    label: 'Personal',
    color: '#F59E0B',
    description: 'Non-work appointment or event',
  },
  reminder: {
    icon: Bell,
    label: 'Reminder',
    color: '#6B7280',
    description: 'A simple reminder for later',
  },
};

export const getEventTypeIcon = (type: CalendarEventType): LucideIcon => {
  return eventTypeConfig[type]?.icon || CheckSquare;
};

export const getEventTypeLabel = (type: CalendarEventType): string => {
  return eventTypeConfig[type]?.label || 'Event';
};

export const getEventTypeColor = (type: CalendarEventType | string): string => {
  return eventTypeConfig[type as CalendarEventType]?.color || '#6B7280';
};

export const getEventTypeDescription = (type: CalendarEventType): string => {
  return eventTypeConfig[type]?.description || '';
};

export const getAllEventTypes = (): CalendarEventType[] => {
  return Object.keys(eventTypeConfig) as CalendarEventType[];
};

export const getEventTypeConfig = (type: CalendarEventType): EventTypeConfig => {
  return eventTypeConfig[type];
};
