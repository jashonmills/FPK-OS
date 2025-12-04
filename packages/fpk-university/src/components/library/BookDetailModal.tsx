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
import { Book } from '@/types/library';
import { BookOpen } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import EPUBReader from './EPUBReader';
import { PublicDomainBook } from '@/types/publicDomainBooks';

interface BookDetailModalProps {
  book: Book;
  onClose: () => void;
}

const BookDetailModal: React.FC<BookDetailModalProps> = ({ book, onClose }) => {
  const { getAccessibilityClasses } = useAccessibility();
  const [showReader, setShowReader] = useState(false);

  // Convert Book to PublicDomainBook format for the reader
  const convertToPublicDomainBook = (book: Book): PublicDomainBook => ({
    id: book.key,
    title: book.title,
    author: book.author || book.author_name?.[0] || 'Unknown Author',
    subjects: book.subjects || book.subject || [],
    cover_url: book.cover_url,
    epub_url: book.epub_url || '',
    gutenberg_id: book.gutenberg_id || 0,
    description: book.description,
    language: 'en',
    last_updated: new Date().toISOString(),
    created_at: new Date().toISOString()
  });

  const coverUrl = book.cover_url || (book.cover_i 
    ? `https://covers.openlibrary.org/b/id/${book.cover_i}-L.jpg`
    : null);

  const description = book.description || 'No description available.';
  const subjects = book.subjects || book.subject || [];
  const hasEpubReader = book.epub_url;

  if (showReader && hasEpubReader) {
    return (
      <EPUBReader 
        book={convertToPublicDomainBook(book)} 
        onClose={() => setShowReader(false)} 
      />
    );
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className={`text-xl ${getAccessibilityClasses('text')}`}>
            Book Details
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="max-h-[calc(90vh-120px)]">
          <div className="space-y-6 p-1">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Book Cover */}
              <div className="space-y-4">
                <div className="aspect-[3/4] bg-muted rounded-lg overflow-hidden flex items-center justify-center">
                  {coverUrl ? (
                    <img
                      src={coverUrl}
                      alt={`Cover of ${book.title}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        target.parentElement!.innerHTML = '<div class="w-full h-full bg-gradient-to-br from-primary/10 to-primary/20 flex items-center justify-center"><svg class="h-16 w-16 text-primary/40" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path></svg></div>';
                      }}
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-primary/10 to-primary/20 flex items-center justify-center">
                      <BookOpen className="h-16 w-16 text-primary/40" />
                    </div>
                  )}
                </div>
                
                {hasEpubReader && (
                  <Button 
                    onClick={() => setShowReader(true)}
                    className="w-full"
                    size="sm"
                  >
                    <BookOpen className="h-4 w-4 mr-2" />
                    Read Book
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
                    by {book.author || book.author_name?.join(', ') || 'Unknown Author'}
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
                    {description}
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
              </div>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default BookDetailModal;
