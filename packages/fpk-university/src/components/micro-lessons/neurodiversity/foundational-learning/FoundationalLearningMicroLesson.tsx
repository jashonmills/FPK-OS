import React from 'react';
import { MicroLessonContainer } from '../../MicroLessonContainer';
import { foundationalLearningMicroLessons } from './FoundationalLearningMicroLessonData';

interface FoundationalLearningMicroLessonProps {
  onComplete?: () => void;
  onNext?: () => void;
  hasNext?: boolean;
}

export const FoundationalLearningMicroLesson: React.FC<FoundationalLearningMicroLessonProps> = ({ 
  onComplete, 
  onNext, 
  hasNext 
}) => {
  return (
    <MicroLessonContainer
      lessonData={foundationalLearningMicroLessons}
      onComplete={onComplete}
      onNext={onNext}
      hasNext={hasNext}
    />
  );
};