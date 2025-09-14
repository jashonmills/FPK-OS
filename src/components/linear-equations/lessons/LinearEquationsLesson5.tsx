import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen, ArrowRight } from 'lucide-react';

interface LinearEquationsLesson5Props {
  onComplete: () => void;
  onNext: () => void;
  hasNext: boolean;
}

export const LinearEquationsLesson5: React.FC<LinearEquationsLesson5Props> = ({ onComplete, onNext, hasNext }) => {
  const [isCompleted, setIsCompleted] = useState(false);

  const handleComplete = () => {
    setIsCompleted(true);
    onComplete();
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card>
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

      <div className="flex justify-between items-center">
        <div className="text-sm text-muted-foreground">
          Lesson 5 of 7 • Special Cases
        </div>
        <div className="flex gap-2">
          {!isCompleted && (
            <Button onClick={handleComplete} className="fpk-gradient text-white">
              Mark as Complete
            </Button>
          )}
          {isCompleted && hasNext && (
            <Button onClick={onNext} className="fpk-gradient text-white">
              Next Lesson <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};