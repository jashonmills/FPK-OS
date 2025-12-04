import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Lightbulb } from 'lucide-react';

interface ExampleScreenProps {
  title: string;
  problem: string;
  solution: React.ReactNode;
  answer: string;
  variant?: 'blue' | 'green' | 'orange' | 'purple' | 'red' | 'teal';
}

export const ExampleScreen: React.FC<ExampleScreenProps> = ({
  title,
  problem,
  solution,
  answer,
  variant = 'blue'
}) => {
  const getVariantClasses = () => {
    switch (variant) {
      case 'blue':
        return {
          cardBg: 'bg-blue-50 border-blue-200',
          titleColor: 'text-blue-800',
          problemColor: 'text-blue-700',
          answerBg: 'bg-blue-100',
          answerColor: 'text-blue-800'
        };
      case 'green':
        return {
          cardBg: 'bg-green-50 border-green-200',
          titleColor: 'text-green-800',
          problemColor: 'text-green-700',
          answerBg: 'bg-green-100',
          answerColor: 'text-green-800'
        };
      case 'orange':
        return {
          cardBg: 'bg-orange-50 border-orange-200',
          titleColor: 'text-orange-800',
          problemColor: 'text-orange-700',
          answerBg: 'bg-orange-100',
          answerColor: 'text-orange-800'
        };
      case 'purple':
        return {
          cardBg: 'bg-purple-50 border-purple-200',
          titleColor: 'text-purple-800',
          problemColor: 'text-purple-700',
          answerBg: 'bg-purple-100',
          answerColor: 'text-purple-800'
        };
      case 'red':
        return {
          cardBg: 'bg-red-50 border-red-200',
          titleColor: 'text-red-800',
          problemColor: 'text-red-700',
          answerBg: 'bg-red-100',
          answerColor: 'text-red-800'
        };
      case 'teal':
        return {
          cardBg: 'bg-teal-50 border-teal-200',
          titleColor: 'text-teal-800',
          problemColor: 'text-teal-700',
          answerBg: 'bg-teal-100',
          answerColor: 'text-teal-800'
        };
      default:
        return {
          cardBg: 'bg-blue-50 border-blue-200',
          titleColor: 'text-blue-800',
          problemColor: 'text-blue-700',
          answerBg: 'bg-blue-100',
          answerColor: 'text-blue-800'
        };
    }
  };

  const classes = getVariantClasses();

  return (
    <div className="space-y-6">
      <Card className={classes.cardBg}>
        <CardHeader>
          <CardTitle className={`${classes.titleColor} flex items-center gap-2`}>
            <Lightbulb className="h-5 w-5" />
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className={`text-sm mb-3 ${classes.problemColor}`}>
              <strong>{problem}</strong>
            </p>
          </div>
          
          <div className="space-y-3">
            <div>
              <p className={`text-sm font-semibold mb-1 ${classes.titleColor}`}>Solution:</p>
              <div className={`text-sm ${classes.problemColor}`}>
                {solution}
              </div>
            </div>

            <div className={`${classes.answerBg} p-3 rounded mt-3`}>
              <p className={`text-sm font-semibold ${classes.answerColor}`}>
                {answer}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

interface StepListProps {
  steps: string[];
  variant?: 'blue' | 'green' | 'orange' | 'purple' | 'red' | 'teal';
}

export const StepList: React.FC<StepListProps> = ({ steps, variant = 'blue' }) => {
  const getTextColor = () => {
    switch (variant) {
      case 'blue': return 'text-blue-700';
      case 'green': return 'text-green-700';
      case 'orange': return 'text-orange-700';
      case 'purple': return 'text-purple-700';
      case 'red': return 'text-red-700';
      case 'teal': return 'text-teal-700';
      default: return 'text-blue-700';
    }
  };

  return (
    <ul className={`space-y-1 text-sm ${getTextColor()} list-disc list-inside ml-4`}>
      {steps.map((step, index) => (
        <li key={index}>{step}</li>
      ))}
    </ul>
  );
};