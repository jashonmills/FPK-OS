import React from 'react';
import { MicroLessonContainer } from '../../MicroLessonContainer';
import { importanceOfScienceMicroLessons } from './ImportanceOfScienceMicroLessonData';

interface ImportanceOfScienceMicroLessonProps {
  onComplete?: () => void;
  onNext?: () => void;
  hasNext?: boolean;
}

export const ImportanceOfScienceMicroLesson: React.FC<ImportanceOfScienceMicroLessonProps> = ({ 
  onComplete, 
  onNext, 
  hasNext 
}) => {
  return (
    <MicroLessonContainer
      lessonData={importanceOfScienceMicroLessons}
      onComplete={onComplete}
      onNext={onNext}
      hasNext={hasNext}
    />
  );
};