
import React, { useState } from 'react';
import { useAccessibility } from '@/hooks/useAccessibility';
import LibraryHero from '@/components/library/LibraryHero';
import CuratedBooksSection from '@/components/library/CuratedBooksSection';
import PublicDomainBooksSection from '@/components/library/PublicDomainBooksSection';
import BookDetailModal from '@/components/library/BookDetailModal';
import { Book } from '@/types/library';

const Library = () => {
  const { getAccessibilityClasses } = useAccessibility();
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);

  const handleBookSelect = (book: Book) => {
    setSelectedBook(book);
  };

  const handleCloseModal = () => {
    setSelectedBook(null);
  };

  return (
    <div className={`min-h-screen bg-background ${getAccessibilityClasses('container')}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
        <LibraryHero />
        <CuratedBooksSection onBookSelect={handleBookSelect} />
        <PublicDomainBooksSection />
        
        {selectedBook && (
          <BookDetailModal 
            book={selectedBook} 
            onClose={handleCloseModal}
          />
        )}
      </div>
    </div>
  );
};

export default Library;
