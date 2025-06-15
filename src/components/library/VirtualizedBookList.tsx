
import React, { useState, useEffect, useCallback } from 'react';
import { PublicDomainBook } from '@/types/publicDomainBooks';
import { searchIndexService } from '@/services/SearchIndexService';
import { useDebouncedSearch } from '@/hooks/useDebouncedSearch';
import SearchControls from './SearchControls';
import BookListDisplay from './BookListDisplay';

interface VirtualizedBookListProps {
  books: PublicDomainBook[];
  onBookClick: (book: PublicDomainBook) => void;
  isLoading: boolean;
}

const VirtualizedBookList: React.FC<VirtualizedBookListProps> = ({
  books,
  onBookClick,
  isLoading
}) => {
  const [displayBooks, setDisplayBooks] = useState<PublicDomainBook[]>([]);

  // Use the extended API pattern for library search with suggestions
  const {
    query,
    instantResults,
    isSearching,
    searchStats,
    clearSearch,
    hasResults
  } = useDebouncedSearch({
    debounceMs: 200,
    minQueryLength: 2,
    enableInstantSearch: true,
    enableSuggestions: true
  });

  // Index books for instant search when books change
  useEffect(() => {
    if (books.length > 0) {
      console.log(`🔍 Indexing ${books.length} books for instant search...`);
      searchIndexService.indexBooks(books);
    }
  }, [books]);

  // Update displayed books based on search results
  useEffect(() => {
    if (query && hasResults) {
      console.log(`🔍 Showing ${instantResults.length} search results for "${query}"`);
      setDisplayBooks(instantResults as PublicDomainBook[]);
    } else {
      console.log(`📚 Showing all ${books.length} books`);
      setDisplayBooks(books);
    }
  }, [query, instantResults, hasResults, books]);

  const handleSearch = useCallback((searchQuery: string) => {
    console.log('🔍 Search executed:', searchQuery);
  }, []);

  const handleSuggestionSelect = useCallback((suggestion: any) => {
    console.log('💡 Suggestion selected:', suggestion);
  }, []);

  if (isLoading && books.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="inline-flex items-center gap-3">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
          <span className="text-muted-foreground">Loading books with performance optimizations...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <SearchControls
        query={query}
        isSearching={isSearching}
        searchStats={searchStats}
        hasResults={hasResults}
        resultsCount={displayBooks.length}
        onSearch={handleSearch}
        onSuggestionSelect={handleSuggestionSelect}
        onClearSearch={clearSearch}
      />

      <BookListDisplay
        books={displayBooks}
        query={query}
        isLoading={isLoading}
        onBookClick={onBookClick}
        onClearSearch={clearSearch}
      />
    </div>
  );
};

export default VirtualizedBookList;
