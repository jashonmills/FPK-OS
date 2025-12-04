import React from 'react';
import { MicroLessonContainer } from '../../MicroLessonContainer';
import { advancedStudyTechniquesMicroLessons } from './AdvancedStudyTechniquesMicroLessonData';

interface AdvancedStudyTechniquesMicroLessonProps {
  onComplete?: () => void;
  onNext?: () => void;
  hasNext?: boolean;
}

export const AdvancedStudyTechniquesMicroLesson: React.FC<AdvancedStudyTechniquesMicroLessonProps> = ({ 
  onComplete, 
  onNext, 
  hasNext 
}) => {
  return (
    <MicroLessonContainer
      lessonData={advancedStudyTechniquesMicroLessons}
      onComplete={onComplete}
      onNext={onNext}
      hasNext={hasNext}
    />
  );
};