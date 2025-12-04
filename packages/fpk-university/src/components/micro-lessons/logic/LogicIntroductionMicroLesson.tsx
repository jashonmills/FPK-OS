import React from 'react';
import { MicroLessonContainer } from '../MicroLessonContainer';

const logicIntroductionMicroLessons = {
  id: "logic-introduction",
  moduleTitle: "What is Critical Thinking?",
  totalScreens: 8,
  screens: [
    {
      id: "intro-1",
      type: "concept" as const,
      title: "Welcome to Critical Thinking",
      content: "Critical thinking is the objective analysis and evaluation of an issue in order to form a judgment. It's about thinking clearly and rationally, understanding logical connections between ideas.",
      estimatedTime: 2
    },
    {
      id: "intro-2",
      type: "concept" as const,
      title: "Automatic vs. Deliberate Thinking",
      content: "Most of our daily thinking is automatic - we respond quickly without deep analysis. Critical thinking requires deliberate, systematic analysis of information and arguments.",
      estimatedTime: 3
    },
    {
      id: "intro-3",
      type: "example" as const,
      title: "Example: Making a Purchase Decision",
      content: "Automatic thinking: 'This looks good, I'll buy it.' Critical thinking: 'Do I need this? What are the alternatives? What are the long-term costs and benefits?'",
      estimatedTime: 2
    },
    {
      id: "intro-4",
      type: "concept" as const,
      title: "The Elements of Critical Thinking",
      content: "Critical thinking involves: questioning assumptions, evaluating evidence, analyzing arguments, considering alternative perspectives, and drawing logical conclusions.",
      estimatedTime: 3
    },
    {
      id: "intro-5",
      type: "practice" as const,
      title: "Practice: Identifying Thinking Types",
      content: "Read this scenario: 'Sarah sees a social media post claiming a miracle diet works in 7 days. She immediately orders the product.' Is this automatic or critical thinking? What questions should Sarah ask?",
      estimatedTime: 4
    },
    {
      id: "intro-6",
      type: "example" as const,
      title: "Critical Thinking in Academic Success",
      content: "Students who develop critical thinking skills perform better because they can analyze complex problems, evaluate sources, construct logical arguments, and make connections between concepts.",
      estimatedTime: 3
    },
    {
      id: "intro-7",
      type: "practice" as const,
      title: "Your Critical Thinking Challenge",
      content: "Think of a recent decision you made quickly. What additional questions could you have asked? What information might have changed your decision?",
      estimatedTime: 5
    },
    {
      id: "intro-8",
      type: "summary" as const,
      title: "Key Takeaways",
      content: "Critical thinking is deliberate analysis that goes beyond automatic responses. It involves questioning, evaluating evidence, and considering multiple perspectives to make better decisions.",
      estimatedTime: 2
    }
  ]
};

interface LogicIntroductionMicroLessonProps {
  onComplete?: () => void;
  onNext?: () => void;
  hasNext?: boolean;
}

export const LogicIntroductionMicroLesson: React.FC<LogicIntroductionMicroLessonProps> = ({ 
  onComplete, 
  onNext, 
  hasNext 
}) => {
  return (
    <MicroLessonContainer
      lessonData={logicIntroductionMicroLessons}
      onComplete={onComplete}
      onNext={onNext}
      hasNext={hasNext}
    />
  );
};