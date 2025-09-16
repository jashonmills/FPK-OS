import React from 'react';
import { MicroLessonContainer } from '../MicroLessonContainer';

const logicDeductiveMicroLessons = {
  id: "logic-deductive",
  moduleTitle: "What is Deductive Reasoning?",
  totalScreens: 10,
  screens: [
    {
      id: "deduct-1",
      type: "concept" as const,
      title: "Introduction to Deductive Reasoning",
      content: "Deductive reasoning moves from general principles to specific conclusions. If the premises are true and the logic is valid, the conclusion must be true. It's the gold standard of logical reasoning.",
      estimatedTime: 3
    },
    {
      id: "deduct-2",
      type: "example" as const,
      title: "Classic Deductive Example",
      content: "All humans are mortal. Socrates is human. Therefore, Socrates is mortal. This moves from the general rule (all humans) to a specific case (Socrates).",
      estimatedTime: "3 mins"
    },
    {
      id: "deduct-3",
      type: "concept" as const,
      title: "Validity vs. Soundness",
      content: "A valid argument has correct logical structure - if premises were true, conclusion would follow. A sound argument is valid AND has true premises. All sound arguments are valid, but not all valid arguments are sound.",
      estimatedTime: "4 mins"
    },
    {
      id: "deduct-4",
      type: "practice" as const,
      title: "Practice: Valid or Invalid?",
      content: "All cats are mammals. Fluffy is a cat. Therefore, Fluffy is a mammal. Is this valid? Is it sound? (Assume all premises are true.)",
      estimatedTime: "3 mins"
    },
    {
      id: "deduct-5",
      type: "example" as const,
      title: "Valid but Unsound Argument",
      content: "All birds are blue. Penguins are birds. Therefore, penguins are blue. This is valid (correct structure) but unsound (false premise).",
      estimatedTime: "3 mins"
    },
    {
      id: "deduct-6",
      type: "concept" as const,
      title: "Deductive vs. Inductive",
      content: "Deductive reasoning guarantees conclusions if premises are true. Inductive reasoning makes probable conclusions based on patterns. 'All observed swans are white, so all swans are white' is inductive.",
      estimatedTime: "4 mins"
    },
    {
      id: "deduct-7",
      type: "practice" as const,
      title: "Practice: Deductive or Inductive?",
      content: "Which is deductive? A) 'Every time I water plants, they grow better. So watering helps plants.' B) 'All plants need water. This is a plant. So it needs water.'",
      estimatedTime: "4 mins"
    },
    {
      id: "deduct-8",
      type: "example" as const,
      title: "Deductive Reasoning in Math",
      content: "Mathematical proofs use deductive reasoning. From axioms and previously proven theorems, we deduce new truths. This is why mathematical conclusions are certain, not just probable.",
      estimatedTime: "3 mins"
    },
    {
      id: "deduct-9",
      type: "practice" as const,
      title: "Creating Deductive Arguments",
      content: "Create a deductive argument to conclude 'My car won't start.' What general rule and specific fact could lead to this conclusion?",
      estimatedTime: "5 mins"
    },
    {
      id: "deduct-10",
      type: "summary" as const,
      title: "Key Takeaways",
      content: "Deductive reasoning moves from general to specific with guaranteed conclusions. Valid arguments have correct structure; sound arguments are valid with true premises. This provides the strongest form of logical support.",
      estimatedTime: "2 mins"
    }
  ]
};

interface LogicDeductiveMicroLessonProps {
  onComplete?: () => void;
  onNext?: () => void;
  hasNext?: boolean;
}

export const LogicDeductiveMicroLesson: React.FC<LogicDeductiveMicroLessonProps> = ({ 
  onComplete, 
  onNext, 
  hasNext 
}) => {
  return (
    <MicroLessonContainer
      lessonData={logicDeductiveMicroLessons}
      onComplete={onComplete}
      onNext={onNext}
      hasNext={hasNext}
    />
  );
};