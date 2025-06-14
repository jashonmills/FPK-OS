
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAccessibility } from '@/hooks/useAccessibility';
import { usePublicDomainBooks } from '@/hooks/usePublicDomainBooks';
import { PublicDomainBook } from '@/types/publicDomainBooks';
import { BookOpen, ExternalLink, Loader2 } from 'lucide-react';
import EPUBReader from './EPUBReader';

const PublicDomainBooksSection: React.FC = () => {
  const { getAccessibilityClasses } = useAccessibility();
  const { books, isLoading, error } = usePublicDomainBooks();
  const [selectedBook, setSelectedBook] = useState<PublicDomainBook | null>(null);

  const handleBookClick = (book: PublicDomainBook) => {
    setSelectedBook(book);
  };

  const handleCloseReader = () => {
    setSelectedBook(null);
  };

  if (isLoading) {
    return (
      <section className="space-y-6">
        <div className="text-center">
          <h2 className={`text-2xl font-semibold mb-2 ${getAccessibilityClasses('text')}`}>
            Public Domain Collection
          </h2>
          <p className={`text-muted-foreground ${getAccessibilityClasses('text')}`}>
            Curated educational books from Project Gutenberg
          </p>
        </div>
        
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className={`ml-2 ${getAccessibilityClasses('text')}`}>Loading books...</span>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="space-y-6">
        <div className="text-center">
          <h2 className={`text-2xl font-semibold mb-2 ${getAccessibilityClasses('text')}`}>
            Public Domain Collection
          </h2>
          <p className="text-destructive">{error}</p>
        </div>
      </section>
    );
  }

  return (
    <>
      <section className="space-y-6">
        <div className="text-center">
          <h2 className={`text-2xl font-semibold mb-2 ${getAccessibilityClasses('text')}`}>
            Public Domain Collection
          </h2>
          <p className={`text-muted-foreground ${getAccessibilityClasses('text')}`}>
            Curated educational books from Project Gutenberg focused on learning and neurodiversity
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {books.map((book) => (
            <Card 
              key={book.id}
              className="hover:shadow-lg transition-all duration-200 cursor-pointer border-2 hover:border-primary/20"
            >
              <CardContent className="p-4">
                <div className="space-y-3">
                  {/* Book Cover */}
                  <div className="aspect-[3/4] bg-muted rounded-lg overflow-hidden flex items-center justify-center">
                    {book.cover_url ? (
                      <img
                        src={book.cover_url}
                        alt={`Cover of ${book.title}`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          // Fallback to icon if cover fails to load
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
                    {book.subjects.length > 0 && (
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

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <Button 
                      onClick={() => handleBookClick(book)}
                      className="flex-1"
                      size="sm"
                    >
                      <BookOpen className="h-4 w-4 mr-2" />
                      Read
                    </Button>
                    <Button 
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        window.open(`https://gutenberg.org/ebooks/${book.gutenberg_id}`, '_blank');
                      }}
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {books.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <p className={`text-muted-foreground ${getAccessibilityClasses('text')}`}>
              No public domain books available yet. Check back soon!
            </p>
          </div>
        )}
      </section>

      {/* EPUB Reader Modal */}
      {selectedBook && (
        <EPUBReader book={selectedBook} onClose={handleCloseReader} />
      )}
    </>
  );
};

export default PublicDomainBooksSection;
