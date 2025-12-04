
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Search, Plus, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useOpenLibrarySearch } from '@/hooks/useOpenLibrarySearch';
import { useAddPublicDomainBook } from '@/hooks/useAddPublicDomainBook';
import { useCleanup } from '@/utils/cleanupManager';

interface OpenLibraryBook {
  key: string;
  title: string;
  author_name?: string[];
  cover_i?: number;
  first_publish_year?: number;
}

const OpenLibrarySearchBar: React.FC = () => {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLUListElement>(null);
  const { toast } = useToast();
  const cleanup = useCleanup('OpenLibrarySearchBar');

  const { searchBooks, isLoading, books } = useOpenLibrarySearch();
  const { addBook, isAdding } = useAddPublicDomainBook();

  // Debounced search effect
  useEffect(() => {
    const timer = cleanup.setTimeout(() => {
      if (query.trim() && query.length > 2) {
        searchBooks(query);
        setIsOpen(true);
        setSelectedIndex(-1);
      } else {
        setIsOpen(false);
      }
    }, 300);

    return () => {
      // Cleanup handled by useCleanup hook
    };
  }, [query, searchBooks, cleanup]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const handleBookSelect = useCallback(async (book: OpenLibraryBook) => {
    try {
      await addBook({
        openlibrary_key: book.key,
        title: book.title,
        author: book.author_name?.[0] || 'Unknown Author',
        cover_i: book.cover_i,
        first_publish_year: book.first_publish_year
      });
      
      setQuery('');
      setIsOpen(false);
      setSelectedIndex(-1);
      
      toast({
        title: "Book Added!",
        description: `"${book.title}" has been added to your public domain collection.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add book to collection. Please try again.",
        variant: "destructive"
      });
    }
  }, [addBook, toast]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen || !books.length) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => Math.min(prev + 1, books.length - 1));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => Math.max(prev - 1, -1));
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && books[selectedIndex]) {
          handleBookSelect(books[selectedIndex]);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setSelectedIndex(-1);
        inputRef.current?.blur();
        break;
    }
  };

  const getCoverUrl = (coverId?: number) => {
    if (!coverId) return null;
    return `https://covers.openlibrary.org/b/id/${coverId}-S.jpg`;
  };

  const handleClickOutside = useCallback((e: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node) &&
        inputRef.current && !inputRef.current.contains(e.target as Node)) {
      setIsOpen(false);
    }
  }, []);

  useEffect(() => {
    const listenerId = cleanup.addEventListener(document, 'mousedown', handleClickOutside);
    return () => {
      // Cleanup handled by useCleanup hook
    };
  }, [handleClickOutside, cleanup]);

  return (
    <div className="relative w-full max-w-2xl mx-auto mb-6">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          ref={inputRef}
          type="search"
          placeholder="Search OpenLibrary for public domain books..."
          value={query}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          className="pl-10 pr-4 py-2 w-full"
          disabled={isAdding}
        />
        {(isLoading || isAdding) && (
          <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 animate-spin text-muted-foreground" />
        )}
      </div>

      {isOpen && (
        <ul
          ref={dropdownRef}
          className="absolute z-50 w-full mt-1 bg-card border border-border rounded-md shadow-lg max-h-80 overflow-y-auto"
        >
          {isLoading ? (
            <li className="p-4 text-center text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin mx-auto mb-2" />
              Searching OpenLibrary...
            </li>
          ) : books.length === 0 ? (
            <li className="p-4 text-center text-muted-foreground">
              No books found. Try a different search term.
            </li>
          ) : (
            books.map((book, index) => (
              <li
                key={book.key}
                className={`flex items-center gap-3 p-3 cursor-pointer transition-colors hover:bg-muted/50 border-b border-border last:border-b-0 ${
                  index === selectedIndex ? 'bg-muted/50' : ''
                }`}
                onClick={() => handleBookSelect(book)}
                onMouseEnter={() => setSelectedIndex(index)}
              >
                <div className="flex-shrink-0 w-10 h-12 bg-muted rounded overflow-hidden">
                  {getCoverUrl(book.cover_i) ? (
                    <img
                      src={getCoverUrl(book.cover_i)!}
                      alt={`Cover of ${book.title}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  ) : (
                    <div className="w-full h-full bg-muted flex items-center justify-center text-xs text-muted-foreground">
                      No Cover
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-sm truncate">{book.title}</h4>
                  <p className="text-xs text-muted-foreground truncate">
                    {book.author_name?.join(', ') || 'Unknown Author'}
                  </p>
                  {book.first_publish_year && (
                    <p className="text-xs text-muted-foreground">
                      First published: {book.first_publish_year}
                    </p>
                  )}
                </div>
                <Button size="sm" variant="ghost" className="flex-shrink-0">
                  <Plus className="h-3 w-3" />
                </Button>
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
};

export default OpenLibrarySearchBar;
