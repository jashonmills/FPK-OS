
import React from 'react';
import LibraryWithMonitoring from '@/components/library/LibraryWithMonitoring';

const Library = () => {
  return (
    <div className="mobile-section-spacing">
      <div className="mb-4 sm:mb-6">
        <h1 className="mobile-heading-xl mb-2">Library</h1>
        <p className="text-muted-foreground mobile-text-base">
          Discover and read from our collection of books and resources
        </p>
      </div>
      
      <LibraryWithMonitoring />
    </div>
  );
};

export default Library;
