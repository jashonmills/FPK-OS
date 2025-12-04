import React from 'react';
import { MicroLessonContainer } from '../../MicroLessonContainer';
import { thrivingEconomicsMicroLessons } from './ThrivingEconomicsMicroLessonData';

interface ThrivingEconomicsMicroLessonProps {
  onComplete?: () => void;
  onNext?: () => void;
  hasNext?: boolean;
}

export const ThrivingEconomicsMicroLesson: React.FC<ThrivingEconomicsMicroLessonProps> = ({ 
  onComplete, 
  onNext, 
  hasNext 
}) => {
  return (
    <MicroLessonContainer
      lessonData={thrivingEconomicsMicroLessons}
      onComplete={onComplete}
      onNext={onNext}
      hasNext={hasNext}
    />
  );
};