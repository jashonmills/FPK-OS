
export interface AnalyticsEvent {
  id: string;
  userId: string;
  eventType: string;
  timestamp: string;
  metadata: Record<string, any>;
  source: string;
  sessionId?: string;
}

export interface EventSubscriber {
  id: string;
  eventTypes: string[];
  callback: (event: AnalyticsEvent) => void;
}

class AnalyticsEventBus {
  private subscribers: Map<string, EventSubscriber> = new Map();
  private eventHistory: AnalyticsEvent[] = [];
  private maxHistorySize = 1000;

  subscribe(subscriber: EventSubscriber): () => void {
    this.subscribers.set(subscriber.id, subscriber);
    console.log(`📊 Analytics subscriber registered: ${subscriber.id}`);
    
    return () => {
      this.subscribers.delete(subscriber.id);
      console.log(`📊 Analytics subscriber unregistered: ${subscriber.id}`);
    };
  }

  publish(event: Omit<AnalyticsEvent, 'id' | 'timestamp'>): void {
    const fullEvent: AnalyticsEvent = {
      ...event,
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString()
    };

    // Add to history
    this.eventHistory.unshift(fullEvent);
    if (this.eventHistory.length > this.maxHistorySize) {
      this.eventHistory.pop();
    }

    // Notify subscribers
    this.subscribers.forEach(subscriber => {
      if (subscriber.eventTypes.includes(event.eventType) || subscriber.eventTypes.includes('*')) {
        try {
          subscriber.callback(fullEvent);
        } catch (error) {
          console.error(`Error in analytics subscriber ${subscriber.id}:`, error);
        }
      }
    });

    console.log(`📊 Analytics event published: ${event.eventType}`, fullEvent);
  }

  getEventHistory(): AnalyticsEvent[] {
    return [...this.eventHistory];
  }

  getEventsByType(eventType: string, limit = 50): AnalyticsEvent[] {
    return this.eventHistory
      .filter(event => event.eventType === eventType)
      .slice(0, limit);
  }
}

export const analyticsEventBus = new AnalyticsEventBus();

// Standard event types
export const ANALYTICS_EVENTS = {
  READING_SESSION_START: 'reading_session_start',
  READING_SESSION_END: 'reading_session_end',
  STUDY_SESSION_COMPLETE: 'study_session_complete',
  FLASHCARD_REVIEWED: 'flashcard_reviewed',
  MODULE_COMPLETED: 'module_completed',
  GOAL_CREATED: 'goal_created',
  GOAL_COMPLETED: 'goal_completed',
  NOTE_CREATED: 'note_created',
  FILE_UPLOADED: 'file_uploaded',
  XP_EARNED: 'xp_earned',
  STREAK_UPDATED: 'streak_updated',
  BADGE_EARNED: 'badge_earned'
} as const;
