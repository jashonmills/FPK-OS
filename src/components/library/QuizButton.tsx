
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Brain, BookOpen } from 'lucide-react';
import { useCurrentReadingBooks } from '@/hooks/useCurrentReadingBooks';
import BookQuizModal from './BookQuizModal';

interface QuizButtonProps {
  bookId: string;
  bookTitle: string;
  className?: string;
}

const QuizButton = ({ bookId, bookTitle, className }: QuizButtonProps) => {
  const [showQuizModal, setShowQuizModal] = useState(false);
  const { data: readingBooks } = useCurrentReadingBooks();

  // Find this book in user's reading progress
  const readingProgress = readingBooks?.find(book => book.book_id === bookId);
  
  // Don't show quiz button if user hasn't started reading or no chapters completed
  if (!readingProgress || readingProgress.chapter_index < 1) {
    return null;
  }

  const maxChapterIndex = readingProgress.chapter_index;
  const completionPercentage = readingProgress.completion_percentage;

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
            Ch. 1-{maxChapterIndex}
          </Badge>
        </Button>
        
        {/* Progress indicator */}
        <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
          <BookOpen className="h-3 w-3" />
          <span>{completionPercentage.toFixed(0)}% read</span>
        </div>
      </div>

      <BookQuizModal
        open={showQuizModal}
        onOpenChange={setShowQuizModal}
        bookId={bookId}
        bookTitle={bookTitle}
        maxChapterIndex={maxChapterIndex}
      />
    </>
  );
};

export default QuizButton;
