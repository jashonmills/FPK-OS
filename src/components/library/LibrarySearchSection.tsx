
import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useAccessibility } from '@/hooks/useAccessibility';
import { usePublicDomainBooks } from '@/hooks/usePublicDomainBooks';
import { Book } from '@/types/library';
import { Search, Loader2, BookOpen } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface LibrarySearchSectionProps {
  onBookSelect: (book: Book) => void;
}

const LibrarySearchSection: React.FC<LibrarySearchSectionProps> = ({ onBookSelect }) => {
  const { getAccessibilityClasses } = useAccessibility();
  const { books, isLoading, error } = usePublicDomainBooks();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState<string>('');

  // Get all unique subjects for filtering
  const allSubjects = useMemo(() => {
    const subjects = new Set<string>();
    books.forEach(book => {
      book.subjects.forEach(subject => subjects.add(subject));
    });
    return Array.from(subjects).sort();
  }, [books]);

  // Filter books based on search query and selected subject
  const filteredBooks = useMemo(() => {
    let filtered = books;

    // Filter by subject if selected
    if (selectedSubject) {
      filtered = filtered.filter(book => book.subjects.includes(selectedSubject));
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(book =>
        book.title.toLowerCase().includes(query) ||
        book.author.toLowerCase().includes(query) ||
        book.description?.toLowerCase().includes(query) ||
        book.subjects.some(subject => subject.toLowerCase().includes(query))
      );
    }

    return filtered;
  }, [books, searchQuery, selectedSubject]);

  const handleBookSelect = (publicDomainBook: any) => {
    // Convert PublicDomainBook to Book format
    const book: Book = {
      key: `/works/gutenberg-${publicDomainBook.gutenberg_id}`,
      title: publicDomainBook.title,
      author_name: [publicDomainBook.author],
      workKey: `/works/gutenberg-${publicDomainBook.gutenberg_id}`,
      description: publicDomainBook.description,
      cover_i: publicDomainBook.cover_url ? null : undefined,
      epub_url: publicDomainBook.epub_url,
      isPublicDomain: true
    };
    onBookSelect(book);
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedSubject('');
  };

  return (
    <section className="space-y-8">
      <div className="text-center">
        <h2 className={`text-2xl font-semibold mb-2 ${getAccessibilityClasses('text')}`}>
          Search Our Collection
        </h2>
        <p className={`text-muted-foreground mb-6 ${getAccessibilityClasses('text')}`}>
          Find books in our curated public domain collection from Project Gutenberg
        </p>
        
        <div className="max-w-2xl mx-auto space-y-4">
          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search by title, author, or subject…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`pl-10 ${getAccessibilityClasses('text')}`}
            />
          </div>

          {/* Subject Filter */}
          {allSubjects.length > 0 && (
            <div className="flex flex-wrap gap-2 justify-center">
              <Button
                variant={selectedSubject === '' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedSubject('')}
              >
                All Subjects
              </Button>
              {allSubjects.slice(0, 8).map((subject) => (
                <Button
                  key={subject}
                  variant={selectedSubject === subject ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedSubject(subject)}
                  className="text-xs"
                >
                  {subject}
                </Button>
              ))}
            </div>
          )}

          {/* Active Filters */}
          {(searchQuery || selectedSubject) && (
            <div className="flex items-center gap-2 justify-center">
              <span className="text-sm text-muted-foreground">Active filters:</span>
              {searchQuery && (
                <Badge variant="secondary">
                  Search: "{searchQuery}"
                </Badge>
              )}
              {selectedSubject && (
                <Badge variant="secondary">
                  Subject: {selectedSubject}
                </Badge>
              )}
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                Clear all
              </Button>
            </div>
          )}
        </div>
      </div>

      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className={`ml-2 ${getAccessibilityClasses('text')}`}>Loading collection...</span>
        </div>
      )}

      {error && (
        <div className="text-center py-12">
          <p className="text-destructive mb-4">Error loading collection: {error}</p>
        </div>
      )}

      {!isLoading && !error && filteredBooks.length > 0 && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className={`text-lg font-semibold ${getAccessibilityClasses('text')}`}>
              {searchQuery || selectedSubject ? 'Search Results' : 'Full Collection'}
            </h3>
            <span className={`text-sm text-muted-foreground ${getAccessibilityClasses('text')}`}>
              {filteredBooks.length} book{filteredBooks.length !== 1 ? 's' : ''} found
            </span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredBooks.map((book) => (
              <Card 
                key={book.id}
                className="hover:shadow-lg transition-all duration-200 cursor-pointer border-2 hover:border-primary/20"
                onClick={() => handleBookSelect(book)}
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
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {!isLoading && !error && filteredBooks.length === 0 && (searchQuery || selectedSubject) && (
        <div className="text-center py-12">
          <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <p className={`text-muted-foreground mb-4 ${getAccessibilityClasses('text')}`}>
            No books found matching your search criteria.
          </p>
          <Button onClick={clearFilters} variant="outline">
            Clear filters and show all books
          </Button>
        </div>
      )}
    </section>
  );
};

export default LibrarySearchSection;
