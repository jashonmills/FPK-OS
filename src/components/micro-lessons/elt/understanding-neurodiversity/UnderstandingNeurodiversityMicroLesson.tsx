import React from 'react';
import { MicroLessonContainer } from '../../MicroLessonContainer';
import { understandingNeurodiversityMicroLessons } from './UnderstandingNeurodiversityMicroLessonData';

interface UnderstandingNeurodiversityMicroLessonProps {
  onComplete?: () => void;
  onNext?: () => void;
  hasNext?: boolean;
}

export const UnderstandingNeurodiversityMicroLesson: React.FC<UnderstandingNeurodiversityMicroLessonProps> = ({ 
  onComplete, 
  onNext, 
  hasNext 
}) => {
  return (
    <MicroLessonContainer
      lessonData={understandingNeurodiversityMicroLessons}
      onComplete={onComplete}
      onNext={onNext}
      hasNext={hasNext}
    />
  );
};