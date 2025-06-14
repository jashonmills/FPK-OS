
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useAccessibility } from '@/hooks/useAccessibility';
import { useLibrarySearch } from '@/hooks/useLibrarySearch';
import BookCard from './BookCard';
import { Book } from '@/types/library';
import { Search, Loader2 } from 'lucide-react';

interface LibrarySearchSectionProps {
  onBookSelect: (book: Book) => void;
}

const LibrarySearchSection: React.FC<LibrarySearchSectionProps> = ({ onBookSelect }) => {
  const { getAccessibilityClasses } = useAccessibility();
  const [inputValue, setInputValue] = useState('');
  const { books, isLoading, search, loadMore, hasMore } = useLibrarySearch();

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (inputValue.trim()) {
        search(inputValue.trim());
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [inputValue, search]);

  const handleBookClick = (book: Book) => {
    onBookSelect(book);
  };

  return (
    <section className="space-y-6">
      <div className="text-center">
        <h2 className={`text-2xl font-semibold mb-2 ${getAccessibilityClasses('text')}`}>
          Search the Library
        </h2>
        <p className={`text-muted-foreground mb-6 ${getAccessibilityClasses('text')}`}>
          Explore millions of books from the OpenLibrary collection
        </p>
        
        <div className="max-w-2xl mx-auto relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search books by title, author, or subject…"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className={`pl-10 ${getAccessibilityClasses('text')}`}
          />
        </div>
      </div>

      {isLoading && books.length === 0 && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className={`ml-2 ${getAccessibilityClasses('text')}`}>Searching library...</span>
        </div>
      )}

      {books.length > 0 && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {books.map((book) => (
              <Card 
                key={`${book.key}-${book.title}`}
                className="hover:shadow-lg transition-all duration-200 cursor-pointer"
                onClick={() => handleBookClick(book)}
              >
                <CardContent className="p-4">
                  <BookCard
                    title={book.title}
                    author={book.author_name?.[0] || 'Unknown Author'}
                    year={book.first_publish_year}
                    cover={book.cover_i}
                    workKey={book.key}
                  />
                </CardContent>
              </Card>
            ))}
          </div>

          {hasMore && (
            <div className="text-center">
              <Button 
                onClick={loadMore}
                disabled={isLoading}
                variant="outline"
                className="w-auto"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Loading...
                  </>
                ) : (
                  'Load More Books'
                )}
              </Button>
            </div>
          )}
        </div>
      )}

      {inputValue.trim() && !isLoading && books.length === 0 && (
        <div className="text-center py-12">
          <p className={`text-muted-foreground ${getAccessibilityClasses('text')}`}>
            No books found for "{inputValue}". Try different keywords or check your spelling.
          </p>
        </div>
      )}
    </section>
  );
};

export default LibrarySearchSection;
