import React from 'react';
import { MicroLessonContainer } from '../MicroLessonContainer';
import { quadrilateralsMicroLessons } from './QuadrilateralsMicroLessonData';
import { quadrilateralsMicroLessonsPartTwo } from './QuadrilateralsMicroLessonDataPart2';

interface QuadrilateralsMicroLessonProps {
  onComplete?: () => void;
  onNext?: () => void;
  hasNext?: boolean;
}

export const QuadrilateralsMicroLesson: React.FC<QuadrilateralsMicroLessonProps> = ({ 
  onComplete, 
  onNext, 
  hasNext 
}) => {
  // Combine both parts of the lesson data
  const combinedLessonData = {
    ...quadrilateralsMicroLessons,
    totalScreens: quadrilateralsMicroLessons.totalScreens + quadrilateralsMicroLessonsPartTwo.length,
    screens: [...quadrilateralsMicroLessons.screens, ...quadrilateralsMicroLessonsPartTwo]
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