import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAccessibility } from '@/hooks/useAccessibility';
import { useBookDetails } from '@/hooks/useBookDetails';
import { Book } from '@/types/library';
import { BookOpen, ExternalLink, Loader2, X } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

interface BookDetailModalProps {
  book: Book;
  onClose: () => void;
}

const BookDetailModal: React.FC<BookDetailModalProps> = ({ book, onClose }) => {
  const { getAccessibilityClasses } = useAccessibility();
  const { data: bookDetails, isLoading } = useBookDetails(book.workKey);
  const [imageError, setImageError] = useState(false);
  const [showReader, setShowReader] = useState(false);

  // Prioritize curated cover (book.cover_i) over fetched cover (bookDetails?.covers?.[0])
  const coverUrl = book.cover_i || bookDetails?.covers?.[0]
    ? `https://covers.openlibrary.org/b/id/${book.cover_i || bookDetails?.covers?.[0]}-L.jpg`
    : null;

  const description = bookDetails?.description || book.description;
  const descriptionText = typeof description === 'string' 
    ? description 
    : description?.value || 'No description available.';

  const subjects = bookDetails?.subjects || book.subject || [];
  const hasReader = bookDetails?.ocaid || book.ocaid;

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span className={`text-xl ${getAccessibilityClasses('text')}`}>
              Book Details
            </span>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>

        {showReader && hasReader ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className={`text-lg font-semibold ${getAccessibilityClasses('text')}`}>
                {book.title}
              </h3>
              <Button onClick={() => setShowReader(false)} variant="outline" size="sm">
                Back to Details
              </Button>
            </div>
            <div className="w-full h-96 border rounded-lg overflow-hidden">
              <iframe
                src={`https://archive.org/stream/${hasReader}/page/n0/mode/2up`}
                title={`Reader for ${book.title}`}
                className="w-full h-full"
                frameBorder="0"
              />
            </div>
          </div>
        ) : (
          <ScrollArea className="max-h-[calc(90vh-120px)]">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <span className={`ml-2 ${getAccessibilityClasses('text')}`}>Loading book details...</span>
              </div>
            ) : (
              <div className="space-y-6 p-1">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Book Cover */}
                  <div className="space-y-4">
                    <div className="aspect-[3/4] bg-muted rounded-lg overflow-hidden flex items-center justify-center">
                      {coverUrl && !imageError ? (
                        <img
                          src={coverUrl}
                          alt={`Cover of ${book.title}`}
                          className="w-full h-full object-cover"
                          onError={() => setImageError(true)}
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-primary/10 to-primary/20 flex items-center justify-center">
                          <BookOpen className="h-16 w-16 text-primary/40" />
                        </div>
                      )}
                    </div>
                    
                    {hasReader && (
                      <Button 
                        onClick={() => setShowReader(true)}
                        className="w-full"
                        size="sm"
                      >
                        <BookOpen className="h-4 w-4 mr-2" />
                        Read Online
                      </Button>
                    )}
                  </div>

                  {/* Book Info */}
                  <div className="md:col-span-2 space-y-4">
                    <div>
                      <h3 className={`text-2xl font-bold mb-2 ${getAccessibilityClasses('text')}`}>
                        {book.title}
                      </h3>
                      <p className={`text-lg text-muted-foreground ${getAccessibilityClasses('text')}`}>
                        by {book.author_name?.join(', ') || 'Unknown Author'}
                      </p>
                      {book.first_publish_year && (
                        <p className={`text-sm text-muted-foreground ${getAccessibilityClasses('text')}`}>
                          First published: {book.first_publish_year}
                        </p>
                      )}
                      {book.isCurated && (
                        <Badge variant="secondary" className="mt-2">
                          Curated Pick
                        </Badge>
                      )}
                    </div>

                    <div>
                      <h4 className={`font-semibold mb-2 ${getAccessibilityClasses('text')}`}>
                        Description
                      </h4>
                      <p className={`text-sm leading-relaxed ${getAccessibilityClasses('text')}`}>
                        {descriptionText}
                      </p>
                    </div>

                    {subjects.length > 0 && (
                      <div>
                        <h4 className={`font-semibold mb-2 ${getAccessibilityClasses('text')}`}>
                          Subjects
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {subjects.slice(0, 10).map((subject, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {subject}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="flex gap-2 pt-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(`https://openlibrary.org${book.key}`, '_blank')}
                      >
                        <ExternalLink className="h-4 w-4 mr-2" />
                        View on OpenLibrary
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </ScrollArea>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default BookDetailModal;
