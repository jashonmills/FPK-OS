
import React from 'react';
import { UserUploadedBook } from '@/hooks/useUserUploadedBooks';
import CommunityBookItem from './CommunityBookItem';

interface CommunityBooksGridViewProps {
  books: UserUploadedBook[];
  onView: (book: UserUploadedBook) => void;
  validatingPDF: string | null;
}

const CommunityBooksGridView: React.FC<CommunityBooksGridViewProps> = ({
  books,
  onView,
  validatingPDF
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {books.map((book) => (
        <CommunityBookItem
          key={book.id}
          book={book}
          onView={onView}
          validatingPDF={validatingPDF}
          viewMode="grid"
        />
      ))}
    </div>
  );
};

export default CommunityBooksGridView;
