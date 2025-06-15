
import React, { useState, useEffect, useCallback } from 'react';
import { PublicDomainBook } from '@/types/publicDomainBooks';
import { searchIndexService } from '@/services/SearchIndexService';
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
  const [query, setQuery] = useState('');
  const [displayBooks, setDisplayBooks] = useState<PublicDomainBook[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchStats, setSearchStats] = useState<any>(null);

  // Index books for instant search when books change
  useEffect(() => {
    if (books.length > 0) {
      console.log(`🔍 Indexing ${books.length} books for instant search...`);
      searchIndexService.indexBooks(books);
      
      // Update search stats
      const stats = searchIndexService.getSearchStats();
      setSearchStats(stats);
      console.log('📊 Search stats updated:', stats);
      
      // Show all books initially
      setDisplayBooks(books);
    }
  }, [books]);

  // Perform instant search when query changes
  useEffect(() => {
    const performSearch = async () => {
      if (query.trim() && query.length >= 1) {
        setIsSearching(true);
        console.log(`🔍 Performing instant search for: "${query}"`);
        
        // Use a small delay to show the searching state
        setTimeout(() => {
          const results = searchIndexService.instantSearch(query);
          console.log(`✅ Found ${results.length} results for "${query}"`);
          setDisplayBooks(results);
          
          // Record the search for analytics
          searchIndexService.recordSearch(query);
          setIsSearching(false);
        }, 100);
      } else {
        console.log(`📚 Showing all ${books.length} books`);
        setDisplayBooks(books);
        setIsSearching(false);
      }
    };

    performSearch();
  }, [query, books]);

  const handleSearch = useCallback((searchQuery: string) => {
    console.log('🔍 Search executed:', searchQuery);
    setQuery(searchQuery);
  }, []);

  const handleSuggestionSelect = useCallback((suggestion: any) => {
    console.log('💡 Suggestion selected:', suggestion);
    setQuery(suggestion.term);
  }, []);

  const clearSearch = useCallback(() => {
    console.log('🧹 Clearing search');
    setQuery('');
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
        hasResults={displayBooks.length > 0}
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
