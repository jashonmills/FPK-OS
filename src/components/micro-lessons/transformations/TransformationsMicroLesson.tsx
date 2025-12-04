import React from 'react';
import { MicroLessonContainer } from '../MicroLessonContainer';
import { transformationsMicroLessons } from './TransformationsMicroLessonData';
import { transformationsMicroLessonsPartTwo } from './TransformationsMicroLessonDataPart2';

interface TransformationsMicroLessonProps {
  onComplete?: () => void;
  onNext?: () => void;
  hasNext?: boolean;
}

export const TransformationsMicroLesson: React.FC<TransformationsMicroLessonProps> = ({ 
  onComplete, 
  onNext, 
  hasNext 
}) => {
  // Combine both parts of the lesson data
  const combinedLessonData = {
    ...transformationsMicroLessons,
    totalScreens: transformationsMicroLessons.totalScreens + transformationsMicroLessonsPartTwo.length,
    screens: [...transformationsMicroLessons.screens, ...transformationsMicroLessonsPartTwo]
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