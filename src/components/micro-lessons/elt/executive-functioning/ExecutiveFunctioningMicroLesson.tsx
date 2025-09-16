import React from 'react';
import { MicroLessonContainer } from '../../MicroLessonContainer';
import { executiveFunctioningMicroLessons } from './ExecutiveFunctioningMicroLessonData';

interface ExecutiveFunctioningMicroLessonProps {
  onComplete?: () => void;
  onNext?: () => void;
  hasNext?: boolean;
}

export const ExecutiveFunctioningMicroLesson: React.FC<ExecutiveFunctioningMicroLessonProps> = ({ 
  onComplete, 
  onNext, 
  hasNext 
}) => {
  return (
    <MicroLessonContainer
      lessonData={executiveFunctioningMicroLessons}
      onComplete={onComplete}
      onNext={onNext}
      hasNext={hasNext}
    />
  );
};