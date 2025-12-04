import React from 'react';
import { MicroLessonContainer } from '../../MicroLessonContainer';
import { shortAnswerQuestionsMicroLessons } from './ShortAnswerQuestionsMicroLessonData';

interface ShortAnswerQuestionsMicroLessonProps {
  onComplete?: () => void;
  onNext?: () => void;
  hasNext?: boolean;
}

export const ShortAnswerQuestionsMicroLesson: React.FC<ShortAnswerQuestionsMicroLessonProps> = ({ 
  onComplete, 
  onNext, 
  hasNext 
}) => {
  return (
    <MicroLessonContainer
      lessonData={shortAnswerQuestionsMicroLessons}
      onComplete={onComplete}
      onNext={onNext}
      hasNext={hasNext}
    />
  );
};