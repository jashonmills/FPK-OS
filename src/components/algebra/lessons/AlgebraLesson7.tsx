import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trophy, ArrowRight } from 'lucide-react';
import LessonTTSControls from '@/components/course/LessonTTSControls';

interface AlgebraLesson7Props {
  onComplete: () => void;
  onNext: () => void;
  hasNext: boolean;
}

export const AlgebraLesson7: React.FC<AlgebraLesson7Props> = ({ onComplete, onNext, hasNext }) => {
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
        lessonTitle="Advanced Applications"
        lessonNumber={7}
        totalLessons={7}
        contentRef={lessonContentRef}
      />

      {/* Lesson Introduction */}
      <Card ref={lessonContentRef}>
        <CardHeader>
          <div className="flex items-center gap-2 mb-2">
            <Trophy className="h-6 w-6 text-primary" />
            <CardTitle className="text-2xl">Advanced Applications</CardTitle>
          </div>
          <p className="text-muted-foreground">
            Apply algebraic concepts to solve real-world problems and master advanced techniques.
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-gradient-to-r from-gold-50 to-yellow-50 p-6 rounded-lg text-center">
            <h3 className="text-xl font-semibold mb-4">Coming Soon!</h3>
            <p className="text-muted-foreground">
              This lesson will feature challenging real-world problems and advanced algebraic applications.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Lesson Actions */}
      <div className="flex justify-between items-center">
        <div className="text-sm text-muted-foreground">
          Lesson 7 of 7 • Advanced Applications
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