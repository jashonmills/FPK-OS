import { useEffect, useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { BookOpen, ChevronRight } from 'lucide-react';
import { useAccessibility } from '@/hooks/useAccessibility';
import { Book, CuratedBook } from '@/types/library';
import { safeSessionStorage } from '@/utils/safeStorage';

interface RecommendedBookListItemProps {
  book: CuratedBook;
  onBookSelect: (book: Book) => void;
}

const RecommendedBookListItem: React.FC<RecommendedBookListItemProps> = ({ book, onBookSelect }) => {
  const { getAccessibilityClasses } = useAccessibility();
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  const itemRef = useRef<HTMLDivElement>(null);

  // Lazy loading with intersection observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (itemRef.current) {
      observer.observe(itemRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handleBookClick = () => {
    const bookData: Book = {
      key: book.workKey,
      title: book.title,
      author_name: [book.author],
      workKey: book.workKey,
      description: book.description,
      cover_i: book.coverId,
      isCurated: true
    };
    onBookSelect(bookData);
  };

  const coverUrl = book.coverId && isVisible
    ? `https://covers.openlibrary.org/b/id/${book.coverId}-S.jpg`
    : null;

  // Cache thumbnail URLs in session storage
  useEffect(() => {
    if (coverUrl && imageLoaded) {
      const cacheKey = `book-cover-${book.coverId}`;
      safeSessionStorage.setItem(cacheKey, coverUrl, { logErrors: false });
    }
  }, [coverUrl, imageLoaded, book.coverId]);

  return (
    <div
      ref={itemRef}
      className={`flex items-center gap-4 py-3 px-2 rounded-lg hover:bg-muted/50 transition-colors ${getAccessibilityClasses('container')}`}
      style={{ minHeight: '80px' }}
    >
      {/* Thumbnail */}
      <div className="flex-shrink-0 w-16 h-20 bg-muted rounded overflow-hidden flex items-center justify-center">
        {coverUrl && !imageError ? (
          <img
            ref={imgRef}
            src={coverUrl}
            alt={`Cover of ${book.title}`}
            className={`w-full h-full object-cover transition-opacity duration-200 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            onLoad={() => setImageLoaded(true)}
            onError={() => setImageError(true)}
            loading="lazy"
          />
        ) : (
          <BookOpen className="h-8 w-8 text-muted-foreground" />
        )}
      </div>

      {/* Book Info */}
      <div className="flex-grow min-w-0">
        <button
          onClick={handleBookClick}
          className={`text-left w-full focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded ${getAccessibilityClasses('text')}`}
          aria-label={`View details for ${book.title}`}
        >
          <h3 className="font-medium text-sm leading-tight line-clamp-2 mb-1 hover:text-primary transition-colors">
            {book.title}
          </h3>
          <p className="text-xs text-muted-foreground line-clamp-1">
            by {book.author}
          </p>
        </button>
      </div>

      {/* View Details Button */}
      <div className="flex-shrink-0">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleBookClick}
          className="h-8 w-8 p-0"
          aria-label={`View details for ${book.title}`}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default RecommendedBookListItem;