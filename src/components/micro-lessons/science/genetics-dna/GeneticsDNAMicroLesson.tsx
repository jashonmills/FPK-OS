import React from 'react';
import { MicroLessonContainer } from '../../MicroLessonContainer';
import { geneticsDNAMicroLessons } from './GeneticsDNAMicroLessonData';

interface GeneticsDNAMicroLessonProps {
  onComplete?: () => void;
  onNext?: () => void;
  hasNext?: boolean;
}

export const GeneticsDNAMicroLesson: React.FC<GeneticsDNAMicroLessonProps> = ({ 
  onComplete, 
  onNext, 
  hasNext 
}) => {
  return (
    <MicroLessonContainer
      lessonData={geneticsDNAMicroLessons}
      onComplete={onComplete}
      onNext={onNext}
      hasNext={hasNext}
    />
  );
};