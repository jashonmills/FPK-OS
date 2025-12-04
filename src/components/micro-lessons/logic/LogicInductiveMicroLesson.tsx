import React from 'react';
import { MicroLessonContainer } from '../MicroLessonContainer';

const logicInductiveMicroLessons = {
  id: "logic-inductive",
  moduleTitle: "The Nature of Inductive Arguments",
  totalScreens: 12,
  screens: [
    {
      id: "induct-1",
      type: "concept" as const,
      title: "Introduction to Inductive Reasoning",
      content: "While deductive reasoning guarantees conclusions, inductive reasoning makes conclusions probable based on evidence. Most everyday reasoning is inductive - we make generalizations from specific observations.",
      estimatedTime: 3
    },
    {
      id: "induct-2",
      type: "example" as const,
      title: "Inductive vs. Deductive",
      content: "Deductive: 'All students at this school wear uniforms. Sarah is a student here. Therefore, Sarah wears a uniform.' Inductive: 'I've seen 20 students at this school, all wearing uniforms. Therefore, all students here probably wear uniforms.'",
      estimatedTime: 4
    },
    {
      id: "induct-3",
      type: "concept" as const,
      title: "Strength, Not Validity",
      content: "Inductive arguments are strong or weak, not valid or invalid. A strong inductive argument makes the conclusion highly probable. A weak one provides little support for the conclusion.",
      estimatedTime: 3
    },
    {
      id: "induct-4",
      type: "practice" as const,
      title: "Practice: Evaluating Inductive Strength",
      content: "How strong is this argument? 'I've flipped this coin 10 times and got heads every time. Therefore, this coin always lands heads.' What would make this argument stronger?",
      estimatedTime: 4
    },
    {
      id: "induct-5",
      type: "concept" as const,
      title: "Types of Inductive Arguments",
      content: "Common types include: Generalization (from sample to population), Analogy (comparing similar cases), Causal reasoning (inferring cause-effect relationships), and Statistical reasoning (using data to make predictions).",
      estimatedTime: 4
    },
    {
      id: "induct-6",
      type: "example" as const,
      title: "Inductive Generalization",
      content: "Sample: 'In a survey of 1,000 voters, 60% support Candidate A.' Generalization: 'Candidate A will probably win the election.' The strength depends on sample size, randomness, and representativeness.",
      estimatedTime: 4
    },
    {
      id: "induct-7",
      type: "practice" as const,
      title: "Practice: Analogical Reasoning",
      content: "Evaluate this analogy: 'Mars has seasons like Earth, ice caps like Earth, and a day length similar to Earth. Earth has life. Therefore, Mars probably has life.' How strong is this reasoning?",
      estimatedTime: 5
    },
    {
      id: "induct-8",
      type: "concept" as const,
      title: "The Problem of Induction",
      content: "Inductive reasoning assumes the future will be like the past, but this can't be proven deductively. Just because the sun has risen every day doesn't guarantee it will tomorrow - though it makes it highly probable.",
      estimatedTime: 4
    },
    {
      id: "induct-9",
      type: "example" as const,
      title: "Causal Inductive Reasoning",
      content: "Observation: 'Every time I water my plants, they grow better within a week.' Inductive conclusion: 'Watering causes plants to grow better.' This requires ruling out other possible causes.",
      estimatedTime: 4
    },
    {
      id: "induct-10",
      type: "practice" as const,
      title: "Practice: Identifying Causal Fallacies",
      content: "What's wrong with this reasoning? 'Crime rates dropped after we installed more streetlights. Therefore, streetlights reduce crime.' What other factors could explain the drop?",
      estimatedTime: 5
    },
    {
      id: "induct-11",
      type: "concept" as const,
      title: "Strengthening Inductive Arguments",
      content: "Make inductive arguments stronger by: increasing sample size, ensuring representative samples, considering alternative explanations, looking for supporting evidence from multiple sources, and acknowledging limitations.",
      estimatedTime: 4
    },
    {
      id: "induct-12",
      type: "summary" as const,
      title: "Key Takeaways",
      content: "Inductive reasoning makes probable conclusions from specific evidence. It's essential for science, everyday decision-making, and predictions. Evaluate inductive arguments by their strength, not validity, and always consider alternative explanations.",
      estimatedTime: 2
    }
  ]
};

interface LogicInductiveMicroLessonProps {
  onComplete?: () => void;
  onNext?: () => void;
  hasNext?: boolean;
}

export const LogicInductiveMicroLesson: React.FC<LogicInductiveMicroLessonProps> = ({ 
  onComplete, 
  onNext, 
  hasNext 
}) => {
  return (
    <MicroLessonContainer
      lessonData={logicInductiveMicroLessons}
      onComplete={onComplete}
      onNext={onNext}
      hasNext={hasNext}
    />
  );
};