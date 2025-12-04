import React from 'react';
import { MicroLessonContainer } from '../MicroLessonContainer';
import { threeDShapesMicroLessons } from './ThreeDShapesMicroLessonData';
import { threeDShapesMicroLessonsPartTwo } from './ThreeDShapesMicroLessonDataPart2';

interface ThreeDShapesMicroLessonProps {
  onComplete?: () => void;
  onNext?: () => void;
  hasNext?: boolean;
}

export const ThreeDShapesMicroLesson: React.FC<ThreeDShapesMicroLessonProps> = ({ 
  onComplete, 
  onNext, 
  hasNext 
}) => {
  // Combine both parts of the lesson data
  const combinedLessonData = {
    ...threeDShapesMicroLessons,
    totalScreens: threeDShapesMicroLessons.totalScreens + threeDShapesMicroLessonsPartTwo.length,
    screens: [...threeDShapesMicroLessons.screens, ...threeDShapesMicroLessonsPartTwo]
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