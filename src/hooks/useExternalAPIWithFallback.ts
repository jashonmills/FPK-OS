/**
 * Hook for external APIs with circuit breaker pattern and fallbacks
 */

import { useState, useEffect, useCallback, useRef } from 'react';

interface CircuitBreakerState {
  failures: number;
  lastFailure: number;
  state: 'closed' | 'open' | 'half-open';
}

interface UseExternalAPIOptions<T> {
  fallbackData?: T;
  maxFailures?: number;
  resetTimeout?: number;
  timeout?: number;
}

export const useExternalAPIWithFallback = <T>(
  apiCall: () => Promise<T>,
  options: UseExternalAPIOptions<T> = {}
) => {
  const {
    fallbackData,
    maxFailures = 3,
    resetTimeout = 60000, // 1 minute
    timeout = 5000 // 5 seconds
  } = options;

  const [data, setData] = useState<T | null>(fallbackData || null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [isUsingFallback, setIsUsingFallback] = useState(false);

  const circuitBreaker = useRef<CircuitBreakerState>({
    failures: 0,
    lastFailure: 0,
    state: 'closed'
  });

  const shouldAllowRequest = useCallback(() => {
    const now = Date.now();
    const { failures, lastFailure, state } = circuitBreaker.current;

    if (state === 'open') {
      if (now - lastFailure > resetTimeout) {
        circuitBreaker.current.state = 'half-open';
        return true;
      }
      return false;
    }

    return true;
  }, [resetTimeout]);

  const recordSuccess = useCallback(() => {
    circuitBreaker.current = {
      failures: 0,
      lastFailure: 0,
      state: 'closed'
    };
  }, []);

  const recordFailure = useCallback(() => {
    const now = Date.now();
    circuitBreaker.current.failures += 1;
    circuitBreaker.current.lastFailure = now;

    if (circuitBreaker.current.failures >= maxFailures) {
      circuitBreaker.current.state = 'open';
    }
  }, [maxFailures]);

  const fetchData = useCallback(async () => {
    if (!shouldAllowRequest()) {
      console.warn('Circuit breaker is open, using fallback data');
      if (fallbackData) {
        setData(fallbackData);
        setIsUsingFallback(true);
      }
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Add timeout to the request
      const timeoutPromise = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('Request timeout')), timeout)
      );

      const result = await Promise.race([apiCall(), timeoutPromise]);
      
      setData(result);
      setIsUsingFallback(false);
      recordSuccess();
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error');
      console.warn('External API call failed:', error.message);
      
      setError(error);
      recordFailure();
      
      if (fallbackData) {
        setData(fallbackData);
        setIsUsingFallback(true);
      }
    } finally {
      setIsLoading(false);
    }
  }, [apiCall, shouldAllowRequest, fallbackData, timeout, recordSuccess, recordFailure]);

  const retry = useCallback(() => {
    // Reset circuit breaker for manual retry
    circuitBreaker.current.state = 'closed';
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    data,
    isLoading,
    error,
    isUsingFallback,
    retry,
    circuitBreakerState: circuitBreaker.current.state
  };
};