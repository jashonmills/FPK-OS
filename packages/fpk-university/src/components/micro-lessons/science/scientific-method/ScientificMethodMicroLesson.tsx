import React from 'react';
import { MicroLessonContainer } from '../../MicroLessonContainer';
import { scientificMethodMicroLessons } from './ScientificMethodMicroLessonData';

interface ScientificMethodMicroLessonProps {
  onComplete?: () => void;
  onNext?: () => void;
  hasNext?: boolean;
}

export const ScientificMethodMicroLesson: React.FC<ScientificMethodMicroLessonProps> = ({ 
  onComplete, 
  onNext, 
  hasNext 
}) => {
  return (
    <MicroLessonContainer
      lessonData={scientificMethodMicroLessons}
      onComplete={onComplete}
      onNext={onNext}
      hasNext={hasNext}
    />
  );
};