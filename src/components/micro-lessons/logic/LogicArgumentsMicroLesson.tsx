import React from 'react';
import { MicroLessonContainer } from '../MicroLessonContainer';

const logicArgumentsMicroLessons = {
  id: "logic-arguments",
  moduleTitle: "Arguments vs. Opinions",
  totalScreens: 9,
  screens: [
    {
      id: "args-1",
      type: "concept" as const,
      title: "What is an Argument?",
      content: "In logic, an argument is a set of statements where one (the conclusion) is claimed to follow from the others (the premises). It's not a fight or disagreement, but a reasoned case for a position.",
      estimatedTime: 3
    },
    {
      id: "args-2",
      type: "concept" as const,
      title: "Arguments vs. Opinions",
      content: "An opinion is a personal belief or preference without supporting reasons. An argument provides reasons (premises) to support a claim (conclusion). 'I like pizza' is an opinion. 'We should order pizza because it's fast and everyone likes it' is an argument.",
      estimatedTime: 3
    },
    {
      id: "args-3",
      type: "example" as const,
      title: "Example: Recognizing Arguments",
      content: "Opinion: 'This movie is terrible.' Argument: 'This movie is terrible because the plot has holes, the acting is wooden, and the dialogue is unrealistic.'",
      estimatedTime: 2
    },
    {
      id: "args-4",
      type: "concept" as const,
      title: "Structure of Arguments",
      content: "Arguments have premises (the evidence or reasons) and a conclusion (what the premises are supposed to support). Look for indicator words like 'because', 'since', 'therefore', 'thus'.",
      estimatedTime: 4
    },
    {
      id: "args-5",
      type: "practice" as const,
      title: "Practice: Identifying Arguments",
      content: "Which of these is an argument? A) 'Coffee tastes great.' B) 'You should drink coffee because it improves focus and contains antioxidants.' C) 'I hate mornings.'",
      estimatedTime: 3
    },
    {
      id: "args-6",
      type: "example" as const,
      title: "Hidden Arguments",
      content: "Sometimes arguments are implied: 'All students should study logic.' The hidden premise might be 'Logic improves thinking skills' and 'All students need better thinking skills.'",
      estimatedTime: 3
    },
    {
      id: "args-7",
      type: "practice" as const,
      title: "Practice: Finding Hidden Premises",
      content: "What's the hidden premise in: 'You shouldn't text while driving'? Think about what assumption connects the premise to the conclusion.",
      estimatedTime: 4
    },
    {
      id: "args-8",
      type: "concept" as const,
      title: "Why This Matters",
      content: "Distinguishing arguments from opinions helps you evaluate claims more effectively. You can assess the quality of reasons rather than just accepting or rejecting based on personal preference.",
      estimatedTime: 3
    },
    {
      id: "args-9",
      type: "summary" as const,
      title: "Key Takeaways",
      content: "Arguments provide reasons for conclusions, while opinions are unsupported preferences. Look for premise indicators ('because', 'since') and conclusion indicators ('therefore', 'thus') to identify argument structure.",
      estimatedTime: 2
    }
  ]
};

interface LogicArgumentsMicroLessonProps {
  onComplete?: () => void;
  onNext?: () => void;
  hasNext?: boolean;
}

export const LogicArgumentsMicroLesson: React.FC<LogicArgumentsMicroLessonProps> = ({ 
  onComplete, 
  onNext, 
  hasNext 
}) => {
  return (
    <MicroLessonContainer
      lessonData={logicArgumentsMicroLessons}
      onComplete={onComplete}
      onNext={onNext}
      hasNext={hasNext}
    />
  );
};