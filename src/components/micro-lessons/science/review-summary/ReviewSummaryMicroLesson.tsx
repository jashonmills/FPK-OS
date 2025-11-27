import React from 'react';
import { MicroLessonContainer } from '../../MicroLessonContainer';
import { reviewSummaryMicroLessons } from './ReviewSummaryMicroLessonData';

interface ReviewSummaryMicroLessonProps {
  onComplete?: () => void;
  onNext?: () => void;
  hasNext?: boolean;
}

export const ReviewSummaryMicroLesson: React.FC<ReviewSummaryMicroLessonProps> = ({ 
  onComplete, 
  onNext, 
  hasNext 
}) => {
  return (
    <MicroLessonContainer
      lessonData={reviewSummaryMicroLessons}
      onComplete={onComplete}
      onNext={onNext}
      hasNext={hasNext}
    />
  );
};