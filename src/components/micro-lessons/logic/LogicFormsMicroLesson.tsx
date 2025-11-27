import React from 'react';
import { MicroLessonContainer } from '../MicroLessonContainer';

const logicFormsMicroLessons = {
  id: "logic-forms",
  moduleTitle: "Basic Logical Forms",
  totalScreens: 12,
  screens: [
    {
      id: "forms-1",
      type: "concept" as const,
      title: "Logical Forms and Patterns",
      content: "Arguments follow patterns or forms. Learning these basic forms helps you recognize valid reasoning and spot logical errors. The same form can be used with different content.",
      estimatedTime: 3
    },
    {
      id: "forms-2",
      type: "concept" as const,
      title: "Modus Ponens (Affirming the Antecedent)",
      content: "Form: If P, then Q. P is true. Therefore, Q is true. Example: If it rains, the ground gets wet. It's raining. Therefore, the ground is wet.",
      estimatedTime: 4
    },
    {
      id: "forms-3",
      type: "practice" as const,
      title: "Practice: Modus Ponens",
      content: "Complete this modus ponens argument: 'If you study hard, you'll pass the test. You studied hard. Therefore, ___?' What's the conclusion?",
      estimatedTime: 3
    },
    {
      id: "forms-4",
      type: "concept" as const,
      title: "Modus Tollens (Denying the Consequent)",
      content: "Form: If P, then Q. Q is false. Therefore, P is false. Example: If it's a bird, it has feathers. This doesn't have feathers. Therefore, it's not a bird.",
      estimatedTime: 4
    },
    {
      id: "forms-5",
      type: "practice" as const,
      title: "Practice: Modus Tollens",
      content: "Use modus tollens: 'If the store is open, the lights are on. The lights are not on. Therefore, ___?' What can you conclude?",
      estimatedTime: 3
    },
    {
      id: "forms-6",
      type: "concept" as const,
      title: "Hypothetical Syllogism (Chain Reasoning)",
      content: "Form: If P, then Q. If Q, then R. Therefore, if P, then R. Example: If you exercise, you'll be healthy. If you're healthy, you'll be happy. Therefore, if you exercise, you'll be happy.",
      estimatedTime: 4
    },
    {
      id: "forms-7",
      type: "example" as const,
      title: "Disjunctive Syllogism (Either/Or)",
      content: "Form: Either P or Q. Not P. Therefore, Q. Example: Either we go to the movies or stay home. We're not going to the movies. Therefore, we're staying home.",
      estimatedTime: 3
    },
    {
      id: "forms-8",
      type: "practice" as const,
      title: "Practice: Identifying Forms",
      content: "What form is this? 'If it's Tuesday, we have class. If we have class, I need my textbook. Therefore, if it's Tuesday, I need my textbook.'",
      estimatedTime: 4
    },
    {
      id: "forms-9",
      type: "concept" as const,
      title: "Common Invalid Forms",
      content: "Affirming the consequent: If P, then Q. Q is true. Therefore, P is true. This is INVALID. Just because the ground is wet doesn't mean it rained (could be sprinklers).",
      estimatedTime: 4
    },
    {
      id: "forms-10",
      type: "practice" as const,
      title: "Practice: Spotting Invalid Forms",
      content: "Is this valid? 'If you're a good student, you get good grades. You got good grades. Therefore, you're a good student.' Why or why not?",
      estimatedTime: 4
    },
    {
      id: "forms-11",
      type: "example" as const,
      title: "Real-World Application",
      content: "Medical diagnosis often uses these forms: 'If you have strep throat, you'll have a sore throat. You don't have a sore throat. Therefore, you don't have strep throat.' (Modus tollens)",
      estimatedTime: 3
    },
    {
      id: "forms-12",
      type: "summary" as const,
      title: "Key Takeaways",
      content: "Basic logical forms include modus ponens, modus tollens, hypothetical syllogism, and disjunctive syllogism. These patterns help you construct valid arguments and identify invalid reasoning.",
      estimatedTime: 2
    }
  ]
};

interface LogicFormsMicroLessonProps {
  onComplete?: () => void;
  onNext?: () => void;
  hasNext?: boolean;
}

export const LogicFormsMicroLesson: React.FC<LogicFormsMicroLessonProps> = ({ 
  onComplete, 
  onNext, 
  hasNext 
}) => {
  return (
    <MicroLessonContainer
      lessonData={logicFormsMicroLessons}
      onComplete={onComplete}
      onNext={onNext}
      hasNext={hasNext}
    />
  );
};