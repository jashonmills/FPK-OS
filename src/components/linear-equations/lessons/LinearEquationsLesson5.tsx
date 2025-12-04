import React, { useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen } from 'lucide-react';

interface InteractionDetails {
  lessonId?: string;
  action?: string;
  element?: string;
  value?: string | number;
  timestamp?: number;
  [key: string]: unknown;
}

interface LinearEquationsLesson5Props {
  onComplete: () => void;
  onNext: () => void;
  hasNext: boolean;
  trackInteraction?: (event: string, details: InteractionDetails) => void;
}

export const LinearEquationsLesson5: React.FC<LinearEquationsLesson5Props> = ({ 
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
            <BookOpen className="h-6 w-6 text-primary" />
            <CardTitle className="text-2xl">Special Cases: No Solution and Infinite Solutions</CardTitle>
          </div>
          <p className="text-muted-foreground">
            Explore equations that have no solution or infinitely many solutions.
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-primary">Types of Solutions</h3>
            <div className="grid gap-4">
              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-medium text-green-700">One Solution (Most Common)</h4>
                <p className="text-sm">Example: 2x + 3 = 7 → x = 2</p>
              </div>
              <div className="bg-red-50 p-4 rounded-lg">
                <h4 className="font-medium text-red-700">No Solution (Inconsistent)</h4>
                <p className="text-sm">Example: 2x + 3 = 2x + 5 → 3 = 5 (False!)</p>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium text-blue-700">Infinite Solutions (Identity)</h4>
                <p className="text-sm">Example: 2x + 3 = 2x + 3 → 3 = 3 (Always true!)</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};