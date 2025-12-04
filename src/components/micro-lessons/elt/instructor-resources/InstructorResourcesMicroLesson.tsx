import React from 'react';
import { MicroLessonContainer } from '../../MicroLessonContainer';
import { instructorResourcesMicroLessons } from './InstructorResourcesMicroLessonData';

interface InstructorResourcesMicroLessonProps {
  onComplete?: () => void;
  onNext?: () => void;
  hasNext?: boolean;
}

export const InstructorResourcesMicroLesson: React.FC<InstructorResourcesMicroLessonProps> = ({ 
  onComplete, 
  onNext, 
  hasNext 
}) => {
  return (
    <MicroLessonContainer
      lessonData={instructorResourcesMicroLessons}
      onComplete={onComplete}
      onNext={onNext}
      hasNext={hasNext}
    />
  );
};