import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown } from 'lucide-react';

export interface StructuredResponse {
  [questionId: string]: string;
}

interface StructuredQuestionsProps {
  category: string;
  responses: StructuredResponse;
  onResponseChange: (questionId: string, value: string) => void;
}

interface Question {
  id: string;
  text: string;
  type: 'dropdown' | 'radio' | 'text';
  options?: string[];
  required?: boolean;
}

interface QuestionSection {
  id: string;
  title: string;
  questions: Question[];
}

const questionSections: QuestionSection[] = [
  {
    id: 'learning-state',
    title: 'Learning State & EL Spelling Course',
    questions: [
      {
        id: 'instructions-clarity',
        text: 'How clear and easy to follow were the instructions in the Empowering Learning Spelling course?',
        type: 'dropdown',
        options: ['Very clear', 'Somewhat clear', 'Confusing', 'Didn\'t understand at all'],
        required: true
      },
      {
        id: 'iframe-sync',
        text: 'Did the Learning State iframe load and sync properly during your session?',
        type: 'radio',
        options: ['Yes', 'No', 'Not sure'],
        required: true
      },
      {
        id: 'content-engagement',
        text: 'How engaging was the content in the spelling course?',
        type: 'radio',
        options: ['Very engaging', 'Somewhat engaging', 'Not engaging'],
        required: true
      },
      {
        id: 'course-responsiveness',
        text: 'Did the course respond correctly to your inputs and progress?',
        type: 'radio',
        options: ['Yes', 'Some glitches', 'No'],
        required: true
      },
      {
        id: 'activities-issues',
        text: 'Were there any activities or questions that didn\'t make sense or didn\'t work?',
        type: 'text'
      },
      {
        id: 'ai-coach-helpfulness',
        text: 'How helpful was the AI coach while working through the spelling course?',
        type: 'radio',
        options: ['Very helpful', 'Somewhat helpful', 'Not helpful', 'Didn\'t use AI coach'],
        required: true
      }
    ]
  },
  {
    id: 'onboarding-dashboard',
    title: 'Onboarding & Dashboard Flow',
    questions: [
      {
        id: 'signup-process',
        text: 'Was the sign-up and subscription process smooth and easy to understand?',
        type: 'radio',
        options: ['Yes', 'Somewhat', 'Confusing', 'Had issues'],
        required: true
      },
      {
        id: 'navigation-clarity',
        text: 'Did you feel like you knew where to go and what to do after signing in?',
        type: 'radio',
        options: ['Yes', 'Sort of', 'Not really', 'Completely lost'],
        required: true
      },
      {
        id: 'dashboard-confusion',
        text: 'Which parts of the dashboard felt confusing or hard to navigate?',
        type: 'text'
      },
      {
        id: 'loading-issues',
        text: 'Did you encounter any delays or loading issues while using the app?',
        type: 'radio',
        options: ['Yes', 'No', 'Didn\'t notice'],
        required: true
      },
      {
        id: 'subscription-clarity',
        text: 'Did you notice which features were free and which required a subscription?',
        type: 'radio',
        options: ['Yes', 'No', 'Not sure'],
        required: true
      }
    ]
  },
  {
    id: 'analytics-progress',
    title: 'Analytics & Progress Tracking',
    questions: [
      {
        id: 'alerts-updates',
        text: 'Did you receive any alerts or progress updates while completing your goals or activities?',
        type: 'radio',
        options: ['Yes', 'No', 'I\'m not sure'],
        required: true
      },
      {
        id: 'progress-tracking',
        text: 'Were you able to track your learning progress easily?',
        type: 'radio',
        options: ['Yes', 'Sort of', 'No'],
        required: true
      },
      {
        id: 'missing-features',
        text: 'Did anything feel missing from the progress or achievement views?',
        type: 'text'
      }
    ]
  },
  {
    id: 'voice-flashcards-gamification',
    title: 'Voice, Flashcards, and Gamification',
    questions: [
      {
        id: 'voice-input',
        text: 'Did you try out the voice input or speech-to-text feature? If yes, how was it?',
        type: 'radio',
        options: ['Worked well', 'Some bugs', 'Didn\'t work', 'Didn\'t try'],
        required: true
      },
      {
        id: 'flashcard-effectiveness',
        text: 'Did the flashcard feature help you retain or understand information?',
        type: 'radio',
        options: ['Yes', 'Somewhat', 'No', 'Didn\'t use it'],
        required: true
      },
      {
        id: 'gamification-motivation',
        text: 'How motivating did you find the streaks, XP, or badge rewards?',
        type: 'radio',
        options: ['Very motivating', 'Somewhat', 'Didn\'t notice', 'Not motivating'],
        required: true
      }
    ]
  },
  {
    id: 'final-thoughts',
    title: 'Final Thoughts',
    questions: [
      {
        id: 'favorite-part',
        text: 'What was your favorite part of using FPK University?',
        type: 'text'
      },
      {
        id: 'most-confusing',
        text: 'What confused you the most during your session?',
        type: 'text'
      },
      {
        id: 'missing-expectations',
        text: 'Is there anything you expected that wasn\'t there?',
        type: 'text'
      },
      {
        id: 'improvement-suggestion',
        text: 'If you could change one thing to improve your experience, what would it be?',
        type: 'text'
      },
      {
        id: 'recommendation',
        text: 'Would you recommend FPK University to a friend or another parent/educator?',
        type: 'radio',
        options: ['Yes', 'Maybe', 'No'],
        required: true
      }
    ]
  }
];

const StructuredQuestions: React.FC<StructuredQuestionsProps> = ({
  category,
  responses,
  onResponseChange
}) => {
  // Only show structured questions for general feedback
  if (category !== 'general') {
    return null;
  }

  const renderQuestion = (question: Question) => {
    const value = responses[question.id] || '';

    switch (question.type) {
      case 'dropdown':
        return (
          <Select value={value} onValueChange={(val) => onResponseChange(question.id, val)}>
            <SelectTrigger>
              <SelectValue placeholder="Select an option" />
            </SelectTrigger>
            <SelectContent>
              {question.options?.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );

      case 'radio':
        return (
          <RadioGroup value={value} onValueChange={(val) => onResponseChange(question.id, val)}>
            {question.options?.map((option) => (
              <div key={option} className="flex items-center space-x-2">
                <RadioGroupItem value={option} id={`${question.id}-${option}`} />
                <Label htmlFor={`${question.id}-${option}`} className="text-sm">
                  {option}
                </Label>
              </div>
            ))}
          </RadioGroup>
        );

      case 'text':
        return (
          <Textarea
            value={value}
            onChange={(e) => onResponseChange(question.id, e.target.value)}
            placeholder="Your response..."
            rows={3}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-4">
      <div className="border-t pt-4">
        <h3 className="text-lg font-semibold mb-4">Additional Questions</h3>
        <p className="text-sm text-muted-foreground mb-6">
          Help us improve by answering these specific questions about your experience.
        </p>
        
        {questionSections.map((section) => (
          <Collapsible key={section.id} className="mb-4">
            <CollapsibleTrigger className="flex items-center justify-between w-full p-4 bg-muted/50 rounded-lg hover:bg-muted/70 transition-colors">
              <span className="font-medium text-left">{section.title}</span>
              <ChevronDown className="h-4 w-4 transition-transform" />
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-2 space-y-4 p-4 border border-border rounded-lg">
              {section.questions.map((question) => (
                <div key={question.id} className="space-y-2">
                  <Label className="text-sm font-medium">
                    {question.text}
                    {question.required && <span className="text-destructive ml-1">*</span>}
                  </Label>
                  {renderQuestion(question)}
                </div>
              ))}
            </CollapsibleContent>
          </Collapsible>
        ))}
      </div>
    </div>
  );
};

export default StructuredQuestions;