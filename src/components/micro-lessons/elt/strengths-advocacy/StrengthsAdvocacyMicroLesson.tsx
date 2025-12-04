import React from 'react';
import { MicroLessonContainer } from '../../MicroLessonContainer';
import { strengthsAdvocacyMicroLessons } from './StrengthsAdvocacyMicroLessonData';

interface StrengthsAdvocacyMicroLessonProps {
  onComplete?: () => void;
  onNext?: () => void;
  hasNext?: boolean;
}

export const StrengthsAdvocacyMicroLesson: React.FC<StrengthsAdvocacyMicroLessonProps> = ({ 
  onComplete, 
  onNext, 
  hasNext 
}) => {
  return (
    <MicroLessonContainer
      lessonData={strengthsAdvocacyMicroLessons}
      onComplete={onComplete}
      onNext={onNext}
      hasNext={hasNext}
    />
  );
};