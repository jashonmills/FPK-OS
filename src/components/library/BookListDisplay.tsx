
import React from 'react';
import { PublicDomainBook } from '@/types/publicDomainBooks';
import { Button } from '@/components/ui/button';
import { BookOpen } from 'lucide-react';
import { useAccessibility } from '@/hooks/useAccessibility';
import BookItem from './BookItem';

interface BookListDisplayProps {
  books: PublicDomainBook[];
  query: string;
  isLoading: boolean;
  onBookClick: (book: PublicDomainBook) => void;
  onClearSearch: () => void;
}

const BookListDisplay: React.FC<BookListDisplayProps> = ({
  books,
  query,
  isLoading,
  onBookClick,
  onClearSearch
}) => {
  const { getAccessibilityClasses } = useAccessibility();

  if (books.length > 0) {
    return (
      <>
        {/* Optimized Scrollable List */}
        <div className="border rounded-lg overflow-hidden">
          <div 
            className="max-h-[600px] overflow-y-auto scroll-smooth"
            style={{ 
              scrollbarWidth: 'thin',
              scrollbarColor: 'hsl(var(--muted-foreground)) hsl(var(--muted))'
            }}
          >
            {books.map((book, index) => (
              <BookItem
                key={`${book.id}-${index}`}
                book={book}
                onBookClick={onBookClick}
              />
            ))}
          </div>
        </div>

        {/* Loading indicator for additional books */}
        {isLoading && books.length > 0 && (
          <div className="text-center py-4">
            <div className="inline-flex items-center gap-2 text-sm text-muted-foreground">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
              Loading more books...
            </div>
          </div>
        )}
      </>
    );
  }

  return (
    <div className="text-center py-12">
      <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
      <p className={`text-muted-foreground mb-4 ${getAccessibilityClasses('text')}`}>
        {query ? 'No books found matching your search.' : 'No books available.'}
      </p>
      {query && (
        <Button onClick={onClearSearch} variant="outline">
          Clear search
        </Button>
      )}
    </div>
  );
};

export default BookListDisplay;
