import React from 'react';
import { MicroLessonContainer } from '../../MicroLessonContainer';
import { atomsMoleculesMicroLessons } from './AtomsMoleculesMicroLessonData';

interface AtomsMoleculesMicroLessonProps {
  onComplete?: () => void;
  onNext?: () => void;
  hasNext?: boolean;
}

export const AtomsMoleculesMicroLesson: React.FC<AtomsMoleculesMicroLessonProps> = ({ 
  onComplete, 
  onNext, 
  hasNext 
}) => {
  return (
    <MicroLessonContainer
      lessonData={atomsMoleculesMicroLessons}
      onComplete={onComplete}
      onNext={onNext}
      hasNext={hasNext}
    />
  );
};