import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlayCircle, ArrowRight } from 'lucide-react';
import LessonTTSControls from '@/components/course/LessonTTSControls';

interface AlgebraLesson4Props {
  onComplete: () => void;
  onNext: () => void;
  hasNext: boolean;
}

export const AlgebraLesson4: React.FC<AlgebraLesson4Props> = ({ onComplete, onNext, hasNext }) => {
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
        lessonTitle="Linear Equations and Graphing"
        lessonNumber={4}
        totalLessons={7}
        contentRef={lessonContentRef}
      />

      {/* Lesson Introduction */}
      <Card ref={lessonContentRef}>
        <CardHeader>
          <div className="flex items-center gap-2 mb-2">
            <PlayCircle className="h-6 w-6 text-primary" />
            <CardTitle className="text-2xl">Linear Equations and Graphing</CardTitle>
          </div>
          <p className="text-muted-foreground">
            Understand linear relationships and learn to graph linear equations on the coordinate plane.
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-lg text-center">
            <h3 className="text-xl font-semibold mb-4">Coming Soon!</h3>
            <p className="text-muted-foreground">
              This lesson will cover slope, y-intercept, and graphing techniques for linear equations.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Lesson Actions */}
      <div className="flex justify-between items-center">
        <div className="text-sm text-muted-foreground">
          Lesson 4 of 7 • Linear Equations and Graphing
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