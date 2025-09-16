import React from 'react';
import { MicroLessonContainer } from '../../MicroLessonContainer';
import { forcesMotionMicroLessons } from './ForcesMotionMicroLessonData';

interface ForcesMotionMicroLessonProps {
  onComplete?: () => void;
  onNext?: () => void;
  hasNext?: boolean;
}

export const ForcesMotionMicroLesson: React.FC<ForcesMotionMicroLessonProps> = ({ 
  onComplete, 
  onNext, 
  hasNext 
}) => {
  return (
    <MicroLessonContainer
      lessonData={forcesMotionMicroLessons}
      onComplete={onComplete}
      onNext={onNext}
      hasNext={hasNext}
    />
  );
};