
import React, { useState } from 'react';
import { useAccessibility } from '@/hooks/useAccessibility';
import { usePublicDomainBooks } from '@/hooks/usePublicDomainBooks';
import { PublicDomainBook } from '@/types/publicDomainBooks';
import BookCarousel from './BookCarousel';
import EPUBReader from './EPUBReader';

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
    <>
      <BookCarousel
        books={carouselBooks}
        sectionId="publicDomain"
        title="Public Domain Collection"
        description="Curated educational books from Project Gutenberg focused on learning and neurodiversity"
        isLoading={isLoading}
        error={error}
      />

      {/* EPUB Reader Modal */}
      {selectedBook && (
        <EPUBReader book={selectedBook} onClose={handleCloseReader} />
      )}
    </>
  );
};

export default PublicDomainBooksSection;
