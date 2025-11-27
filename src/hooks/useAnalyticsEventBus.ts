
import { useEffect, useRef } from 'react';
import { analyticsEventBus, AnalyticsEvent, EventSubscriber, ANALYTICS_EVENTS } from '@/services/AnalyticsEventBus';
import { useAuth } from '@/hooks/useAuth';

export const useAnalyticsEventBus = () => {
  const { user } = useAuth();

  const publishEvent = async (eventType: string, metadata: Record<string, unknown>, source = 'web') => {
    if (!user?.id) return;

    await analyticsEventBus.publish({
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

  const getTimeSeriesData = async (metricName: string, timeRange?: string) => {
    return analyticsEventBus.getTimeSeriesData(metricName, timeRange);
  };

  return {
    publishEvent,
    subscribe,
    getEventHistory,
    getEventsByType,
    getTimeSeriesData,
    EVENTS: ANALYTICS_EVENTS
  };
};

// Hook for specific event publishing with enhanced capabilities
export const useAnalyticsPublisher = () => {
  const { publishEvent, EVENTS } = useAnalyticsEventBus();

  const publishReadingSessionStart = (bookId: string, metadata = {}) => {
    publishEvent(EVENTS.READING_SESSION_START, { bookId, ...metadata });
  };

  const publishReadingSessionEnd = (bookId: string, duration: number, metadata = {}) => {
    publishEvent(EVENTS.READING_SESSION_END, { bookId, duration, ...metadata });
  };

  const publishStudySessionComplete = (sessionType: string, performance: Record<string, unknown>, metadata = {}) => {
    publishEvent(EVENTS.STUDY_SESSION_COMPLETE, { sessionType, performance, ...metadata });
  };

  const publishXPEarned = (amount: number, source: string, metadata = {}) => {
    publishEvent(EVENTS.XP_EARNED, { amount, source, ...metadata });
  };

  const publishGoalCompleted = (goalId: string, metadata = {}) => {
    publishEvent(EVENTS.GOAL_COMPLETED, { goalId, ...metadata });
  };

  const publishFlashcardReviewed = (cardId: string, correct: boolean, metadata = {}) => {
    publishEvent(EVENTS.FLASHCARD_REVIEWED, { cardId, correct, ...metadata });
  };

  const publishStreakUpdated = (streakType: string, count: number, metadata = {}) => {
    publishEvent(EVENTS.STREAK_UPDATED, { streakType, count, ...metadata });
  };

  return {
    publishReadingSessionStart,
    publishReadingSessionEnd,
    publishStudySessionComplete,
    publishXPEarned,
    publishGoalCompleted,
    publishFlashcardReviewed,
    publishStreakUpdated,
    publishEvent
  };
};

// Hook for real-time analytics updates with time-series support
export const useRealtimeAnalytics = (eventTypes: string[] = ['*']) => {
  const { subscribe, getTimeSeriesData } = useAnalyticsEventBus();
  const unsubscribeRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    const callback = (event: AnalyticsEvent) => {
      // Dispatch custom event for components to listen to
      window.dispatchEvent(new CustomEvent('analytics-event', { 
        detail: { 
          ...event, 
          isRealtime: true 
        } 
      }));
    };

    unsubscribeRef.current = subscribe(eventTypes, callback);

    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
      }
    };
  }, [eventTypes.join(',')]);

  const useEventListener = (callback: (event: AnalyticsEvent & { isRealtime?: boolean }) => void) => {
    useEffect(() => {
      const handler = (event: CustomEvent) => {
        callback(event.detail);
      };

      window.addEventListener('analytics-event', handler as EventListener);
      return () => window.removeEventListener('analytics-event', handler as EventListener);
    }, [callback]);
  };

  const useTimeSeriesMetrics = (metricName: string, timeRange = '24h') => {
    return getTimeSeriesData(metricName, timeRange);
  };

  return { 
    useEventListener, 
    useTimeSeriesMetrics 
  };
};

// Hook for anomaly detection and alerting
export const useAnomalyDetection = () => {
  const { subscribe } = useAnalyticsEventBus();

  useEffect(() => {
    const unsubscribe = subscribe(['*'], (event) => {
      // The AI Insights Engine handles anomaly detection automatically
      // This hook can be used to add custom client-side anomaly detection logic
      console.log('🔍 Event processed for anomaly detection:', event.eventType);
    });

    return unsubscribe;
  }, [subscribe]);

  return {
    // Placeholder for future client-side anomaly detection methods
    isMonitoring: true
  };
};
