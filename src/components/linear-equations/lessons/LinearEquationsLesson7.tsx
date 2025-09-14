import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trophy, ArrowRight } from 'lucide-react';
import LessonTTSControls from '@/components/course/LessonTTSControls';

interface LinearEquationsLesson7Props {
  onComplete: () => void;
  onNext: () => void;
  hasNext: boolean;
}

export const LinearEquationsLesson7: React.FC<LinearEquationsLesson7Props> = ({ onComplete, onNext, hasNext }) => {
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
        lessonTitle="Mastery Challenge & Review"
        lessonNumber={7}
        totalLessons={7}
        contentRef={lessonContentRef}
      />

      <Card ref={lessonContentRef}>
        <CardHeader>
          <div className="flex items-center gap-2 mb-2">
            <Trophy className="h-6 w-6 text-primary" />
            <CardTitle className="text-2xl">Mastery Challenge & Review</CardTitle>
          </div>
          <p className="text-muted-foreground">
            Put all your linear equation skills to the test with challenging problems.
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-primary">🎉 Congratulations!</h3>
            <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-lg">
              <p className="text-muted-foreground mb-4">
                You've completed the Linear Equations course! You now have the skills to solve various types of linear equations and apply them to real-world problems.
              </p>
              <h4 className="font-medium mb-2">Skills Mastered:</h4>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-4">
                <li>Solving basic linear equations</li>
                <li>Working with multi-step equations</li>
                <li>Using the distributive property</li>
                <li>Graphing linear equations</li>
                <li>Identifying special cases</li>
                <li>Solving word problems</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-between items-center">
        <div className="text-sm text-muted-foreground">
          Lesson 7 of 7 • Mastery Challenge
        </div>
        <div className="flex gap-2">
          {!isCompleted && (
            <Button onClick={handleComplete} className="fpk-gradient text-white">
              Complete Course
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};