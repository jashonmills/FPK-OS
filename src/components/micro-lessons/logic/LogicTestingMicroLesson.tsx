import React from 'react';
import { MicroLessonContainer } from '../MicroLessonContainer';

const logicTestingMicroLessons = {
  id: "logic-testing",
  moduleTitle: "Testing Deductive Arguments",
  totalScreens: 10,
  screens: [
    {
      id: "test-1",
      type: "concept" as const,
      title: "Why Test Arguments?",
      content: "Not every argument that looks convincing is actually valid. Testing arguments systematically helps you avoid being misled by persuasive but flawed reasoning.",
      estimatedTime: 3
    },
    {
      id: "test-2",
      type: "concept" as const,
      title: "The Counterexample Method",
      content: "To test validity, try to imagine a situation where all premises are true but the conclusion is false. If you can imagine such a situation, the argument is invalid.",
      estimatedTime: 4
    },
    {
      id: "test-3",
      type: "example" as const,
      title: "Testing with Counterexamples",
      content: "Argument: 'All birds fly. Penguins are birds. Therefore, penguins fly.' Counterexample: Penguins are indeed birds, but they don't fly. This shows the first premise is false, making the argument unsound.",
      estimatedTime: 3
    },
    {
      id: "test-4",
      type: "practice" as const,
      title: "Practice: Finding Counterexamples",
      content: "Test this argument: 'All expensive things are high quality. This watch is expensive. Therefore, this watch is high quality.' Can you think of expensive things that aren't high quality?",
      estimatedTime: 4
    },
    {
      id: "test-5",
      type: "concept" as const,
      title: "The Substitution Method",
      content: "Replace the specific content with similar content to see if the form works. If the same logical form produces an obviously false conclusion from true premises, the original argument is invalid.",
      estimatedTime: 4
    },
    {
      id: "test-6",
      type: "example" as const,
      title: "Substitution Example",
      content: "Original: 'If it's sunny, people are happy. People are happy. Therefore, it's sunny.' Substitute: 'If it's raining, the ground is wet. The ground is wet. Therefore, it's raining.' The substitution shows this form is invalid (ground could be wet for other reasons).",
      estimatedTime: 4
    },
    {
      id: "test-7",
      type: "practice" as const,
      title: "Practice: Using Substitution",
      content: "Test by substitution: 'If you study hard, you'll get good grades. You got good grades. Therefore, you studied hard.' Try substituting with 'If you eat ice cream, you'll be happy.'",
      estimatedTime: 5
    },
    {
      id: "test-8",
      type: "concept" as const,
      title: "Checking for Hidden Assumptions",
      content: "Arguments often rely on unstated assumptions. Make these explicit and test whether they're reasonable. An argument might seem valid but rely on questionable assumptions.",
      estimatedTime: 4
    },
    {
      id: "test-9",
      type: "practice" as const,
      title: "Practice: Spotting Hidden Assumptions",
      content: "What's the hidden assumption? 'Sarah got into Harvard. Therefore, Sarah is very smart.' What does this assume about Harvard admissions? Is that assumption always true?",
      estimatedTime: 5
    },
    {
      id: "test-10",
      type: "summary" as const,
      title: "Key Takeaways",
      content: "Test arguments using counterexamples (imagine situations where premises are true but conclusion false) and substitution (replace content to test the logical form). Always check for hidden assumptions that might be questionable.",
      estimatedTime: 2
    }
  ]
};

interface LogicTestingMicroLessonProps {
  onComplete?: () => void;
  onNext?: () => void;
  hasNext?: boolean;
}

export const LogicTestingMicroLesson: React.FC<LogicTestingMicroLessonProps> = ({ 
  onComplete, 
  onNext, 
  hasNext 
}) => {
  return (
    <MicroLessonContainer
      lessonData={logicTestingMicroLessons}
      onComplete={onComplete}
      onNext={onNext}
      hasNext={hasNext}
    />
  );
};