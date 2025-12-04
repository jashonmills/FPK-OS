import React from 'react';
import { MicroLessonContainer } from '../MicroLessonContainer';
import { coordinateGeometryMicroLessons } from './CoordinateGeometryMicroLessonData';
import { coordinateGeometryMicroLessonsPartTwo } from './CoordinateGeometryMicroLessonDataPart2';

interface CoordinateGeometryMicroLessonProps {
  onComplete?: () => void;
  onNext?: () => void;
  hasNext?: boolean;
}

export const CoordinateGeometryMicroLesson: React.FC<CoordinateGeometryMicroLessonProps> = ({ 
  onComplete, 
  onNext, 
  hasNext 
}) => {
  // Combine both parts of the lesson data
  const combinedLessonData = {
    ...coordinateGeometryMicroLessons,
    totalScreens: coordinateGeometryMicroLessons.totalScreens + coordinateGeometryMicroLessonsPartTwo.length,
    screens: [...coordinateGeometryMicroLessons.screens, ...coordinateGeometryMicroLessonsPartTwo]
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