
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useBookDetails } from '@/hooks/useBookDetails';
import { Skeleton } from '@/components/ui/skeleton';
import { Book, CuratedBook } from '@/types/library';
import { BookOpen } from 'lucide-react';

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
        <div className="space-y-3">
          <div className="aspect-[3/4] bg-gray-100 flex items-center justify-center relative overflow-hidden">
            {bookDetails?.covers?.[0] ? (
              <img
                src={`https://covers.openlibrary.org/b/id/${bookDetails.covers[0]}-M.jpg`}
                alt={curatedBook.title}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            ) : (
              <BookOpen className="h-12 w-12 text-gray-400" />
            )}
          </div>
          
          <div className="space-y-1">
            <h3 className="font-semibold text-sm line-clamp-2 leading-tight">
              {curatedBook.title}
            </h3>
            <p className="text-xs text-muted-foreground line-clamp-1">
              {curatedBook.author}
            </p>
          </div>

          {curatedBook.description && (
            <p className="text-xs text-gray-600 line-clamp-2">
              {curatedBook.description}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default CuratedBookItem;
