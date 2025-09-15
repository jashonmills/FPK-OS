import React, { useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calculator } from 'lucide-react';

interface LinearEquationsLesson6Props {
  onComplete: () => void;
  onNext: () => void;
  hasNext: boolean;
  trackInteraction?: (event: string, details: any) => void;
}

export const LinearEquationsLesson6: React.FC<LinearEquationsLesson6Props> = ({ 
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
            <Calculator className="h-6 w-6 text-primary" />
            <CardTitle className="text-2xl">Word Problems with Linear Equations</CardTitle>
          </div>
          <p className="text-muted-foreground">
            Apply your linear equation skills to solve real-world problems.
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-primary">Problem-Solving Strategy</h3>
            <ol className="list-decimal list-inside space-y-2 text-muted-foreground ml-4">
              <li>Read the problem carefully</li>
              <li>Identify what you're looking for (define the variable)</li>
              <li>Set up the equation</li>
              <li>Solve the equation</li>
              <li>Check your answer in the original problem</li>
            </ol>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};