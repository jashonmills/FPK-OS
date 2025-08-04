/**
 * Request deduplication hook to prevent duplicate API calls
 */

import { useRef, useCallback } from 'react';

interface RequestInfo {
  promise: Promise<any>;
  timestamp: number;
}

export const useRequestDeduplication = (ttl: number = 5000) => {
  const requestCache = useRef<Map<string, RequestInfo>>(new Map());

  const deduplicateRequest = useCallback(async <T>(
    key: string,
    requestFn: () => Promise<T>
  ): Promise<T> => {
    const now = Date.now();
    const cached = requestCache.current.get(key);

    // Return cached promise if it exists and is still valid
    if (cached && (now - cached.timestamp) < ttl) {
      return cached.promise;
    }

    // Create new request
    const promise = requestFn().finally(() => {
      // Clean up cache entry after request completes
      setTimeout(() => {
        requestCache.current.delete(key);
      }, ttl);
    });

    // Cache the promise
    requestCache.current.set(key, {
      promise,
      timestamp: now
    });

    return promise;
  }, [ttl]);

  const clearCache = useCallback(() => {
    requestCache.current.clear();
  }, []);

  return {
    deduplicateRequest,
    clearCache
  };
};