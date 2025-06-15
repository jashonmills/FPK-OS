
import React, { useState } from 'react';
import { useAccessibility } from '@/hooks/useAccessibility';
import { usePublicDomainBooks } from '@/hooks/usePublicDomainBooks';
import { PublicDomainBook } from '@/types/publicDomainBooks';
import BookCarousel from './BookCarousel';
import EnhancedEPUBReader from './EnhancedEPUBReader';
import OpenLibrarySearchBar from './OpenLibrarySearchBar';

const PublicDomainBooksSection: React.FC = () => {
  const { books, isLoading, error } = usePublicDomainBooks();
  const [selectedBook, setSelectedBook] = useState<PublicDomainBook | null>(null);

  const handleBookClick = (book: PublicDomainBook) => {
    setSelectedBook(book);
  };

  const handleCloseReader = () => {
    setSelectedBook(null);
  };

  // Transform books into the format expected by BookCarousel
  const carouselBooks = books.map(book => ({
    id: book.id,
    title: book.title,
    author: book.author,
    cover_url: book.cover_url,
    subjects: book.subjects,
    gutenberg_id: book.gutenberg_id,
    onReadClick: () => handleBookClick(book)
  }));

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">Public Domain Collection</h2>
        <p className="text-muted-foreground mb-6">
          Search and add books from OpenLibrary or browse our curated collection
        </p>
        <OpenLibrarySearchBar />
      </div>

      {/* Book Collection */}
      <BookCarousel
        books={carouselBooks}
        sectionId="publicDomain"
        title="Available Books"
        description="Educational books from Project Gutenberg and user-added titles"
        isLoading={isLoading}
        error={error}
      />

      {/* Enhanced EPUB Reader Modal */}
      {selectedBook && (
        <EnhancedEPUBReader book={selectedBook} onClose={handleCloseReader} />
      )}
    </div>
  );
};

export default PublicDomainBooksSection;
