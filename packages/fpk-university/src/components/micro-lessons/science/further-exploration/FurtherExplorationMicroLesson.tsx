import React from 'react';
import { MicroLessonContainer } from '../../MicroLessonContainer';
import { furtherExplorationMicroLessons } from './FurtherExplorationMicroLessonData';

interface FurtherExplorationMicroLessonProps {
  onComplete?: () => void;
  onNext?: () => void;
  hasNext?: boolean;
}

export const FurtherExplorationMicroLesson: React.FC<FurtherExplorationMicroLessonProps> = ({ 
  onComplete, 
  onNext, 
  hasNext 
}) => {
  return (
    <MicroLessonContainer
      lessonData={furtherExplorationMicroLessons}
      onComplete={onComplete}
      onNext={onNext}
      hasNext={hasNext}
    />
  );
};