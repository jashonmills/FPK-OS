import React from 'react';
import { MicroLessonContainer } from '../../MicroLessonContainer';
import { studyTechniquesMicroLessons } from './StudyTechniquesMicroLessonData';

interface StudyTechniquesMicroLessonProps {
  onComplete?: () => void;
  onNext?: () => void;
  hasNext?: boolean;
}

export const StudyTechniquesMicroLesson: React.FC<StudyTechniquesMicroLessonProps> = ({ 
  onComplete, 
  onNext, 
  hasNext 
}) => {
  return (
    <MicroLessonContainer
      lessonData={studyTechniquesMicroLessons}
      onComplete={onComplete}
      onNext={onNext}
      hasNext={hasNext}
    />
  );
};