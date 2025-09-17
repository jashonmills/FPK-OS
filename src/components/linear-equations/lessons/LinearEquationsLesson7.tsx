import React, { useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trophy } from 'lucide-react';

interface InteractionDetails {
  lessonId?: string;
  action?: string;
  element?: string;
  value?: string | number;
  timestamp?: number;
  [key: string]: unknown;
}

interface LinearEquationsLesson7Props {
  onComplete: () => void;
  onNext: () => void;
  hasNext: boolean;
  trackInteraction?: (event: string, details: InteractionDetails) => void;
}

export const LinearEquationsLesson7: React.FC<LinearEquationsLesson7Props> = ({ 
  onComplete, 
  onNext, 
  hasNext,
  trackInteraction 
}) => {
  const lessonContentRef = useRef<HTMLDivElement>(null);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card ref={lessonContentRef}>
        <CardHeader>
          <div className="flex items-center gap-2 mb-2">
            <Trophy className="h-6 w-6 text-primary" />
            <CardTitle className="text-2xl">Course Complete! 🎉</CardTitle>
          </div>
          <p className="text-muted-foreground">
            Congratulations! You've mastered linear equations and are ready to tackle more advanced mathematical concepts.
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-primary">What You've Accomplished</h3>
            <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-lg">
              <p className="text-muted-foreground mb-4">
                You've completed the Linear Equations course! You now have the skills to solve various types of linear equations and apply them to real-world problems.
              </p>
              <h4 className="font-medium mb-2">Skills Mastered:</h4>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-4">
                <li>✓ Understanding linear equation fundamentals</li>
                <li>✓ Mastering the SOAP solving method</li>
                <li>✓ Working with multi-step equations</li>
                <li>✓ Graphing linear equations on coordinate planes</li>
                <li>✓ Identifying special cases (no solution/infinite solutions)</li>
                <li>✓ Solving real-world word problems</li>
                <li>✓ Building mathematical reasoning skills</li>
              </ul>
            </div>
            
            <div className="bg-gradient-to-r from-purple-50 to-indigo-50 p-6 rounded-lg">
              <h4 className="font-medium text-purple-700 mb-3">Next Steps</h4>
              <p className="text-muted-foreground mb-3">
                With your solid foundation in linear equations, you're ready to explore more advanced topics:
              </p>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-4">
                <li>Systems of linear equations</li>
                <li>Quadratic equations and functions</li>
                <li>Polynomial expressions</li>
                <li>Advanced graphing techniques</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};