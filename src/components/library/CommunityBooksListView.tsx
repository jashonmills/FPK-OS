
import React from 'react';
import { UserUploadedBook } from '@/hooks/useUserUploadedBooks';
import CommunityBookItem from './CommunityBookItem';

interface CommunityBooksListViewProps {
  books: UserUploadedBook[];
  onView: (book: UserUploadedBook) => void;
  validatingPDF: string | null;
}

const CommunityBooksListView: React.FC<CommunityBooksListViewProps> = ({
  books,
  onView,
  validatingPDF
}) => {
  return (
    <div className="space-y-4">
      {books.map((book) => (
        <CommunityBookItem
          key={book.id}
          book={book}
          onView={onView}
          validatingPDF={validatingPDF}
          viewMode="list"
        />
      ))}
    </div>
  );
};

export default CommunityBooksListView;
