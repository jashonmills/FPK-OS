import React from 'react';
import { MicroLessonContainer } from '../../MicroLessonContainer';
import { brainSuperpowersMicroLessons } from './BrainSuperpowersMicroLessonData';

interface BrainSuperpowersMicroLessonProps {
  onComplete?: () => void;
  onNext?: () => void;
  hasNext?: boolean;
}

export const BrainSuperpowersMicroLesson: React.FC<BrainSuperpowersMicroLessonProps> = ({ 
  onComplete, 
  onNext, 
  hasNext 
}) => {
  return (
    <MicroLessonContainer
      lessonData={brainSuperpowersMicroLessons}
      onComplete={onComplete}
      onNext={onNext}
      hasNext={hasNext}
    />
  );
};