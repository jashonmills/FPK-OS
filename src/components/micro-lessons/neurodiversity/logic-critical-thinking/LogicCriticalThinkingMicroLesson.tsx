import React from 'react';
import { MicroLessonContainer } from '../../MicroLessonContainer';
import { logicCriticalThinkingMicroLessons } from './LogicCriticalThinkingMicroLessonData';

interface LogicCriticalThinkingMicroLessonProps {
  onComplete?: () => void;
  onNext?: () => void;
  hasNext?: boolean;
}

export const LogicCriticalThinkingMicroLesson: React.FC<LogicCriticalThinkingMicroLessonProps> = ({ 
  onComplete, 
  onNext, 
  hasNext 
}) => {
  return (
    <MicroLessonContainer
      lessonData={logicCriticalThinkingMicroLessons}
      onComplete={onComplete}
      onNext={onNext}
      hasNext={hasNext}
    />
  );
};