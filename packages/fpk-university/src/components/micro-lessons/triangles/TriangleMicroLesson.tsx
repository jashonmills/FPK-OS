import React from 'react';
import { MicroLessonContainer } from '../MicroLessonContainer';
import { triangleMicroLessonData } from './TriangleMicroLessonData';

interface TriangleMicroLessonProps {
  onComplete?: () => void;
  onNext?: () => void;
  hasNext?: boolean;
}

export const TriangleMicroLesson: React.FC<TriangleMicroLessonProps> = ({
  onComplete,
  onNext,
  hasNext
}) => {
  return (
    <MicroLessonContainer
      lessonData={triangleMicroLessonData}
      onComplete={onComplete}
      onNext={onNext}
      hasNext={hasNext}
    />
  );
};