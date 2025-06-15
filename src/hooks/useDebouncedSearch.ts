
/**
 * Debounced search hook for optimized API calls
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { searchIndexService } from '@/services/SearchIndexService';
import { PublicDomainBook } from '@/types/publicDomainBooks';

interface SearchSuggestion {
  term: string;
  type: 'title' | 'author' | 'subject';
  bookCount: number;
  books: string[];
}

interface DebouncedSearchOptions {
  debounceMs?: number;
  minQueryLength?: number;
  enableInstantSearch?: boolean;
  enableSuggestions?: boolean;
}

export const useDebouncedSearch = (options: DebouncedSearchOptions = {}) => {
  const {
    debounceMs = 300,
    minQueryLength = 2,
    enableInstantSearch = true,
    enableSuggestions = true
  } = options;

  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [instantResults, setInstantResults] = useState<PublicDomainBook[]>([]);
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchStats, setSearchStats] = useState<any>(null);

  const searchTimeoutRef = useRef<NodeJS.Timeout>();
  const lastQueryRef = useRef('');

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

  // Perform instant search when debounced query changes
  useEffect(() => {
    if (!enableInstantSearch) return;

    if (debouncedQuery.length >= minQueryLength) {
      setIsSearching(true);
      
      try {
        const results = searchIndexService.instantSearch(debouncedQuery);
        setInstantResults(results);
        
        // Record search for analytics
        if (debouncedQuery !== lastQueryRef.current) {
          searchIndexService.recordSearch(debouncedQuery);
          lastQueryRef.current = debouncedQuery;
        }
      } catch (error) {
        console.error('Instant search error:', error);
        setInstantResults([]);
      } finally {
        setIsSearching(false);
      }
    } else {
      setInstantResults([]);
      setIsSearching(false);
    }
  }, [debouncedQuery, minQueryLength, enableInstantSearch]);

  // Get suggestions as user types (no debounce for responsiveness)
  useEffect(() => {
    if (!enableSuggestions) return;

    if (query.length >= minQueryLength) {
      try {
        const newSuggestions = searchIndexService.getInstantSuggestions(query, 8);
        setSuggestions(newSuggestions);
      } catch (error) {
        console.error('Suggestions error:', error);
        setSuggestions([]);
      }
    } else {
      setSuggestions([]);
    }
  }, [query, minQueryLength, enableSuggestions]);

  // Update search stats periodically
  useEffect(() => {
    const updateStats = () => {
      setSearchStats(searchIndexService.getSearchStats());
    };

    updateStats();
    const interval = setInterval(updateStats, 5000);
    return () => clearInterval(interval);
  }, []);

  const performSearch = useCallback((searchQuery: string) => {
    setQuery(searchQuery);
  }, []);

  const selectSuggestion = useCallback((suggestion: SearchSuggestion) => {
    setQuery(suggestion.term);
    setSuggestions([]);
    searchIndexService.recordSearch(suggestion.term);
  }, []);

  const clearSearch = useCallback(() => {
    setQuery('');
    setDebouncedQuery('');
    setInstantResults([]);
    setSuggestions([]);
    setIsSearching(false);
  }, []);

  const getPopularTerms = useCallback(() => {
    return searchIndexService.getPopularTerms();
  }, []);

  return {
    // State
    query,
    debouncedQuery,
    instantResults,
    suggestions,
    isSearching,
    searchStats,
    
    // Actions
    performSearch,
    selectSuggestion,
    clearSearch,
    getPopularTerms,
    
    // Helpers
    hasResults: instantResults.length > 0,
    hasSuggestions: suggestions.length > 0,
    isActive: query.length >= minQueryLength
  };
};
