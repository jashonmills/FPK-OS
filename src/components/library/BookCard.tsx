
import React, { useState } from 'react';
import { useAccessibility } from '@/hooks/useAccessibility';
import { Badge } from '@/components/ui/badge';
import { BookOpen } from 'lucide-react';

interface BookCardProps {
  title: string;
  author: string;
  year?: number;
  cover?: number;
  workKey: string;
  isCurated?: boolean;
}

const BookCard: React.FC<BookCardProps> = ({ 
  title, 
  author, 
  year, 
  cover, 
  workKey,
  isCurated = false 
}) => {
  const { getAccessibilityClasses } = useAccessibility();
  const [imageError, setImageError] = useState(false);

  const coverUrl = cover 
    ? `https://covers.openlibrary.org/b/id/${cover}-M.jpg`
    : null;

  return (
    <div className="space-y-3">
      <div className="aspect-[3/4] bg-muted rounded-lg overflow-hidden flex items-center justify-center">
        {coverUrl && !imageError ? (
          <img
            src={coverUrl}
            alt={`Cover of ${title}`}
            className="w-full h-full object-cover"
            onError={() => setImageError(true)}
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary/10 to-primary/20 flex items-center justify-center">
            <BookOpen className="h-12 w-12 text-primary/40" />
          </div>
        )}
      </div>
      
      <div className="space-y-2">
        <h3 className={`font-semibold text-sm leading-tight line-clamp-2 ${getAccessibilityClasses('text')}`}>
          {title}
        </h3>
        <p className={`text-xs text-muted-foreground line-clamp-1 ${getAccessibilityClasses('text')}`}>
          {author}
          {year && ` (${year})`}
        </p>
        {isCurated && (
          <Badge variant="secondary" className="text-xs">
            Curated Pick
          </Badge>
        )}
      </div>
    </div>
  );
};

export default BookCard;
