
/**
 * Enhanced search bar with instant suggestions and typeahead
 */

import React, { useState, useRef, useEffect } from 'react';
import { Search, Zap, TrendingUp, Clock } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { searchIndexService } from '@/services/SearchIndexService';
import { browsingPatternsAnalyzer } from '@/services/BrowsingPatternsAnalyzer';

interface SearchSuggestion {
  term: string;
  type: 'title' | 'author' | 'subject';
  bookCount: number;
  books: string[];
}

interface EnhancedSearchBarProps {
  placeholder?: string;
  onSearch?: (query: string) => void;
  onSuggestionSelect?: (suggestion: SearchSuggestion) => void;
  className?: string;
}

const EnhancedSearchBar: React.FC<EnhancedSearchBarProps> = ({
  placeholder = "Search books with instant suggestions...",
  onSearch,
  onSuggestionSelect,
  className = ""
}) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [isSearching, setIsSearching] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  // Get search stats and popular terms
  const searchStats = searchIndexService.getSearchStats();
  const popularTerms = searchIndexService.getPopularTerms();

  // Debounced suggestion fetching
  useEffect(() => {
    const timer = setTimeout(() => {
      if (query.trim() && query.length >= 2) {
        setIsSearching(true);
        console.log('🔍 Fetching suggestions for:', query);
        
        const fetchedSuggestions = searchIndexService.getInstantSuggestions(query, 8);
        console.log('💡 Got suggestions:', fetchedSuggestions);
        
        setSuggestions(fetchedSuggestions);
        setShowSuggestions(fetchedSuggestions.length > 0);
        setIsSearching(false);
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
        setIsSearching(false);
      }
      setSelectedIndex(-1);
    }, 150);

    return () => clearTimeout(timer);
  }, [query]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    
    // Record search event for pattern analysis
    if (value.length >= 2) {
      browsingPatternsAnalyzer.recordEvent('search', 'search', { query: value });
    }
    
    // Immediately notify parent of search
    onSearch?.(value);
  };

  const handleSuggestionClick = (suggestion: SearchSuggestion) => {
    setQuery(suggestion.term);
    setShowSuggestions(false);
    onSuggestionSelect?.(suggestion);
    onSearch?.(suggestion.term);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => Math.min(prev + 1, suggestions.length - 1));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => Math.max(prev - 1, -1));
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && suggestions[selectedIndex]) {
          handleSuggestionClick(suggestions[selectedIndex]);
        } else if (query) {
          setShowSuggestions(false);
          onSearch?.(query);
        }
        break;
      case 'Escape':
        setShowSuggestions(false);
        setSelectedIndex(-1);
        inputRef.current?.blur();
        break;
    }
  };

  const handlePopularTermClick = (term: string) => {
    setQuery(term);
    onSearch?.(term);
  };

  const clearSearch = () => {
    setQuery('');
    setSuggestions([]);
    setShowSuggestions(false);
    onSearch?.('');
  };

  const getSuggestionIcon = (type: string) => {
    switch (type) {
      case 'author': return '👤';
      case 'subject': return '📚';
      case 'title': return '📖';
      default: return '🔍';
    }
  };

  return (
    <div className={`relative w-full max-w-2xl mx-auto ${className}`}>
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          ref={inputRef}
          type="search"
          placeholder={placeholder}
          value={query}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => query.length >= 2 && setShowSuggestions(true)}
          className="pl-10 pr-20"
        />
        
        {/* Search Stats & Clear Button */}
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
          {isSearching && (
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          )}
          {query && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearSearch}
              className="h-6 w-6 p-0"
            >
              ×
            </Button>
          )}
        </div>
      </div>

      {/* Enhanced Suggestions Dropdown */}
      {showSuggestions && (
        <div
          ref={suggestionsRef}
          className="absolute z-50 w-full mt-1 bg-card border border-border rounded-md shadow-lg max-h-80 overflow-y-auto"
        >
          {suggestions.map((suggestion, index) => (
            <div
              key={`${suggestion.type}-${suggestion.term}`}
              className={`flex items-center gap-3 p-3 cursor-pointer transition-colors hover:bg-muted/50 border-b border-border last:border-b-0 ${
                index === selectedIndex ? 'bg-muted/50' : ''
              }`}
              onClick={() => handleSuggestionClick(suggestion)}
              onMouseEnter={() => setSelectedIndex(index)}
            >
              <span className="text-lg">{getSuggestionIcon(suggestion.type)}</span>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate">{suggestion.term}</p>
                <p className="text-xs text-muted-foreground">
                  {suggestion.bookCount} book{suggestion.bookCount !== 1 ? 's' : ''} • {suggestion.type}
                </p>
              </div>
              <Zap className="h-3 w-3 text-primary" />
            </div>
          ))}

          {/* Popular Terms Section */}
          {!query && popularTerms.length > 0 && (
            <div className="border-t border-border p-3">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium text-muted-foreground">Popular Searches</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {popularTerms.slice(0, 5).map(term => (
                  <button
                    key={term}
                    onClick={() => handlePopularTermClick(term)}
                    className="px-2 py-1 text-xs bg-secondary text-secondary-foreground rounded hover:bg-secondary/80 transition-colors"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Search Performance Stats */}
      {searchStats && query.length >= 2 && (
        <div className="mt-2 text-xs text-muted-foreground text-center">
          <div className="flex items-center justify-center gap-4">
            <span className="flex items-center gap-1">
              <Zap className="h-3 w-3" />
              {searchStats.indexedBooks} books indexed
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              Instant search enabled
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default EnhancedSearchBar;
