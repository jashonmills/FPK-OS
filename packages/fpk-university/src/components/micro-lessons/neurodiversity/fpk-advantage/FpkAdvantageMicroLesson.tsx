import React from 'react';
import { MicroLessonContainer } from '../../MicroLessonContainer';
import { fpkAdvantageMicroLessons } from './FpkAdvantageMicroLessonData';

interface FpkAdvantageMicroLessonProps {
  onComplete?: () => void;
  onNext?: () => void;
  hasNext?: boolean;
}

export const FpkAdvantageMicroLesson: React.FC<FpkAdvantageMicroLessonProps> = ({ 
  onComplete, 
  onNext, 
  hasNext 
}) => {
  return (
    <MicroLessonContainer
      lessonData={fpkAdvantageMicroLessons}
      onComplete={onComplete}
      onNext={onNext}
      hasNext={hasNext}
    />
  );
};