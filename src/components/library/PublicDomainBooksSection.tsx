
import React, { useState } from 'react';
import { useAccessibility } from '@/hooks/useAccessibility';
import { usePublicDomainBooks } from '@/hooks/usePublicDomainBooks';
import { PublicDomainBook } from '@/types/publicDomainBooks';
import BookCarousel from './BookCarousel';
import EnhancedEPUBReader from './EnhancedEPUBReader';
import OpenLibrarySearchBar from './OpenLibrarySearchBar';
import GutenbergIngestionTrigger from './GutenbergIngestionTrigger';

const PublicDomainBooksSection: React.FC = () => {
  const { books, isLoading, error, refetch } = usePublicDomainBooks();
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

  // Separate curated and user-added books
  const curatedBooks = carouselBooks.filter((_, index) => !books[index].is_user_added);
  const userAddedBooks = carouselBooks.filter((_, index) => books[index].is_user_added);

  return (
    <div className="space-y-8">
      {/* Search Bar */}
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">Public Domain Collection</h2>
        <p className="text-muted-foreground mb-6">
          Search and add books from OpenLibrary or browse our curated collection
        </p>
        <OpenLibrarySearchBar />
      </div>

      {/* Ingestion Trigger - Show only if we have less than 40 curated books */}
      {curatedBooks.length < 40 && (
        <div className="py-6">
          <GutenbergIngestionTrigger />
        </div>
      )}

      {/* Curated Project Gutenberg Collection */}
      {curatedBooks.length > 0 && (
        <BookCarousel
          books={curatedBooks}
          sectionId="curatedGutenberg"
          title="Curated Project Gutenberg Collection"
          description={`${curatedBooks.length} carefully selected educational classics`}
          isLoading={false}
          error={null}
        />
      )}

      {/* User-Added Books */}
      {userAddedBooks.length > 0 && (
        <BookCarousel
          books={userAddedBooks}
          sectionId="userAddedBooks"
          title="Community Added Books"
          description={`${userAddedBooks.length} books added by users from OpenLibrary`}
          isLoading={false}
          error={null}
        />
      )}

      {/* Show all books together if we don't have the separation */}
      {curatedBooks.length === 0 && userAddedBooks.length === 0 && (
        <BookCarousel
          books={carouselBooks}
          sectionId="publicDomain"
          title="Available Books"
          description="Educational books from Project Gutenberg and user-added titles"
          isLoading={isLoading}
          error={error}
        />
      )}

      {/* Enhanced EPUB Reader Modal */}
      {selectedBook && (
        <EnhancedEPUBReader book={selectedBook} onClose={handleCloseReader} />
      )}
    </div>
  );
};

export default PublicDomainBooksSection;
