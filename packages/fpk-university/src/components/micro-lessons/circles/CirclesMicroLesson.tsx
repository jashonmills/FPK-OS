import React from 'react';
import { MicroLessonContainer } from '../MicroLessonContainer';
import { circlesMicroLessons } from './CirclesMicroLessonData';
import { circlesMicroLessonsPartTwo } from './CirclesMicroLessonDataPart2';

interface CirclesMicroLessonProps {
  onComplete?: () => void;
  onNext?: () => void;
  hasNext?: boolean;
}

export const CirclesMicroLesson: React.FC<CirclesMicroLessonProps> = ({ 
  onComplete, 
  onNext, 
  hasNext 
}) => {
  // Combine both parts of the lesson data
  const combinedLessonData = {
    ...circlesMicroLessons,
    totalScreens: circlesMicroLessons.totalScreens + circlesMicroLessonsPartTwo.length,
    screens: [...circlesMicroLessons.screens, ...circlesMicroLessonsPartTwo]
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