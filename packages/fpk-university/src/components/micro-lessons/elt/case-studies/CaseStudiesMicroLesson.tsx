import React from 'react';
import { MicroLessonContainer } from '../../MicroLessonContainer';
import { caseStudiesMicroLessons } from './CaseStudiesMicroLessonData';

interface CaseStudiesMicroLessonProps {
  onComplete?: () => void;
  onNext?: () => void;
  hasNext?: boolean;
}

export const CaseStudiesMicroLesson: React.FC<CaseStudiesMicroLessonProps> = ({ 
  onComplete, 
  onNext, 
  hasNext 
}) => {
  return (
    <MicroLessonContainer
      lessonData={caseStudiesMicroLessons}
      onComplete={onComplete}
      onNext={onNext}
      hasNext={hasNext}
    />
  );
};