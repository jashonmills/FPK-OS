
import React from 'react';
import { PublicDomainBook } from '@/types/publicDomainBooks';
import { Button } from '@/components/ui/button';
import { BookOpen } from 'lucide-react';
import { useAccessibility } from '@/hooks/useAccessibility';
import { performanceService } from '@/services/PerformanceOptimizationService';
import { browsingPatternsAnalyzer } from '@/services/BrowsingPatternsAnalyzer';

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

export default BookItem;
