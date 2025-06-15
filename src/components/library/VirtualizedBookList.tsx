
import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { PublicDomainBook } from '@/types/publicDomainBooks';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, BookOpen } from 'lucide-react';
import { useAccessibility } from '@/hooks/useAccessibility';
import { performanceService } from '@/services/PerformanceOptimizationService';

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
              onClick={() => onBookClick(book)}
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
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [cachedSearchResults, setCachedSearchResults] = useState<PublicDomainBook[] | null>(null);

  // Debounce search input for performance
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Check for cached search results
  useEffect(() => {
    const checkCachedResults = async () => {
      if (!debouncedSearchTerm.trim()) {
        setCachedSearchResults(null);
        return;
      }
      
      try {
        const cached = await performanceService.getCachedSearchResults(debouncedSearchTerm);
        if (cached) {
          console.log('✅ Using cached search results for:', debouncedSearchTerm);
          setCachedSearchResults(cached);
        } else {
          setCachedSearchResults(null);
        }
      } catch (error) {
        console.warn('Failed to get cached search results:', error);
        setCachedSearchResults(null);
      }
    };

    checkCachedResults();
  }, [debouncedSearchTerm]);

  // Filter books with caching
  const filteredBooks = useMemo(() => {
    if (!debouncedSearchTerm.trim()) return books;
    
    // Use cached results if available
    if (cachedSearchResults) {
      return cachedSearchResults;
    }
    
    // Perform client-side filtering
    const term = debouncedSearchTerm.toLowerCase();
    const results = books.filter(book => 
      book.title.toLowerCase().includes(term) ||
      book.author.toLowerCase().includes(term) ||
      book.subjects?.some(subject => subject.toLowerCase().includes(term))
    );
    
    // Cache the results for future use
    if (results.length > 0) {
      performanceService.cacheSearchResults(debouncedSearchTerm, results);
    }
    
    return results;
  }, [books, debouncedSearchTerm, cachedSearchResults]);

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
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
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search books by title, author, or subject..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="pl-10"
        />
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <h3 className={`text-lg font-semibold ${getAccessibilityClasses('text')}`}>
          Available Books ({filteredBooks.length})
        </h3>
        {filteredBooks.length !== books.length && (
          <span className="text-sm text-muted-foreground">
            Filtered from {books.length} total books
          </span>
        )}
      </div>

      {/* Optimized Scrollable List */}
      {filteredBooks.length > 0 ? (
        <div className="border rounded-lg overflow-hidden">
          <div 
            className="max-h-[600px] overflow-y-auto scroll-smooth"
            style={{ 
              scrollbarWidth: 'thin',
              scrollbarColor: 'hsl(var(--muted-foreground)) hsl(var(--muted))'
            }}
          >
            {filteredBooks.map((book, index) => (
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
            No books found matching your search.
          </p>
          {searchTerm && (
            <Button onClick={() => setSearchTerm('')} variant="outline">
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
