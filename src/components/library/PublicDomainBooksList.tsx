
import React, { useState } from 'react';
import { ChevronDown, ChevronRight, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { PublicDomainBook } from '@/types/publicDomainBooks';
import BookDetailModal from './BookDetailModal';
import { Book } from '@/types/library';

interface PublicDomainBooksListProps {
  books: PublicDomainBook[];
  isLoading: boolean;
}

const PublicDomainBooksList: React.FC<PublicDomainBooksListProps> = ({ books, isLoading }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);

  const convertToBook = (book: PublicDomainBook): Book => ({
    key: book.id,
    title: book.title,
    author: book.author,
    cover_url: book.cover_url,
    epub_url: book.epub_url,
    gutenberg_id: book.gutenberg_id,
    description: book.description,
    subjects: book.subjects,
    isCurated: !book.is_user_added
  });

  const handleBookClick = (book: PublicDomainBook) => {
    setSelectedBook(convertToBook(book));
  };

  const handleCloseModal = () => {
    setSelectedBook(null);
  };

  if (isLoading) {
    return (
      <Card className="w-full">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
            <span className="ml-2 text-sm text-muted-foreground">Loading books...</span>
          </div>
        </CardHeader>
      </Card>
    );
  }

  return (
    <>
      <Card className="w-full">
        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
          <CollapsibleTrigger asChild>
            <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-semibold">All Public-Domain Titles</h3>
                  <span className="text-sm text-muted-foreground">({books.length} books)</span>
                </div>
                {isOpen ? (
                  <ChevronDown className="h-5 w-5 text-muted-foreground" />
                ) : (
                  <ChevronRight className="h-5 w-5 text-muted-foreground" />
                )}
              </div>
            </CardHeader>
          </CollapsibleTrigger>
          
          <CollapsibleContent>
            <CardContent className="pt-0">
              {books.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No public domain books available yet.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                  {books.map((book) => (
                    <div
                      key={book.id}
                      className="flex items-center gap-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors cursor-pointer"
                      onClick={() => handleBookClick(book)}
                    >
                      {/* Thumbnail */}
                      <div className="flex-shrink-0 w-10 h-12 bg-muted rounded overflow-hidden">
                        {book.cover_url ? (
                          <img
                            src={book.cover_url}
                            alt={`Cover of ${book.title}`}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                              target.parentElement!.innerHTML = '<div class="w-full h-full bg-gradient-to-br from-primary/10 to-primary/20 flex items-center justify-center"><svg class="h-4 w-4 text-primary/40" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path></svg></div>';
                            }}
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-primary/10 to-primary/20 flex items-center justify-center">
                            <BookOpen className="h-4 w-4 text-primary/40" />
                          </div>
                        )}
                      </div>

                      {/* Book Info */}
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm leading-tight line-clamp-1 hover:text-primary transition-colors">
                          {book.title}
                        </h4>
                        <p className="text-xs text-muted-foreground mt-1">
                          {book.author}
                        </p>
                      </div>

                      {/* Preview Button */}
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="flex-shrink-0 text-xs"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleBookClick(book);
                        }}
                      >
                        Preview
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </CollapsibleContent>
        </Collapsible>
      </Card>

      {/* Book Detail Modal */}
      {selectedBook && (
        <BookDetailModal book={selectedBook} onClose={handleCloseModal} />
      )}
    </>
  );
};

export default PublicDomainBooksList;
