import React from 'react';
import { MicroLessonContainer } from '../../MicroLessonContainer';
import { energyWorkMicroLessons } from './EnergyWorkMicroLessonData';

interface EnergyWorkMicroLessonProps {
  onComplete?: () => void;
  onNext?: () => void;
  hasNext?: boolean;
}

export const EnergyWorkMicroLesson: React.FC<EnergyWorkMicroLessonProps> = ({ 
  onComplete, 
  onNext, 
  hasNext 
}) => {
  return (
    <MicroLessonContainer
      lessonData={energyWorkMicroLessons}
      onComplete={onComplete}
      onNext={onNext}
      hasNext={hasNext}
    />
  );
};