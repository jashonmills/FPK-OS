import React from 'react';
import { MicroLessonContainer } from '../../MicroLessonContainer';
import { cellStructureMicroLessons } from './CellStructureMicroLessonData';

interface CellStructureMicroLessonProps {
  onComplete?: () => void;
  onNext?: () => void;
  hasNext?: boolean;
}

export const CellStructureMicroLesson: React.FC<CellStructureMicroLessonProps> = ({ 
  onComplete, 
  onNext, 
  hasNext 
}) => {
  return (
    <MicroLessonContainer
      lessonData={cellStructureMicroLessons}
      onComplete={onComplete}
      onNext={onNext}
      hasNext={hasNext}
    />
  );
};