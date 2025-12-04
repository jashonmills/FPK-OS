import React from 'react';
import { MicroLessonContainer } from '../MicroLessonContainer';
import { vectorsMicroLessons } from './VectorsMicroLessonData';
import { vectorsMicroLessonsPartTwo } from './VectorsMicroLessonDataPart2';

interface VectorsMicroLessonProps {
  onComplete?: () => void;
  onNext?: () => void;
  hasNext?: boolean;
}

export const VectorsMicroLesson: React.FC<VectorsMicroLessonProps> = ({ 
  onComplete, 
  onNext, 
  hasNext 
}) => {
  // Combine both parts of the lesson data
  const combinedLessonData = {
    ...vectorsMicroLessons,
    totalScreens: vectorsMicroLessons.totalScreens + vectorsMicroLessonsPartTwo.length,
    screens: [...vectorsMicroLessons.screens, ...vectorsMicroLessonsPartTwo]
  };

  return (
    <MicroLessonContainer
      lessonData={combinedLessonData}
      onComplete={onComplete}
      onNext={onNext}
      hasNext={hasNext}
    />
  );
};