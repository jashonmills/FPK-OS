
import React from 'react';
import { usePublicDomainBooks } from '@/hooks/usePublicDomainBooks';
import { PublicDomainBook } from '@/types/publicDomainBooks';
import { Book } from '@/types/library';
import BookCarousel from './BookCarousel';

interface CuratedBooksSectionProps {
  onBookSelect: (book: Book) => void;
}

const CuratedBooksSection: React.FC<CuratedBooksSectionProps> = ({ onBookSelect }) => {
  const { books, isLoading, error } = usePublicDomainBooks();

  // Select first 6 books as featured/curated picks
  const curatedBooks = books.slice(0, 6);

  const handleBookSelect = (publicDomainBook: PublicDomainBook) => {
    // Convert PublicDomainBook to Book format for the modal
    const book: Book = {
      key: `/works/gutenberg-${publicDomainBook.gutenberg_id}`,
      title: publicDomainBook.title,
      author_name: [publicDomainBook.author],
      author: publicDomainBook.author,
      workKey: `/works/gutenberg-${publicDomainBook.gutenberg_id}`,
      description: publicDomainBook.description,
      cover_url: publicDomainBook.cover_url,
      subjects: publicDomainBook.subjects,
      isCurated: true,
      epub_url: publicDomainBook.epub_url,
      isPublicDomain: true,
      gutenberg_id: publicDomainBook.gutenberg_id
    };
    onBookSelect(book);
  };

  // Transform books into the format expected by BookCarousel
  const carouselBooks = curatedBooks.map(book => ({
    id: book.id,
    title: book.title,
    author: book.author,
    cover_url: book.cover_url,
    subjects: book.subjects,
    gutenberg_id: book.gutenberg_id,
    onReadClick: () => handleBookSelect(book)
  }));

  return (
    <BookCarousel
      books={carouselBooks}
      sectionId="curated"
      title="Featured Educational Books"
      description="Top picks from our collection focused on learning and neurodiversity"
      isLoading={isLoading}
      error={error}
    />
  );
};

export default CuratedBooksSection;
