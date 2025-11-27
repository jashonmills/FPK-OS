import React from 'react';
import { MicroLessonContainer } from '../MicroLessonContainer';

const logicIdentificationMicroLessons = {
  id: "logic-identification",
  moduleTitle: "Identifying Arguments in Context",
  totalScreens: 10,
  screens: [
    {
      id: "ident-1",
      type: "concept" as const,
      title: "Arguments in Real Life",
      content: "Arguments aren't just in textbooks - they're everywhere! In news articles, advertisements, conversations, social media posts, and academic papers. Learning to spot them is crucial for critical thinking.",
      estimatedTime: 3
    },
    {
      id: "ident-2",
      type: "example" as const,
      title: "Arguments in News Articles",
      content: "News headline: 'City Should Invest in Public Transit.' The article argues: 'Public transit reduces traffic congestion, lowers pollution, and provides affordable transportation options for residents.'",
      estimatedTime: 3
    },
    {
      id: "ident-3",
      type: "practice" as const,
      title: "Practice: Social Media Arguments",
      content: "Analyze this post: 'Everyone should exercise daily. It boosts mood, improves health, and increases energy levels.' Identify the conclusion and premises.",
      estimatedTime: 4
    },
    {
      id: "ident-4",
      type: "concept" as const,
      title: "Arguments in Advertisements",
      content: "Ads constantly make arguments: 'Buy our product because it's faster, cheaper, and more reliable than competitors.' The conclusion is 'buy our product' and the premises are the claimed benefits.",
      estimatedTime: 3
    },
    {
      id: "ident-5",
      type: "example" as const,
      title: "Academic Arguments",
      content: "Research paper: 'Reading fiction improves empathy because it allows readers to experience different perspectives and emotional situations vicariously.' Conclusion: fiction improves empathy. Premise: experiencing different perspectives builds empathy.",
      estimatedTime: 4
    },
    {
      id: "ident-6",
      type: "practice" as const,
      title: "Practice: Conversation Arguments",
      content: "Friend says: 'We should leave early for the concert since traffic will be heavy and parking fills up quickly.' What's the argument structure here?",
      estimatedTime: 3
    },
    {
      id: "ident-7",
      type: "concept" as const,
      title: "Non-Arguments That Look Like Arguments",
      content: "Not everything with 'because' is an argument. Explanations tell us why something happened, but don't try to prove it should happen. 'The plant died because it wasn't watered' explains, doesn't argue.",
      estimatedTime: 4
    },
    {
      id: "ident-8",
      type: "practice" as const,
      title: "Practice: Arguments vs. Explanations",
      content: "Which is an argument? A) 'You should study harder because your grades are low.' B) 'Your grades are low because you didn't study hard enough.'",
      estimatedTime: 3
    },
    {
      id: "ident-9",
      type: "example" as const,
      title: "Complex Real-World Example",
      content: "Editorial: 'The city should ban plastic bags. They harm marine life, contribute to landfill waste, and many cities have successfully implemented alternatives.' Multiple premises supporting one conclusion.",
      estimatedTime: 4
    },
    {
      id: "ident-10",
      type: "summary" as const,
      title: "Key Takeaways",
      content: "Arguments appear in all types of communication. Look for claims being supported by reasons. Distinguish between arguments (trying to prove something) and explanations (telling why something happened).",
      estimatedTime: 2
    }
  ]
};

interface LogicIdentificationMicroLessonProps {
  onComplete?: () => void;
  onNext?: () => void;
  hasNext?: boolean;
}

export const LogicIdentificationMicroLesson: React.FC<LogicIdentificationMicroLessonProps> = ({ 
  onComplete, 
  onNext, 
  hasNext 
}) => {
  return (
    <MicroLessonContainer
      lessonData={logicIdentificationMicroLessons}
      onComplete={onComplete}
      onNext={onNext}
      hasNext={hasNext}
    />
  );
};