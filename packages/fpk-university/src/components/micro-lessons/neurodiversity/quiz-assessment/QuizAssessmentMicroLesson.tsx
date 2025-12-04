import React from 'react';
import { MicroLessonContainer } from '../../MicroLessonContainer';
import { quizAssessmentMicroLessons } from './QuizAssessmentMicroLessonData';

interface QuizAssessmentMicroLessonProps {
  onComplete?: () => void;
  onNext?: () => void;
  hasNext?: boolean;
}

export const QuizAssessmentMicroLesson: React.FC<QuizAssessmentMicroLessonProps> = ({ 
  onComplete, 
  onNext, 
  hasNext 
}) => {
  return (
    <MicroLessonContainer
      lessonData={quizAssessmentMicroLessons}
      onComplete={onComplete}
      onNext={onNext}
      hasNext={hasNext}
    />
  );
};