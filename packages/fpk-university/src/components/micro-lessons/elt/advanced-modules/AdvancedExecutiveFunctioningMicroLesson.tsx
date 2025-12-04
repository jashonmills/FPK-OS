import React from 'react';
import { MicroLessonContainer } from '../../MicroLessonContainer';
import { advancedExecutiveFunctioningMicroLessons } from './AdvancedExecutiveFunctioningMicroLessonData';

interface AdvancedExecutiveFunctioningMicroLessonProps {
  onComplete?: () => void;
  onNext?: () => void;
  hasNext?: boolean;
}

export const AdvancedExecutiveFunctioningMicroLesson: React.FC<AdvancedExecutiveFunctioningMicroLessonProps> = ({ 
  onComplete, 
  onNext, 
  hasNext 
}) => {
  return (
    <MicroLessonContainer
      lessonData={advancedExecutiveFunctioningMicroLessons}
      onComplete={onComplete}
      onNext={onNext}
      hasNext={hasNext}
    />
  );
};