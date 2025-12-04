import React from 'react';
import { MicroLessonContainer } from '../../MicroLessonContainer';
import { studyGuideMicroLessons } from './StudyGuideMicroLessonData';

interface StudyGuideMicroLessonProps {
  onComplete?: () => void;
  onNext?: () => void;
  hasNext?: boolean;
}

export const StudyGuideMicroLesson: React.FC<StudyGuideMicroLessonProps> = ({ 
  onComplete, 
  onNext, 
  hasNext 
}) => {
  return (
    <MicroLessonContainer
      lessonData={studyGuideMicroLessons}
      onComplete={onComplete}
      onNext={onNext}
      hasNext={hasNext}
    />
  );
};