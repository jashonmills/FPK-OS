import React from 'react';
import { MicroLessonContainer } from '../../MicroLessonContainer';
import { expandedWorksheetsMicroLessons } from './ExpandedWorksheetsMicroLessonData';

interface ExpandedWorksheetsMicroLessonProps {
  onComplete?: () => void;
  onNext?: () => void;
  hasNext?: boolean;
}

export const ExpandedWorksheetsMicroLesson: React.FC<ExpandedWorksheetsMicroLessonProps> = ({ 
  onComplete, 
  onNext, 
  hasNext 
}) => {
  return (
    <MicroLessonContainer
      lessonData={expandedWorksheetsMicroLessons}
      onComplete={onComplete}
      onNext={onNext}
      hasNext={hasNext}
    />
  );
};