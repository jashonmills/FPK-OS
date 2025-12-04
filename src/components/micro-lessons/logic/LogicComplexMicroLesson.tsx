import React from 'react';
import { MicroLessonContainer } from '../MicroLessonContainer';

const logicComplexMicroLessons = {
  id: "logic-complex",
  moduleTitle: "Complex Deductive Arguments",
  totalScreens: 11,
  screens: [
    {
      id: "complex-1",
      type: "concept" as const,
      title: "Beyond Simple Arguments",
      content: "Real-world reasoning often involves multiple steps, interconnected premises, and complex logical chains. Understanding complex arguments is essential for advanced critical thinking.",
      estimatedTime: 3
    },
    {
      id: "complex-2",
      type: "example" as const,
      title: "Multi-Step Reasoning",
      content: "Complex argument: All mammals are warm-blooded. All dogs are mammals. All golden retrievers are dogs. Bella is a golden retriever. Therefore, Bella is warm-blooded. This chains multiple simple arguments together.",
      estimatedTime: 4
    },
    {
      id: "complex-3",
      type: "practice" as const,
      title: "Practice: Breaking Down Complex Arguments",
      content: "Analyze: 'All students who attend class regularly pass. All students who pass graduate on time. All students who graduate on time get good jobs. Sarah attends class regularly. Therefore, Sarah will get a good job.' What are the intermediate conclusions?",
      estimatedTime: 5
    },
    {
      id: "complex-4",
      type: "concept" as const,
      title: "Arguments with Multiple Premises",
      content: "Some conclusions require multiple independent premises working together. The strength of the argument depends on all premises being true and relevant.",
      estimatedTime: 3
    },
    {
      id: "complex-5",
      type: "example" as const,
      title: "Convergent Reasoning",
      content: "Conclusion: 'We should buy this car.' Supporting premises: 'It has good safety ratings.' 'It's within our budget.' 'It has low maintenance costs.' 'It's fuel efficient.' Each premise independently supports the conclusion.",
      estimatedTime: 4
    },
    {
      id: "complex-6",
      type: "practice" as const,
      title: "Practice: Identifying Argument Structure",
      content: "Map this argument: 'Climate change is real because global temperatures are rising, sea levels are increasing, and weather patterns are becoming more extreme. We should reduce carbon emissions because climate change is real and harmful.'",
      estimatedTime: 5
    },
    {
      id: "complex-7",
      type: "concept" as const,
      title: "Conditional Chains",
      content: "Complex conditionals create chains of reasoning: If A, then B. If B, then C. If C, then D. These chains can be very long in real arguments, but one broken link invalidates the whole chain.",
      estimatedTime: 4
    },
    {
      id: "complex-8",
      type: "example" as const,
      title: "Real-World Complex Argument",
      content: "Legal reasoning: 'If the defendant was at the scene, they had opportunity. If they had motive and opportunity, they could have committed the crime. The defendant had motive. The fingerprints prove they were at the scene. Therefore, they could have committed the crime.'",
      estimatedTime: 4
    },
    {
      id: "complex-9",
      type: "practice" as const,
      title: "Practice: Finding Weak Links",
      content: "Identify the potential weakness: 'If we raise taxes, we'll have more revenue. If we have more revenue, we can improve schools. Better schools create smarter citizens. Smarter citizens make better decisions. Therefore, raising taxes leads to better decisions.'",
      estimatedTime: 5
    },
    {
      id: "complex-10",
      type: "concept" as const,
      title: "Evaluating Complex Arguments",
      content: "For complex arguments, check each step: Are all premises true? Does each conclusion follow from its premises? Are there unstated assumptions? Is the overall chain of reasoning sound?",
      estimatedTime: 4
    },
    {
      id: "complex-11",
      type: "summary" as const,
      title: "Key Takeaways",
      content: "Complex arguments use multiple steps, interconnected premises, and conditional chains. Break them down into component parts, evaluate each step, and look for weak links that could undermine the entire argument.",
      estimatedTime: 2
    }
  ]
};

interface LogicComplexMicroLessonProps {
  onComplete?: () => void;
  onNext?: () => void;
  hasNext?: boolean;
}

export const LogicComplexMicroLesson: React.FC<LogicComplexMicroLessonProps> = ({ 
  onComplete, 
  onNext, 
  hasNext 
}) => {
  return (
    <MicroLessonContainer
      lessonData={logicComplexMicroLessons}
      onComplete={onComplete}
      onNext={onNext}
      hasNext={hasNext}
    />
  );
};