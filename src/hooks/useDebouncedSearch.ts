
/**
 * Debounced search hook for optimized API calls
 */

import { useState, useEffect, useCallback, useRef } from 'react';

interface DebouncedSearchOptions {
  debounceMs?: number;
  minQueryLength?: number;
}

export const useDebouncedSearch = <T>(
  searchFunction: (query: string) => Promise<T>,
  options: DebouncedSearchOptions = {}
) => {
  const {
    debounceMs = 300,
    minQueryLength = 2
  } = options;

  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchTimeoutRef = useRef<NodeJS.Timeout>();

  // Debounce the search query
  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(() => {
      setDebouncedQuery(query);
    }, debounceMs);

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [query, debounceMs]);

  // Execute search when debounced query changes
  useEffect(() => {
    if (debouncedQuery.length >= minQueryLength) {
      setIsSearching(true);
      setError(null);
      
      searchFunction(debouncedQuery)
        .catch((err) => {
          console.error('Search error:', err);
          setError(err instanceof Error ? err.message : 'Search failed');
        })
        .finally(() => {
          setIsSearching(false);
        });
    } else {
      setIsSearching(false);
      setError(null);
    }
  }, [debouncedQuery, minQueryLength, searchFunction]);

  const performSearch = useCallback((searchQuery: string) => {
    setQuery(searchQuery);
  }, []);

  const clearSearch = useCallback(() => {
    setQuery('');
    setDebouncedQuery('');
    setError(null);
    setIsSearching(false);
  }, []);

  return {
    // State
    query,
    debouncedQuery,
    isSearching,
    error,
    
    // Actions
    performSearch,
    clearSearch,
    
    // Helpers
    isActive: query.length >= minQueryLength
  };
};
