import React from 'react';
import { MicroLessonContainer } from '../../MicroLessonContainer';
import { periodicTableMicroLessons } from './PeriodicTableMicroLessonData';

interface PeriodicTableMicroLessonProps {
  onComplete?: () => void;
  onNext?: () => void;
  hasNext?: boolean;
}

export const PeriodicTableMicroLesson: React.FC<PeriodicTableMicroLessonProps> = ({ 
  onComplete, 
  onNext, 
  hasNext 
}) => {
  return (
    <MicroLessonContainer
      lessonData={periodicTableMicroLessons}
      onComplete={onComplete}
      onNext={onNext}
      hasNext={hasNext}
    />
  );
};