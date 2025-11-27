import React from 'react';
import { MicroLessonContainer } from '../../MicroLessonContainer';
import { interactiveWorksheetsMicroLessons } from './InteractiveWorksheetsMicroLessonData';

interface InteractiveWorksheetsMicroLessonProps {
  onComplete?: () => void;
  onNext?: () => void;
  hasNext?: boolean;
}

export const InteractiveWorksheetsMicroLesson: React.FC<InteractiveWorksheetsMicroLessonProps> = ({ 
  onComplete, 
  onNext, 
  hasNext 
}) => {
  return (
    <MicroLessonContainer
      lessonData={interactiveWorksheetsMicroLessons}
      onComplete={onComplete}
      onNext={onNext}
      hasNext={hasNext}
    />
  );
};