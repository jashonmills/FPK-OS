
import { supabase } from '@/integrations/supabase/client';

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

export interface TimeSeriesMetric {
  metric_name: string;
  value: number;
  timestamp: string;
  user_id: string;
  metadata?: Record<string, any>;
}

class AnalyticsEventBus {
  private subscribers: Map<string, EventSubscriber> = new Map();
  private eventHistory: AnalyticsEvent[] = [];
  private maxHistorySize = 1000;
  private realtimeChannel: any = null;

  constructor() {
    this.initializeRealtimeChannel();
  }

  private initializeRealtimeChannel() {
    this.realtimeChannel = supabase
      .channel('analytics-events')
      .on('broadcast', { event: 'analytics_event' }, (payload) => {
        this.handleRealtimeEvent(payload.payload);
      })
      .subscribe();

    console.log('📊 Analytics realtime channel initialized');
  }

  private handleRealtimeEvent(event: AnalyticsEvent) {
    // Add to local history
    this.eventHistory.unshift(event);
    if (this.eventHistory.length > this.maxHistorySize) {
      this.eventHistory.pop();
    }

    // Notify local subscribers
    this.subscribers.forEach(subscriber => {
      if (subscriber.eventTypes.includes(event.eventType) || subscriber.eventTypes.includes('*')) {
        try {
          subscriber.callback(event);
        } catch (error) {
          console.error(`Error in analytics subscriber ${subscriber.id}:`, error);
        }
      }
    });
  }

  subscribe(subscriber: EventSubscriber): () => void {
    this.subscribers.set(subscriber.id, subscriber);
    console.log(`📊 Analytics subscriber registered: ${subscriber.id}`);
    
    return () => {
      this.subscribers.delete(subscriber.id);
      console.log(`📊 Analytics subscriber unregistered: ${subscriber.id}`);
    };
  }

  async publish(event: Omit<AnalyticsEvent, 'id' | 'timestamp'>): Promise<void> {
    const fullEvent: AnalyticsEvent = {
      ...event,
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString()
    };

    try {
      // Store in time-series table for high-frequency metrics
      await this.storeTimeSeriesMetric(fullEvent);

      // Broadcast to realtime channel
      await this.realtimeChannel.send({
        type: 'broadcast',
        event: 'analytics_event',
        payload: fullEvent
      });

      console.log(`📊 Analytics event published: ${event.eventType}`, fullEvent);
    } catch (error) {
      console.error('Error publishing analytics event:', error);
      // Fallback to local handling if realtime fails
      this.handleRealtimeEvent(fullEvent);
    }
  }

  private async storeTimeSeriesMetric(event: AnalyticsEvent): Promise<void> {
    const metricValue = this.extractMetricValue(event);
    if (metricValue === null) return;

    const metric = {
      user_id: event.userId,
      metric_name: event.eventType,
      value: metricValue,
      timestamp: event.timestamp,
      metadata: event.metadata
    };

    try {
      const { error } = await supabase
        .from('analytics_metrics')
        .insert(metric);

      if (error) {
        console.error('Error storing time-series metric:', error);
      }
    } catch (error) {
      console.error('Error in storeTimeSeriesMetric:', error);
    }
  }

  private extractMetricValue(event: AnalyticsEvent): number | null {
    // Extract numeric values from common event types
    switch (event.eventType) {
      case ANALYTICS_EVENTS.XP_EARNED:
        return event.metadata.amount || 0;
      case ANALYTICS_EVENTS.READING_SESSION_END:
        return event.metadata.duration || 0;
      case ANALYTICS_EVENTS.FLASHCARD_REVIEWED:
        return event.metadata.correct ? 1 : 0;
      case ANALYTICS_EVENTS.STUDY_SESSION_COMPLETE:
        return event.metadata.performance?.accuracy || 0;
      case ANALYTICS_EVENTS.DISCOVERY_WIDGET_VIEW:
      case ANALYTICS_EVENTS.DISCOVERY_WIDGET_CLICK:
      case ANALYTICS_EVENTS.WEATHER_WIDGET_VIEW:
      case ANALYTICS_EVENTS.WEATHER_CHART_INTERACT:
      case ANALYTICS_EVENTS.WEATHER_LESSON_GENERATE:
        return 1; // Count interaction events
      default:
        return 1; // Default metric value for counting events
    }
  }

  getEventHistory(): AnalyticsEvent[] {
    return [...this.eventHistory];
  }

  getEventsByType(eventType: string, limit = 50): AnalyticsEvent[] {
    return this.eventHistory
      .filter(event => event.eventType === eventType)
      .slice(0, limit);
  }

  async getTimeSeriesData(metricName: string, timeRange: string = '24h'): Promise<TimeSeriesMetric[]> {
    try {
      const { data, error } = await supabase
        .from('analytics_metrics')
        .select('*')
        .eq('metric_name', metricName)
        .gte('timestamp', new Date(Date.now() - this.parseTimeRange(timeRange)).toISOString())
        .order('timestamp', { ascending: true });

      if (error) {
        console.error('Error fetching time-series data:', error);
        return [];
      }

      return (data || []).map(item => ({
        metric_name: item.metric_name,
        value: Number(item.value),
        timestamp: item.timestamp,
        user_id: item.user_id,
        metadata: (item.metadata as Record<string, any>) || {}
      }));
    } catch (error) {
      console.error('Error in getTimeSeriesData:', error);
      return [];
    }
  }

  private parseTimeRange(range: string): number {
    const unit = range.slice(-1);
    const value = parseInt(range.slice(0, -1));
    
    switch (unit) {
      case 'h': return value * 60 * 60 * 1000;
      case 'd': return value * 24 * 60 * 60 * 1000;
      case 'w': return value * 7 * 24 * 60 * 60 * 1000;
      default: return 24 * 60 * 60 * 1000; // Default to 24 hours
    }
  }

  disconnect() {
    if (this.realtimeChannel) {
      supabase.removeChannel(this.realtimeChannel);
      this.realtimeChannel = null;
    }
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
  // Goal lifecycle events
  GOAL_CREATED: 'goal_created',
  GOAL_COMPLETED: 'goal_completed',
  GOAL_UPDATED: 'goal_updated',
  GOAL_DELETED: 'goal_deleted',
  MILESTONE_COMPLETED: 'milestone_completed',
  MILESTONE_CREATED: 'milestone_created',
  MILESTONE_DELETED: 'milestone_deleted',
  PROGRESS_UPDATED: 'progress_updated',
  GOAL_ABANDONED: 'goal_abandoned',
  // Page engagement events
  PAGE_VIEW: 'page_view',
  PAGE_EXIT: 'page_exit',
  // Other events
  NOTE_CREATED: 'note_created',
  FILE_UPLOADED: 'file_uploaded',
  XP_EARNED: 'xp_earned',
  STREAK_UPDATED: 'streak_updated',
  BADGE_EARNED: 'badge_earned',
  // Discovery widget events
  DISCOVERY_WIDGET_VIEW: 'discovery.widget.view',
  DISCOVERY_WIDGET_CLICK: 'discovery.widget.click',
  // Weather widget events
  WEATHER_WIDGET_VIEW: 'weather.widget.view',
  WEATHER_CHART_INTERACT: 'weather.chart.interact',
  WEATHER_LESSON_GENERATE: 'weather.lesson.generate'
} as const;
