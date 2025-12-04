import React from 'react';
import { MicroLessonContainer } from '../../MicroLessonContainer';
import { whatIsNeurodiversityMicroLessons } from './WhatIsNeurodiversityMicroLessonData';

interface WhatIsNeurodiversityMicroLessonProps {
  onComplete?: () => void;
  onNext?: () => void;
  hasNext?: boolean;
}

export const WhatIsNeurodiversityMicroLesson: React.FC<WhatIsNeurodiversityMicroLessonProps> = ({ 
  onComplete, 
  onNext, 
  hasNext 
}) => {
  return (
    <MicroLessonContainer
      lessonData={whatIsNeurodiversityMicroLessons}
      onComplete={onComplete}
      onNext={onNext}
      hasNext={hasNext}
    />
  );
};