
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useBookDetails } from '@/hooks/useBookDetails';
import { Skeleton } from '@/components/ui/skeleton';
import BookCard from './BookCard';
import { Book, CuratedBook } from '@/types/library';

interface CuratedBookItemProps {
  curatedBook: CuratedBook;
  onBookSelect: (book: Book) => void;
}

const CuratedBookItem: React.FC<CuratedBookItemProps> = ({ curatedBook, onBookSelect }) => {
  const { data: bookDetails, isLoading } = useBookDetails(curatedBook.workKey);

  const handleBookClick = () => {
    const book: Book = {
      key: curatedBook.workKey,
      title: curatedBook.title,
      author_name: [curatedBook.author],
      workKey: curatedBook.workKey,
      description: curatedBook.description,
      cover_i: bookDetails?.covers?.[0],
      isCurated: true
    };
    onBookSelect(book);
  };

  if (isLoading) {
    return (
      <Card className="hover:shadow-lg transition-all duration-200">
        <CardContent className="p-4">
          <div className="space-y-3">
            <Skeleton className="aspect-[3/4] w-full rounded-lg" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card 
      className="hover:shadow-lg transition-all duration-200 cursor-pointer border-2 hover:border-primary/20"
      onClick={handleBookClick}
    >
      <CardContent className="p-4">
        <BookCard
          title={curatedBook.title}
          author={curatedBook.author}
          workKey={curatedBook.workKey}
          cover={bookDetails?.covers?.[0]}
          isCurated={true}
        />
      </CardContent>
    </Card>
  );
};

export default CuratedBookItem;
