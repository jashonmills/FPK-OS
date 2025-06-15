
import React from 'react';
import { Button } from '@/components/ui/button';
import { useAccessibility } from '@/hooks/useAccessibility';
import EnhancedSearchBar from './EnhancedSearchBar';

interface SearchControlsProps {
  query: string;
  isSearching: boolean;
  searchStats: any;
  hasResults: boolean;
  resultsCount: number;
  onSearch: (query: string) => void;
  onSuggestionSelect: (suggestion: any) => void;
  onClearSearch: () => void;
}

const SearchControls: React.FC<SearchControlsProps> = ({
  query,
  isSearching,
  searchStats,
  hasResults,
  resultsCount,
  onSearch,
  onSuggestionSelect,
  onClearSearch
}) => {
  const { getAccessibilityClasses } = useAccessibility();

  return (
    <div className="space-y-4">
      {/* Enhanced Search Bar */}
      <EnhancedSearchBar
        placeholder="Search books with instant suggestions and typeahead..."
        onSearch={onSearch}
        onSuggestionSelect={onSuggestionSelect}
      />

      {/* Search Performance Indicator */}
      {searchStats && (
        <div className="text-xs text-muted-foreground text-center bg-green-50 border border-green-200 rounded p-2">
          ⚡ Search index: {searchStats.indexedBooks} books • 
          History: {searchStats.totalSearches} searches • 
          Instant results enabled
        </div>
      )}

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <h3 className={`text-lg font-semibold ${getAccessibilityClasses('text')}`}>
          {query ? 'Search Results' : 'Available Books'} ({resultsCount})
        </h3>
        {query && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              {isSearching ? 'Searching...' : `Found ${resultsCount} books`}
            </span>
            <Button onClick={onClearSearch} variant="outline" size="sm">
              Clear
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchControls;
