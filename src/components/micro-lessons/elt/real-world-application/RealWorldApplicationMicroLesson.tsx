import React from 'react';
import { MicroLessonContainer } from '../../MicroLessonContainer';
import { realWorldApplicationMicroLessons } from './RealWorldApplicationMicroLessonData';

interface RealWorldApplicationMicroLessonProps {
  onComplete?: () => void;
  onNext?: () => void;
  hasNext?: boolean;
}

export const RealWorldApplicationMicroLesson: React.FC<RealWorldApplicationMicroLessonProps> = ({ 
  onComplete, 
  onNext, 
  hasNext 
}) => {
  return (
    <MicroLessonContainer
      lessonData={realWorldApplicationMicroLessons}
      onComplete={onComplete}
      onNext={onNext}
      hasNext={hasNext}
    />
  );
};