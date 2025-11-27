import { useRef } from 'react';

/**
 * Hook to prevent duplicate real-time event processing
 * Useful for preventing UI flicker from duplicate notifications
 */
export function useRealtimeDeduplication(windowMs: number = 1000) {
  const recentEventsRef = useRef<Set<string>>(new Set());

  const isDuplicate = (eventId: string): boolean => {
    const key = `${eventId}-${Date.now()}`;
    
    if (recentEventsRef.current.has(eventId)) {
      return true;
    }

    // Add to deduplication set
    recentEventsRef.current.add(eventId);

    // Clean up old entries
    setTimeout(() => {
      recentEventsRef.current.delete(eventId);
    }, windowMs);

    return false;
  };

  const markProcessed = (eventId: string) => {
    recentEventsRef.current.add(eventId);
  };

  return { isDuplicate, markProcessed };
}