
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Brain, BookOpen } from 'lucide-react';
import { useCurrentReadingBooks } from '@/hooks/useCurrentReadingBooks';
import BookQuizModal from './BookQuizModal';
import { ErrorBoundary } from '@/components/ErrorBoundary';

interface QuizButtonProps {
  bookId: string;
  bookTitle: string;
  className?: string;
}

const QuizButtonContent = ({ bookId, bookTitle, className }: QuizButtonProps) => {
  const [showQuizModal, setShowQuizModal] = useState(false);
  const { data: readingBooks } = useCurrentReadingBooks();

  // Find this book in user's reading progress
  const readingProgress = readingBooks?.find(book => book.book_id === bookId);
  
  // Determine quiz coverage based on reading progress
  const maxChapterIndex = readingProgress?.chapter_index || 999; // Cover whole book if no progress
  const completionPercentage = readingProgress?.completion_percentage || 0;
  const hasReadingProgress = readingProgress && readingProgress.chapter_index > 0;

  return (
    <>
      <div className={className}>
        <Button
          onClick={() => setShowQuizModal(true)}
          variant="outline"
          size="sm"
          className="flex items-center gap-2 bg-purple-50 hover:bg-purple-100 border-purple-200 text-purple-700"
        >
          <Brain className="h-4 w-4" />
          <span className="hidden sm:inline">Quiz Me</span>
          <Badge variant="secondary" className="ml-1 bg-purple-100 text-purple-700">
            {hasReadingProgress ? `Ch. 1-${readingProgress.chapter_index}` : 'Full Book'}
          </Badge>
        </Button>
        
        {/* Progress indicator - only show if there's actual progress */}
        {hasReadingProgress && (
          <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
            <BookOpen className="h-3 w-3" />
            <span>{completionPercentage.toFixed(0)}% read</span>
          </div>
        )}
      </div>

      {showQuizModal && (
        <BookQuizModal
          open={showQuizModal}
          onOpenChange={setShowQuizModal}
          bookId={bookId}
          bookTitle={bookTitle}
          maxChapterIndex={maxChapterIndex}
        />
      )}
    </>
  );
};

const QuizButton = (props: QuizButtonProps) => {
  return (
    <ErrorBoundary fallback={
      <Button variant="outline" size="sm" disabled className="opacity-50">
        <Brain className="h-4 w-4 mr-2" />
        Quiz unavailable
      </Button>
    }>
      <QuizButtonContent {...props} />
    </ErrorBoundary>
  );
};

export default QuizButton;
