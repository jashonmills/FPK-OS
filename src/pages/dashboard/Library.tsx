
import React, { useState } from 'react';
import { useAccessibility } from '@/hooks/useAccessibility';
import { useUserUploadedBooks } from '@/hooks/useUserUploadedBooks';
import LibraryHero from '@/components/library/LibraryHero';
import CuratedBooksSection from '@/components/library/CuratedBooksSection';
import PublicDomainBooksSection from '@/components/library/PublicDomainBooksSection';
import BookDetailModal from '@/components/library/BookDetailModal';
import LibrarySection from '@/components/library/LibrarySection';
import UserUploadsContent from '@/components/library/UserUploadsContent';
import CommunityLibraryContent from '@/components/library/CommunityLibraryContent';
import { Book } from '@/types/library';

// Feature flags for controlling section availability
const LIBRARY_FEATURES = {
  userUploads: false,  // Set to true to enable
  communityLibrary: false,  // Set to true to enable
  curatedBooks: true,
  publicDomainBooks: true,
};

const Library = () => {
  const { getAccessibilityClasses } = useAccessibility();
  const { userUploads, approvedUploads } = useUserUploadedBooks();
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
        
        {/* User Uploads Section */}
        <LibrarySection
          title="Your Uploads"
          count={userUploads?.length || 0}
          disabled={!LIBRARY_FEATURES.userUploads}
          defaultOpen={false}
        >
          <UserUploadsContent />
        </LibrarySection>
        
        {/* Community Library Section */}
        <LibrarySection
          title="Community Library"
          count={approvedUploads?.length || 0}
          disabled={!LIBRARY_FEATURES.communityLibrary}
          defaultOpen={false}
        >
          <CommunityLibraryContent />
        </LibrarySection>
        
        {/* Curated Books Section - Always Available */}
        {LIBRARY_FEATURES.curatedBooks && (
          <CuratedBooksSection onBookSelect={handleBookSelect} />
        )}
        
        {/* Public Domain Books Section - Always Available */}
        {LIBRARY_FEATURES.publicDomainBooks && (
          <PublicDomainBooksSection />
        )}
        
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
