import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen, ArrowRight } from 'lucide-react';
import LessonTTSControls from '@/components/course/LessonTTSControls';

interface LinearEquationsLesson1Props {
  onComplete: () => void;
  onNext: () => void;
  hasNext: boolean;
}

export const LinearEquationsLesson1: React.FC<LinearEquationsLesson1Props> = ({ onComplete, onNext, hasNext }) => {
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
        lessonTitle="Introduction to Linear Equations"
        lessonNumber={1}
        totalLessons={7}
        contentRef={lessonContentRef}
      />

      {/* Lesson Introduction */}
      <Card ref={lessonContentRef}>
        <CardHeader>
          <div className="flex items-center gap-2 mb-2">
            <BookOpen className="h-6 w-6 text-primary" />
            <CardTitle className="text-2xl">Introduction to Linear Equations</CardTitle>
          </div>
          <p className="text-muted-foreground">
            Welcome to the world of linear equations! Learn the fundamental concepts and discover how to solve equations with one variable.
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* What is a Linear Equation? */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-primary">What is a Linear Equation?</h3>
            <div className="bg-muted/50 p-4 rounded-lg">
              <p className="text-foreground leading-relaxed">
                <strong>A linear equation</strong> is an equation where the highest power of the variable is 1. 
                It creates a straight line when graphed on a coordinate plane.
              </p>
            </div>
            <p className="text-muted-foreground">
              Linear equations help us solve problems involving:
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
              <li>Finding unknown values in real-world situations</li>
              <li>Calculating costs, distances, and time</li>
              <li>Balancing equations in chemistry and physics</li>
              <li>Business and financial calculations</li>
              <li>Engineering and construction problems</li>
            </ul>
          </div>

          {/* Forms of Linear Equations */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-primary">Forms of Linear Equations</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <p className="text-muted-foreground">
                  Linear equations can appear in different forms:
                </p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                  <li><strong>Simple form:</strong> x + 5 = 12</li>
                  <li><strong>With coefficients:</strong> 3x - 7 = 11</li>
                  <li><strong>With variables on both sides:</strong> 2x + 3 = x + 8</li>
                  <li><strong>With fractions:</strong> x/2 + 3 = 7</li>
                </ul>
              </div>
              <div className="bg-muted/30 p-4 rounded-lg">
                <div className="text-center">
                  <div className="text-6xl mb-2">⚖️</div>
                  <p className="text-sm text-muted-foreground">
                    Think of equations as balanced scales
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* The Balance Concept */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-primary">The Balance Concept</h3>
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg border">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h4 className="font-medium">Equations as Balanced Scales</h4>
                  <p className="text-sm text-muted-foreground">
                    Think of an equation as a balanced scale. Whatever you do to one side, 
                    you must do to the other side to keep it balanced.
                  </p>
                  <div className="space-y-2">
                    <h5 className="font-medium text-sm">Key Principle:</h5>
                    <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground ml-4">
                      <li>Add the same number to both sides</li>
                      <li>Subtract the same number from both sides</li>
                      <li>Multiply both sides by the same number</li>
                      <li>Divide both sides by the same number</li>
                    </ul>
                  </div>
                </div>
                <div className="bg-white/50 p-4 rounded-lg text-center">
                  <div className="text-8xl mb-2">⚖️</div>
                  <p className="text-sm text-muted-foreground">
                    Keep the balance!
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Example Walkthrough */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-primary">Example: Solving x + 5 = 12</h3>
            <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-lg">
              <div className="space-y-4">
                <p className="font-medium">Let's solve this step by step:</p>
                <div className="space-y-3">
                  <div className="bg-white/60 p-3 rounded">
                    <p><strong>Step 1:</strong> Start with the equation: x + 5 = 12</p>
                  </div>
                  <div className="bg-white/60 p-3 rounded">
                    <p><strong>Step 2:</strong> Subtract 5 from both sides: x + 5 - 5 = 12 - 5</p>
                  </div>
                  <div className="bg-white/60 p-3 rounded">
                    <p><strong>Step 3:</strong> Simplify: x = 7</p>
                  </div>
                  <div className="bg-white/60 p-3 rounded">
                    <p><strong>Check:</strong> 7 + 5 = 12 ✓</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Coming Up Next */}
          <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-lg">
            <h3 className="text-xl font-semibold text-green-700 mb-3">Coming Up Next</h3>
            <p className="text-muted-foreground mb-4">
              In the next lesson, we'll learn the systematic approach to solving linear equations 
              and practice with more complex examples!
            </p>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-4">
              <li>Step-by-step solving process</li>
              <li>Handling equations with coefficients</li>
              <li>Working with negative numbers</li>
              <li>Interactive practice problems</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Lesson Actions */}
      <div className="flex justify-between items-center">
        <div className="text-sm text-muted-foreground">
          Lesson 1 of 7 • Introduction to Linear Equations
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