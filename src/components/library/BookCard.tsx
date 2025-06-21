
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen, Eye, Download } from 'lucide-react';
import QuizButton from './QuizButton';

interface BookCardProps {
  book: {
    id: string;
    title: string;
    author: string;
    cover_url?: string;
    description?: string;
    epub_url?: string;
    storage_url?: string;
  };
  onView?: () => void;
  onDownload?: () => void;
  className?: string;
}

const BookCard = ({ book, onView, onDownload, className }: BookCardProps) => {
  return (
    <Card className={`hover:shadow-md transition-shadow ${className}`}>
      <div className="aspect-[3/4] bg-gray-100 flex items-center justify-center relative overflow-hidden">
        {book.cover_url ? (
          <img
            src={book.cover_url}
            alt={book.title}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          <BookOpen className="h-12 w-12 text-gray-400" />
        )}
      </div>
      
      <CardContent className="p-4 space-y-3">
        <div className="space-y-1">
          <h3 className="font-semibold text-sm line-clamp-2 leading-tight">
            {book.title}
          </h3>
          <p className="text-xs text-muted-foreground line-clamp-1">
            {book.author}
          </p>
        </div>

        {book.description && (
          <p className="text-xs text-gray-600 line-clamp-2">
            {book.description}
          </p>
        )}

        <div className="space-y-2">
          {/* Quiz Button - shows if user has reading progress */}
          <QuizButton 
            bookId={book.id}
            bookTitle={book.title}
            className="w-full"
          />

          {/* Action Buttons */}
          <div className="flex gap-2">
            {onView && (
              <Button
                onClick={onView}
                size="sm"
                className="flex-1 bg-blue-600 hover:bg-blue-700"
              >
                <Eye className="h-3 w-3 mr-1" />
                <span className="text-xs">Read</span>
              </Button>
            )}
            
            {onDownload && (book.epub_url || book.storage_url) && (
              <Button
                onClick={onDownload}
                variant="outline"
                size="sm"
                className="flex-1"
              >
                <Download className="h-3 w-3 mr-1" />
                <span className="text-xs">Download</span>
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BookCard;
