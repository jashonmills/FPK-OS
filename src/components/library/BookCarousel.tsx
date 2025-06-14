
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { BookOpen, ExternalLink } from 'lucide-react';
import { useAccessibility } from '@/hooks/useAccessibility';

interface BookItem {
  id: string | number;
  title: string;
  author: string;
  cover_url?: string;
  subjects?: string[];
  gutenberg_id?: number;
  onReadClick: () => void;
  onExternalClick?: () => void;
}

interface BookCarouselProps {
  books: BookItem[];
  sectionId: string;
  title: string;
  description: string;
  isLoading?: boolean;
  error?: string;
}

type ViewMode = 'carousel' | 'list';

const BookCarousel: React.FC<BookCarouselProps> = ({
  books,
  sectionId,
  title,
  description,
  isLoading = false,
  error = null
}) => {
  const { getAccessibilityClasses } = useAccessibility();
  
  // View mode state with localStorage persistence
  const [viewMode, setViewMode] = useState<ViewMode>(() => {
    const saved = localStorage.getItem(`${sectionId}-viewMode`);
    return (saved as ViewMode) || 'carousel';
  });

  // Persist view mode changes to localStorage
  useEffect(() => {
    localStorage.setItem(`${sectionId}-viewMode`, viewMode);
  }, [viewMode, sectionId]);

  if (isLoading) {
    return (
      <section className="space-y-6">
        <div className="text-center">
          <h2 className={`text-2xl font-semibold mb-2 ${getAccessibilityClasses('text')}`}>
            {title}
          </h2>
          <p className={`text-muted-foreground ${getAccessibilityClasses('text')}`}>
            Loading books...
          </p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="space-y-6">
        <div className="text-center">
          <h2 className={`text-2xl font-semibold mb-2 ${getAccessibilityClasses('text')}`}>
            {title}
          </h2>
          <p className="text-destructive">{error}</p>
        </div>
      </section>
    );
  }

  const renderBookCard = (book: BookItem) => (
    <Card 
      key={book.id}
      className="hover:shadow-lg transition-all duration-200 cursor-pointer border-2 hover:border-primary/20 h-full"
    >
      <CardContent className="p-4 h-full">
        <div className="flex flex-col h-full">
          {/* Top section - takes available space */}
          <div className="flex-1 space-y-3">
            {/* Book Cover */}
            <div className="aspect-[3/4] bg-muted rounded-lg overflow-hidden flex items-center justify-center">
              {book.cover_url ? (
                <img
                  src={book.cover_url}
                  alt={`Cover of ${book.title}`}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    target.parentElement!.innerHTML = '<div class="w-full h-full bg-gradient-to-br from-primary/10 to-primary/20 flex items-center justify-center"><svg class="h-12 w-12 text-primary/40" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path></svg></div>';
                  }}
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-primary/10 to-primary/20 flex items-center justify-center">
                  <BookOpen className="h-12 w-12 text-primary/40" />
                </div>
              )}
            </div>
            
            {/* Book Info */}
            <div className="space-y-2">
              <h3 className={`font-semibold text-sm leading-tight line-clamp-2 ${getAccessibilityClasses('text')}`}>
                {book.title}
              </h3>
              <p className={`text-xs text-muted-foreground line-clamp-1 ${getAccessibilityClasses('text')}`}>
                by {book.author}
              </p>
              {book.subjects && book.subjects.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {book.subjects.slice(0, 2).map((subject, index) => (
                    <span 
                      key={index}
                      className="text-xs bg-secondary text-secondary-foreground px-2 py-1 rounded"
                    >
                      {subject}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Bottom section - pinned to bottom */}
          <div className="flex gap-2 mt-3">
            <Button 
              onClick={book.onReadClick}
              className="flex-1"
              size="sm"
            >
              <BookOpen className="h-4 w-4 mr-2" />
              Read
            </Button>
            {book.onExternalClick && (
              <Button 
                variant="outline"
                size="sm"
                onClick={book.onExternalClick}
              >
                <ExternalLink className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const renderCarouselView = () => (
    <div className="relative">
      <Carousel
        opts={{
          align: "start",
          loop: false,
        }}
        className="w-full"
      >
        <CarouselContent className="-ml-2 md:-ml-4">
          {books.map((book) => (
            <CarouselItem key={book.id} className="pl-2 md:pl-4 basis-full sm:basis-1/2 lg:basis-1/3 xl:basis-1/4">
              {renderBookCard(book)}
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="hidden sm:flex" />
        <CarouselNext className="hidden sm:flex" />
      </Carousel>
    </div>
  );

  const renderListView = () => (
    <div className="space-y-4">
      {books.map((book) => (
        <div
          key={book.id}
          className="flex items-center gap-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors"
        >
          {/* Book Cover Thumbnail */}
          <div className="flex-shrink-0 w-16 h-20 bg-muted rounded overflow-hidden flex items-center justify-center">
            {book.cover_url ? (
              <img
                src={book.cover_url}
                alt={`Cover of ${book.title}`}
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  target.parentElement!.innerHTML = '<div class="w-full h-full bg-gradient-to-br from-primary/10 to-primary/20 flex items-center justify-center"><svg class="h-8 w-8 text-primary/40" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path></svg></div>';
                }}
              />
            ) : (
              <BookOpen className="h-8 w-8 text-muted-foreground" />
            )}
          </div>

          {/* Book Info */}
          <div className="flex-1 min-w-0">
            <h3 className={`font-semibold text-sm leading-tight line-clamp-2 mb-1 ${getAccessibilityClasses('text')}`}>
              {book.title}
            </h3>
            <p className={`text-xs text-muted-foreground line-clamp-1 mb-2 ${getAccessibilityClasses('text')}`}>
              by {book.author}
            </p>
            {book.subjects && book.subjects.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {book.subjects.slice(0, 3).map((subject, index) => (
                  <span 
                    key={index}
                    className="text-xs bg-secondary text-secondary-foreground px-2 py-1 rounded"
                  >
                    {subject}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <Button 
              onClick={book.onReadClick}
              size="sm"
            >
              <BookOpen className="h-4 w-4 mr-2" />
              Read
            </Button>
            {book.onExternalClick && (
              <Button 
                variant="outline"
                size="sm"
                onClick={book.onExternalClick}
              >
                <ExternalLink className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <section className="space-y-6">
      <div className="text-center">
        <h2 className={`text-2xl font-semibold mb-2 ${getAccessibilityClasses('text')}`}>
          {title}
        </h2>
        <p className={`text-muted-foreground ${getAccessibilityClasses('text')}`}>
          {description}
        </p>
      </div>
      
      {books.length === 0 ? (
        <div className="text-center py-12">
          <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <p className={`text-muted-foreground ${getAccessibilityClasses('text')}`}>
            No books available yet. Check back soon!
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {/* View Toggle */}
          <div className="flex justify-center">
            <Select value={viewMode} onValueChange={(value: ViewMode) => setViewMode(value)}>
              <SelectTrigger className="w-48" aria-label="Change view mode">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="carousel">Carousel View</SelectItem>
                <SelectItem value="list">List View</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Content based on view mode */}
          {viewMode === 'carousel' ? renderCarouselView() : renderListView()}
        </div>
      )}
    </section>
  );
};

export default BookCarousel;
