import React from 'react';
import { MicroLessonContainer } from '../MicroLessonContainer';
import { pointsLinesPlanesMicroLessons } from './PointsLinesPlanesMicroLessonData';
import { pointsLinesPlanesMicroLessonsPartTwo } from './PointsLinesPlanesMicroLessonDataPart2';

interface PointsLinesPlanesMicroLessonProps {
  onComplete?: () => void;
  onNext?: () => void;
  hasNext?: boolean;
}

export const PointsLinesPlanesMicroLesson: React.FC<PointsLinesPlanesMicroLessonProps> = ({ 
  onComplete, 
  onNext, 
  hasNext 
}) => {
  // Combine both parts of the lesson data
  const combinedLessonData = {
    ...pointsLinesPlanesMicroLessons,
    totalScreens: pointsLinesPlanesMicroLessons.totalScreens + pointsLinesPlanesMicroLessonsPartTwo.length,
    screens: [...pointsLinesPlanesMicroLessons.screens, ...pointsLinesPlanesMicroLessonsPartTwo]
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