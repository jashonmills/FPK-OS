import React from 'react';
import { MicroLessonContainer } from '../../MicroLessonContainer';
import { instructorDashboardMicroLessons } from './InstructorDashboardMicroLessonData';

interface InstructorDashboardMicroLessonProps {
  onComplete?: () => void;
  onNext?: () => void;
  hasNext?: boolean;
}

export const InstructorDashboardMicroLesson: React.FC<InstructorDashboardMicroLessonProps> = ({ 
  onComplete, 
  onNext, 
  hasNext 
}) => {
  return (
    <MicroLessonContainer
      lessonData={instructorDashboardMicroLessons}
      onComplete={onComplete}
      onNext={onNext}
      hasNext={hasNext}
    />
  );
};