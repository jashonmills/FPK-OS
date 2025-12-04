
import React from 'react';
import OpenLibrarySearchBar from './OpenLibrarySearchBar';

const LibraryHeader: React.FC = () => {
  return (
    <div className="text-center">
      <h2 className="text-2xl font-bold mb-4">Public Domain Collection</h2>
      <p className="text-muted-foreground mb-6">
        Enhanced with instant search, smart suggestions, and intelligent prefetching
      </p>
      <OpenLibrarySearchBar />
    </div>
  );
};

export default LibraryHeader;
