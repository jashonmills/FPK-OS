import React from 'react';
import { MicroLessonContainer } from '../../MicroLessonContainer';
import { selfAssessmentMicroLessons } from './SelfAssessmentMicroLessonData';

interface SelfAssessmentMicroLessonProps {
  onComplete?: () => void;
  onNext?: () => void;
  hasNext?: boolean;
}

export const SelfAssessmentMicroLesson: React.FC<SelfAssessmentMicroLessonProps> = ({ 
  onComplete, 
  onNext, 
  hasNext 
}) => {
  return (
    <MicroLessonContainer
      lessonData={selfAssessmentMicroLessons}
      onComplete={onComplete}
      onNext={onNext}
      hasNext={hasNext}
    />
  );
};