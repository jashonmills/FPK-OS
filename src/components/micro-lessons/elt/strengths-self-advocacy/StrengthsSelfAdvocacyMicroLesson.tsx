import React from 'react';
import { MicroLessonContainer } from '../../MicroLessonContainer';
import { strengthsSelfAdvocacyMicroLessons } from './StrengthsSelfAdvocacyMicroLessonData';

interface StrengthsSelfAdvocacyMicroLessonProps {
  onComplete?: () => void;
  onNext?: () => void;
  hasNext?: boolean;
}

export const StrengthsSelfAdvocacyMicroLesson: React.FC<StrengthsSelfAdvocacyMicroLessonProps> = ({ 
  onComplete, 
  onNext, 
  hasNext 
}) => {
  return (
    <MicroLessonContainer
      lessonData={strengthsSelfAdvocacyMicroLessons}
      onComplete={onComplete}
      onNext={onNext}
      hasNext={hasNext}
    />
  );
};