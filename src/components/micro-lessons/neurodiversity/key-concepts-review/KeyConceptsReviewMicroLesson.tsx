import React from 'react';
import { MicroLessonContainer } from '../../MicroLessonContainer';
import { keyConceptsReviewMicroLessons } from './KeyConceptsReviewMicroLessonData';

interface KeyConceptsReviewMicroLessonProps {
  onComplete?: () => void;
  onNext?: () => void;
  hasNext?: boolean;
}

export const KeyConceptsReviewMicroLesson: React.FC<KeyConceptsReviewMicroLessonProps> = ({ 
  onComplete, 
  onNext, 
  hasNext 
}) => {
  return (
    <MicroLessonContainer
      lessonData={keyConceptsReviewMicroLessons}
      onComplete={onComplete}
      onNext={onNext}
      hasNext={hasNext}
    />
  );
};