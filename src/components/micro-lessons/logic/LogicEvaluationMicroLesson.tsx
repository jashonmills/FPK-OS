import React from 'react';
import { MicroLessonContainer } from '../MicroLessonContainer';

const logicEvaluationMicroLessons = {
  id: "logic-evaluation",
  moduleTitle: "Evaluating Argument Quality",
  totalScreens: 11,
  screens: [
    {
      id: "eval-1",
      type: "concept" as const,
      title: "What Makes a Good Argument?",
      content: "Not all arguments are created equal. Good arguments have true premises that actually support their conclusions. Bad arguments have false premises or premises that don't support the conclusion.",
      estimatedTime: 3
    },
    {
      id: "eval-2",
      type: "concept" as const,
      title: "Two Key Questions",
      content: "To evaluate any argument, ask: 1) Are the premises true? 2) Do the premises actually support the conclusion? Both must be 'yes' for a strong argument.",
      estimatedTime: 3
    },
    {
      id: "eval-3",
      type: "example" as const,
      title: "Weak Argument Example",
      content: "Argument: 'All birds can fly. Penguins are birds. Therefore, penguins can fly.' The logic is correct, but the first premise is false, making the argument weak.",
      estimatedTime: 3
    },
    {
      id: "eval-4",
      type: "practice" as const,
      title: "Practice: Evaluating Premises",
      content: "Evaluate: 'Expensive products are always better quality. This product is expensive. Therefore, it's high quality.' Are the premises true? Does the conclusion follow?",
      estimatedTime: 4
    },
    {
      id: "eval-5",
      type: "concept" as const,
      title: "Relevance of Premises",
      content: "Even true premises might not support the conclusion. 'Shakespeare was English. English people drink tea. Therefore, Shakespeare wrote great plays.' The premises are true but irrelevant to the conclusion.",
      estimatedTime: 4
    },
    {
      id: "eval-6",
      type: "example" as const,
      title: "Strong Argument Example",
      content: "Argument: 'Regular exercise improves cardiovascular health. Cardiovascular health is important for longevity. Therefore, regular exercise can help you live longer.' True premises that support the conclusion.",
      estimatedTime: 3
    },
    {
      id: "eval-7",
      type: "practice" as const,
      title: "Practice: Identifying Relevance",
      content: "Is this relevant? 'We should hire Sarah because she has a college degree and arrives on time.' Do these premises support hiring Sarah for any specific job?",
      estimatedTime: 4
    },
    {
      id: "eval-8",
      type: "concept" as const,
      title: "Sufficient vs. Insufficient Support",
      content: "Sometimes premises are true and relevant but don't provide enough support. 'Some students like math. Therefore, all students should take advanced calculus.' The premise doesn't strongly support the conclusion.",
      estimatedTime: 4
    },
    {
      id: "eval-9",
      type: "practice" as const,
      title: "Practice: Assessing Support Strength",
      content: "How strong is this argument? 'Five people said this restaurant is good. Therefore, it's the best restaurant in town.' What additional information would strengthen this argument?",
      estimatedTime: 5
    },
    {
      id: "eval-10",
      type: "example" as const,
      title: "Real-World Application",
      content: "Political claim: 'Crime rates dropped 10% after our policy was implemented. Therefore, our policy reduced crime.' What else could explain the drop? How would you evaluate this argument?",
      estimatedTime: 4
    },
    {
      id: "eval-11",
      type: "summary" as const,
      title: "Key Takeaways",
      content: "Evaluate arguments by checking if premises are true, relevant, and sufficient to support the conclusion. Strong arguments require all three elements. Always consider alternative explanations and missing information.",
      estimatedTime: 2
    }
  ]
};

interface LogicEvaluationMicroLessonProps {
  onComplete?: () => void;
  onNext?: () => void;
  hasNext?: boolean;
}

export const LogicEvaluationMicroLesson: React.FC<LogicEvaluationMicroLessonProps> = ({ 
  onComplete, 
  onNext, 
  hasNext 
}) => {
  return (
    <MicroLessonContainer
      lessonData={logicEvaluationMicroLessons}
      onComplete={onComplete}
      onNext={onNext}
      hasNext={hasNext}
    />
  );
};