import React from 'react';
import { MicroLessonContainer } from '../../MicroLessonContainer';
import { enhancedAssessmentsMicroLessons } from './EnhancedAssessmentsMicroLessonData';

interface EnhancedAssessmentsMicroLessonProps {
  onComplete?: () => void;
  onNext?: () => void;
  hasNext?: boolean;
}

export const EnhancedAssessmentsMicroLesson: React.FC<EnhancedAssessmentsMicroLessonProps> = ({ 
  onComplete, 
  onNext, 
  hasNext 
}) => {
  return (
    <MicroLessonContainer
      lessonData={enhancedAssessmentsMicroLessons}
      onComplete={onComplete}
      onNext={onNext}
      hasNext={hasNext}
    />
  );
};