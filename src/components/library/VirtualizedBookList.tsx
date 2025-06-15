
import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { PublicDomainBook } from '@/types/publicDomainBooks';
import { Button } from '@/components/ui/button';
import { BookOpen } from 'lucide-react';
import { useAccessibility } from '@/hooks/useAccessibility';
import { performanceService } from '@/services/PerformanceOptimizationService';
import { searchIndexService } from '@/services/SearchIndexService';
import { browsingPatternsAnalyzer } from '@/services/BrowsingPatternsAnalyzer';
import { useDebouncedSearch } from '@/hooks/useDebouncedSearch';
import EnhancedSearchBar from './EnhancedSearchBar';

interface VirtualizedBookListProps {
  books: PublicDomainBook[];
  onBookClick: (book: PublicDomainBook) => void;
  isLoading: boolean;
}

interface BookItemProps {
  book: PublicDomainBook;
  onBookClick: (book: PublicDomainBook) => void;
}

const BookItem: React.FC<BookItemProps> = ({ book, onBookClick }) => {
  const { getAccessibilityClasses } = useAccessibility();

  const handleImageError = (event: React.SyntheticEvent<HTMLImageElement>) => {
    const target = event.target as HTMLImageElement;
    target.style.display = 'none';
    const parent = target.parentElement;
    if (parent) {
      parent.innerHTML = '<div class="w-full h-full bg-gradient-to-br from-primary/10 to-primary/20 flex items-center justify-center"><div class="h-6 w-6 text-primary/40">📖</div></div>';
    }
  };

  const handleImageLoad = (event: React.SyntheticEvent<HTMLImageElement>) => {
    const target = event.target as HTMLImageElement;
    if (book.cover_url) {
      performanceService.optimizeImageLoading(target, book.cover_url);
    }
  };

  const handleBookView = () => {
    // Record browsing event for pattern analysis
    browsingPatternsAnalyzer.recordEvent(book.id, 'view', {
      title: book.title,
      author: book.author,
      subjects: book.subjects
    });
    
    onBookClick(book);
  };

  return (
    <div className="px-4 py-2">
      <div className="border rounded-lg p-4 hover:shadow-md transition-shadow duration-200 bg-background">
        <div className="flex gap-3">
          {/* Book Cover */}
          <div className="flex-shrink-0 w-12 h-16 bg-muted rounded overflow-hidden">
            {book.cover_url ? (
              <img
                src={book.cover_url}
                alt={`Cover of ${book.title}`}
                className="w-full h-full object-cover"
                loading="lazy"
                onError={handleImageError}
                onLoad={handleImageLoad}
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-primary/10 to-primary/20 flex items-center justify-center">
                <BookOpen className="h-6 w-6 text-primary/40" />
              </div>
            )}
          </div>

          {/* Book Details */}
          <div className="flex-1 min-w-0">
            <h4 className={`font-medium text-sm leading-tight line-clamp-2 mb-1 ${getAccessibilityClasses('text')}`}>
              {book.title}
            </h4>
            <p className={`text-xs text-muted-foreground line-clamp-1 mb-2 ${getAccessibilityClasses('text')}`}>
              by {book.author}
            </p>
            {book.subjects && book.subjects.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-2">
                {book.subjects.slice(0, 2).map((subject, subjectIndex) => (
                  <span 
                    key={subjectIndex}
                    className="text-xs bg-secondary text-secondary-foreground px-1.5 py-0.5 rounded"
                  >
                    {subject}
                  </span>
                ))}
              </div>
            )}
            <Button 
              onClick={handleBookView}
              size="sm"
              className="w-full"
              variant="outline"
            >
              <BookOpen className="h-3 w-3 mr-1" />
              Read
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

const VirtualizedBookList: React.FC<VirtualizedBookListProps> = ({
  books,
  onBookClick,
  isLoading
}) => {
  const { getAccessibilityClasses } = useAccessibility();
  const [displayBooks, setDisplayBooks] = useState<PublicDomainBook[]>([]);

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
      console.log('🔍 Indexing books for instant search...');
      searchIndexService.indexBooks(books);
    }
  }, [books]);

  // Update displayed books based on search results
  useEffect(() => {
    if (query && hasResults) {
      setDisplayBooks(instantResults);
    } else {
      setDisplayBooks(books);
    }
  }, [query, instantResults, hasResults, books]);

  const handleSearch = useCallback((searchQuery: string) => {
    // Search is handled by the debounced search hook
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
      {/* Enhanced Search Bar */}
      <EnhancedSearchBar
        placeholder="Search books with instant suggestions and typeahead..."
        onSearch={handleSearch}
        onSuggestionSelect={handleSuggestionSelect}
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
          {query ? 'Search Results' : 'Available Books'} ({displayBooks.length})
        </h3>
        {query && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              {isSearching ? 'Searching...' : `Found ${displayBooks.length} books`}
            </span>
            <Button onClick={clearSearch} variant="outline" size="sm">
              Clear
            </Button>
          </div>
        )}
      </div>

      {/* Optimized Scrollable List */}
      {displayBooks.length > 0 ? (
        <div className="border rounded-lg overflow-hidden">
          <div 
            className="max-h-[600px] overflow-y-auto scroll-smooth"
            style={{ 
              scrollbarWidth: 'thin',
              scrollbarColor: 'hsl(var(--muted-foreground)) hsl(var(--muted))'
            }}
          >
            {displayBooks.map((book, index) => (
              <BookItem
                key={`${book.id}-${index}`}
                book={book}
                onBookClick={onBookClick}
              />
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-12">
          <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <p className={`text-muted-foreground mb-4 ${getAccessibilityClasses('text')}`}>
            {query ? 'No books found matching your search.' : 'No books available.'}
          </p>
          {query && (
            <Button onClick={clearSearch} variant="outline">
              Clear search
            </Button>
          )}
        </div>
      )}

      {/* Loading indicator for additional books */}
      {isLoading && books.length > 0 && (
        <div className="text-center py-4">
          <div className="inline-flex items-center gap-2 text-sm text-muted-foreground">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
            Loading more books...
          </div>
        </div>
      )}
    </div>
  );
};

export default VirtualizedBookList;
