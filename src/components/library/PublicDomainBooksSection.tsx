
import React, { useState } from 'react';
import { usePublicDomainBooks } from '@/hooks/usePublicDomainBooks';
import { useReadingProgress } from '@/hooks/useReadingProgress';
import BookCard from './BookCard';
import LoadingIndicator from './LoadingIndicator';
import EnhancedEPUBReader from './EPUBReader';
import { Button } from '@/components/ui/button';
import { Eye, Globe, RefreshCw } from 'lucide-react';

const PublicDomainBooksSection = () => {
  const { books, isLoading, refetch } = usePublicDomainBooks();
  const [loadingBookId, setLoadingBookId] = useState<string | null>(null);
  const [selectedBook, setSelectedBook] = useState<any>(null);

  const handleReadBook = async (book: any) => {
    setLoadingBookId(book.id);
    try {
      // Open the EPUB reader in the same tab/modal
      setSelectedBook(book);
    } catch (error) {
      console.error('Error starting book:', error);
    } finally {
      setLoadingBookId(null);
    }
  };

  const handleDownloadBook = (book: any) => {
    const downloadUrl = book.storage_url || book.epub_url;
    if (downloadUrl) {
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = `${book.title}.epub`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleCloseReader = () => {
    setSelectedBook(null);
  };

  if (isLoading) {
    return <LoadingIndicator />;
  }

  if (!books?.length) {
    return (
      <div className="text-center py-12">
        <Globe className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-semibold mb-2">No books available</h3>
        <p className="text-muted-foreground mb-4">
          We're working on adding more public domain books to the library.
        </p>
        <Button onClick={() => refetch()}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <Globe className="h-5 w-5 text-blue-600" />
          <h2 className="text-lg font-semibold">Public Domain Books</h2>
          <span className="text-sm text-muted-foreground">({books.length} available)</span>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {books.map((book) => (
            <BookCard
              key={book.id}
              book={{
                id: book.id,
                title: book.title,
                author: book.author,
                cover_url: book.cover_url,
                description: book.description,
                epub_url: book.epub_url,
                storage_url: book.storage_url
              }}
              onView={() => handleReadBook(book)}
              onDownload={() => handleDownloadBook(book)}
            />
          ))}
        </div>
      </div>

      {/* EPUB Reader Modal */}
      {selectedBook && (
        <EnhancedEPUBReader
          book={selectedBook}
          onClose={handleCloseReader}
        />
      )}
    </>
  );
};

export default PublicDomainBooksSection;
