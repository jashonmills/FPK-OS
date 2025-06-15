
/**
 * Debounced search hook for optimized API calls
 */

import { useState, useEffect, useCallback, useRef } from 'react';

interface DebouncedSearchOptions {
  debounceMs?: number;
  minQueryLength?: number;
  enableInstantSearch?: boolean;
  enableSuggestions?: boolean;
}

interface SearchSuggestion {
  term: string;
  type: 'title' | 'author' | 'subject';
  bookCount: number;
  books: string[];
}

interface SearchStats {
  indexedBooks: number;
  totalSearches: number;
  popularTerms: number;
}

export const useDebouncedSearch = <T>(
  searchFunction: ((query: string) => Promise<T>) | DebouncedSearchOptions,
  options?: DebouncedSearchOptions
) => {
  // Handle both old and new API patterns
  const isLegacyAPI = typeof searchFunction === 'function';
  const actualOptions = isLegacyAPI ? (options || {}) : (searchFunction as DebouncedSearchOptions);
  const actualSearchFunction = isLegacyAPI ? searchFunction as (query: string) => Promise<T> : undefined;

  const {
    debounceMs = 300,
    minQueryLength = 2,
    enableInstantSearch = false,
    enableSuggestions = false
  } = actualOptions;

  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<T[]>([]);

  // Legacy API support - for library components
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [searchStats] = useState<SearchStats>({
    indexedBooks: 1000,
    totalSearches: 50,
    popularTerms: 10
  });

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
    if (debouncedQuery.length >= minQueryLength && actualSearchFunction) {
      setIsSearching(true);
      setError(null);
      
      actualSearchFunction(debouncedQuery)
        .then((searchResults) => {
          setResults(Array.isArray(searchResults) ? searchResults : []);
        })
        .catch((err) => {
          console.error('Search error:', err);
          setError(err instanceof Error ? err.message : 'Search failed');
          setResults([]);
        })
        .finally(() => {
          setIsSearching(false);
        });
    } else if (debouncedQuery.length < minQueryLength) {
      setIsSearching(false);
      setError(null);
      setResults([]);
    }
  }, [debouncedQuery, minQueryLength, actualSearchFunction]);

  const performSearch = useCallback((searchQuery: string) => {
    setQuery(searchQuery);
  }, []);

  const clearSearch = useCallback(() => {
    setQuery('');
    setDebouncedQuery('');
    setError(null);
    setIsSearching(false);
    setResults([]);
    setSuggestions([]);
  }, []);

  const selectSuggestion = useCallback((suggestion: SearchSuggestion) => {
    setQuery(suggestion.term);
  }, []);

  const getPopularTerms = useCallback(() => {
    return ['science', 'history', 'literature', 'mathematics', 'philosophy'];
  }, []);

  // Return different interfaces based on usage pattern
  if (isLegacyAPI) {
    // Legacy API for simple search function
    return {
      query,
      debouncedQuery,
      isSearching,
      error,
      performSearch,
      clearSearch,
      isActive: query.length >= minQueryLength
    };
  }

  // Extended API for library components with suggestions
  return {
    query,
    debouncedQuery,
    instantResults: results,
    suggestions,
    isSearching,
    searchStats,
    performSearch,
    selectSuggestion,
    clearSearch,
    getPopularTerms,
    hasResults: results.length > 0,
    isActive: query.length >= minQueryLength
  };
};
