
import { useEffect, useRef } from 'react';
import { analyticsEventBus, AnalyticsEvent, EventSubscriber, ANALYTICS_EVENTS } from '@/services/AnalyticsEventBus';
import { useAuth } from '@/hooks/useAuth';

export const useAnalyticsEventBus = () => {
  const { user } = useAuth();

  const publishEvent = (eventType: string, metadata: Record<string, any>, source = 'web') => {
    if (!user?.id) return;

    analyticsEventBus.publish({
      userId: user.id,
      eventType,
      metadata,
      source,
      sessionId: crypto.randomUUID()
    });
  };

  const subscribe = (eventTypes: string[], callback: (event: AnalyticsEvent) => void) => {
    const subscriber: EventSubscriber = {
      id: crypto.randomUUID(),
      eventTypes,
      callback
    };

    return analyticsEventBus.subscribe(subscriber);
  };

  const getEventHistory = () => {
    return analyticsEventBus.getEventHistory();
  };

  const getEventsByType = (eventType: string, limit?: number) => {
    return analyticsEventBus.getEventsByType(eventType, limit);
  };

  return {
    publishEvent,
    subscribe,
    getEventHistory,
    getEventsByType,
    EVENTS: ANALYTICS_EVENTS
  };
};

// Hook for specific event publishing
export const useAnalyticsPublisher = () => {
  const { publishEvent, EVENTS } = useAnalyticsEventBus();

  const publishReadingSessionStart = (bookId: string, metadata = {}) => {
    publishEvent(EVENTS.READING_SESSION_START, { bookId, ...metadata });
  };

  const publishReadingSessionEnd = (bookId: string, duration: number, metadata = {}) => {
    publishEvent(EVENTS.READING_SESSION_END, { bookId, duration, ...metadata });
  };

  const publishStudySessionComplete = (sessionType: string, performance: any, metadata = {}) => {
    publishEvent(EVENTS.STUDY_SESSION_COMPLETE, { sessionType, performance, ...metadata });
  };

  const publishXPEarned = (amount: number, source: string, metadata = {}) => {
    publishEvent(EVENTS.XP_EARNED, { amount, source, ...metadata });
  };

  const publishGoalCompleted = (goalId: string, metadata = {}) => {
    publishEvent(EVENTS.GOAL_COMPLETED, { goalId, ...metadata });
  };

  return {
    publishReadingSessionStart,
    publishReadingSessionEnd,
    publishStudySessionComplete,
    publishXPEarned,
    publishGoalCompleted,
    publishEvent
  };
};

// Hook for real-time analytics updates
export const useRealtimeAnalytics = (eventTypes: string[] = ['*']) => {
  const { subscribe } = useAnalyticsEventBus();
  const unsubscribeRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    const callback = (event: AnalyticsEvent) => {
      // Dispatch custom event for components to listen to
      window.dispatchEvent(new CustomEvent('analytics-event', { detail: event }));
    };

    unsubscribeRef.current = subscribe(eventTypes, callback);

    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
      }
    };
  }, [eventTypes.join(',')]);

  const useEventListener = (callback: (event: AnalyticsEvent) => void) => {
    useEffect(() => {
      const handler = (event: CustomEvent) => {
        callback(event.detail);
      };

      window.addEventListener('analytics-event', handler as EventListener);
      return () => window.removeEventListener('analytics-event', handler as EventListener);
    }, [callback]);
  };

  return { useEventListener };
};
