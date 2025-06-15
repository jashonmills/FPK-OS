
import React, { useState, useMemo } from 'react';
import { PublicDomainBook } from '@/types/publicDomainBooks';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp, BookOpen, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useAccessibility } from '@/hooks/useAccessibility';

interface OptimizedPublicDomainBooksListProps {
  books: PublicDomainBook[];
  isLoading: boolean;
}

const OptimizedPublicDomainBooksList: React.FC<OptimizedPublicDomainBooksListProps> = ({
  books,
  isLoading
}) => {
  const { getAccessibilityClasses } = useAccessibility();
  const [isExpanded, setIsExpanded] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Optimized filtering with useMemo
  const filteredBooks = useMemo(() => {
    if (!searchTerm.trim()) return books;
    
    const term = searchTerm.toLowerCase();
    return books.filter(book => 
      book.title.toLowerCase().includes(term) ||
      book.author.toLowerCase().includes(term) ||
      book.subjects?.some(subject => subject.toLowerCase().includes(term))
    );
  }, [books, searchTerm]);

  // Show only first 6 books when collapsed for better performance
  const displayBooks = isExpanded ? filteredBooks : filteredBooks.slice(0, 6);

  const handleReadClick = (book: PublicDomainBook) => {
    // Lazy load the EPUB reader only when needed
    import('./EPUBReader').then(({ default: EPUBReader }) => {
      // This would need to be handled by the parent component
      console.log('Opening book:', book.title);
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className={`text-lg font-semibold ${getAccessibilityClasses('text')}`}>
          All Available Books ({books.length})
        </h3>
        <Button 
          variant="ghost" 
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-2"
          disabled={isLoading}
        >
          {isExpanded ? (
            <>
              <ChevronUp className="h-4 w-4" />
              Show Less
            </>
          ) : (
            <>
              <ChevronDown className="h-4 w-4" />
              Show All
            </>
          )}
        </Button>
      </div>

      {isExpanded && (
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search books by title, author, or subject..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {displayBooks.map((book) => (
          <div
            key={book.id}
            className="border rounded-lg p-4 hover:shadow-md transition-shadow duration-200"
          >
            <div className="flex gap-3">
              {/* Lazy loaded book cover */}
              <div className="flex-shrink-0 w-12 h-16 bg-muted rounded overflow-hidden">
                {book.cover_url ? (
                  <img
                    src={book.cover_url}
                    alt={`Cover of ${book.title}`}
                    className="w-full h-full object-cover"
                    loading="lazy" // Native lazy loading for better performance
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      target.parentElement!.innerHTML = '<div class="w-full h-full bg-gradient-to-br from-primary/10 to-primary/20 flex items-center justify-center"><div class="h-6 w-6 text-primary/40">📖</div></div>';
                    }}
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-primary/10 to-primary/20 flex items-center justify-center">
                    <BookOpen className="h-6 w-6 text-primary/40" />
                  </div>
                )}
              </div>

              {/* Book details */}
              <div className="flex-1 min-w-0">
                <h4 className={`font-medium text-sm leading-tight line-clamp-2 mb-1 ${getAccessibilityClasses('text')}`}>
                  {book.title}
                </h4>
                <p className={`text-xs text-muted-foreground line-clamp-1 mb-2 ${getAccessibilityClasses('text')}`}>
                  by {book.author}
                </p>
                {book.subjects && book.subjects.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-2">
                    {book.subjects.slice(0, 2).map((subject, index) => (
                      <span 
                        key={index}
                        className="text-xs bg-secondary text-secondary-foreground px-1.5 py-0.5 rounded"
                      >
                        {subject}
                      </span>
                    ))}
                  </div>
                )}
                <Button 
                  onClick={() => handleReadClick(book)}
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
        ))}
      </div>

      {/* Show more indicator */}
      {!isExpanded && filteredBooks.length > 6 && (
        <div className="text-center pt-2">
          <p className="text-sm text-muted-foreground">
            Showing 6 of {filteredBooks.length} books. Click "Show All" to see more.
          </p>
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

export default OptimizedPublicDomainBooksList;
