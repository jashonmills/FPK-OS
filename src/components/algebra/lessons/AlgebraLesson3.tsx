import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calculator, ArrowRight } from 'lucide-react';
import LessonTTSControls from '@/components/course/LessonTTSControls';

interface AlgebraLesson3Props {
  onComplete: () => void;
  onNext: () => void;
  hasNext: boolean;
}

export const AlgebraLesson3: React.FC<AlgebraLesson3Props> = ({ onComplete, onNext, hasNext }) => {
  const [isCompleted, setIsCompleted] = useState(false);
  const lessonContentRef = useRef<HTMLDivElement>(null);

  const handleComplete = () => {
    setIsCompleted(true);
    onComplete();
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* TTS Controls */}
      <LessonTTSControls
        lessonTitle="Solving Simple Equations"
        lessonNumber={3}
        totalLessons={7}
        contentRef={lessonContentRef}
      />

      {/* Lesson Introduction */}
      <Card ref={lessonContentRef}>
        <CardHeader>
          <div className="flex items-center gap-2 mb-2">
            <Calculator className="h-6 w-6 text-primary" />
            <CardTitle className="text-2xl">Solving Simple Equations</CardTitle>
          </div>
          <p className="text-muted-foreground">
            Learn the fundamental techniques for solving algebraic equations step by step.
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg text-center">
            <h3 className="text-xl font-semibold mb-4">Coming Soon!</h3>
            <p className="text-muted-foreground">
              This lesson is currently being developed with interactive examples and step-by-step solving techniques.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Lesson Actions */}
      <div className="flex justify-between items-center">
        <div className="text-sm text-muted-foreground">
          Lesson 3 of 7 • Solving Simple Equations
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