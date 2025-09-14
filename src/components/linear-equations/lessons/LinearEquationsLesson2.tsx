import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calculator, ArrowRight } from 'lucide-react';
import LessonTTSControls from '@/components/course/LessonTTSControls';

interface LinearEquationsLesson2Props {
  onComplete: () => void;
  onNext: () => void;
  hasNext: boolean;
}

export const LinearEquationsLesson2: React.FC<LinearEquationsLesson2Props> = ({ onComplete, onNext, hasNext }) => {
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
        lessonTitle="Solving Linear Equations"
        lessonNumber={2}
        totalLessons={7}
        contentRef={lessonContentRef}
      />

      <Card ref={lessonContentRef}>
        <CardHeader>
          <div className="flex items-center gap-2 mb-2">
            <Calculator className="h-6 w-6 text-primary" />
            <CardTitle className="text-2xl">Solving Linear Equations: Step-by-Step</CardTitle>
          </div>
          <p className="text-muted-foreground">
            Master the systematic approach to solving linear equations with one variable.
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* The SOAP Method */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-primary">The SOAP Method</h3>
            <div className="bg-muted/50 p-4 rounded-lg">
              <p className="text-foreground leading-relaxed mb-3">
                Use <strong>SOAP</strong> to remember the order of operations when solving:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                <li><strong>S</strong>implify both sides (combine like terms, distribute)</li>
                <li><strong>O</strong>pposite operations (addition/subtraction first)</li>
                <li><strong>A</strong>dd or subtract to isolate terms with variables</li>
                <li><strong>P</strong>roduct/quotient operations (multiply/divide last)</li>
              </ul>
            </div>
          </div>

          {/* Example 1: With Coefficients */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-primary">Example 1: 3x + 7 = 22</h3>
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg">
              <div className="space-y-4">
                <p className="font-medium">Step-by-Step Solution:</p>
                <div className="grid gap-3">
                  <div className="bg-white/60 p-3 rounded">
                    <p><strong>Given:</strong> 3x + 7 = 22</p>
                  </div>
                  <div className="bg-white/60 p-3 rounded">
                    <p><strong>Step 1:</strong> Subtract 7 from both sides</p>
                    <p className="ml-4">3x + 7 - 7 = 22 - 7</p>
                    <p className="ml-4">3x = 15</p>
                  </div>
                  <div className="bg-white/60 p-3 rounded">
                    <p><strong>Step 2:</strong> Divide both sides by 3</p>
                    <p className="ml-4">3x ÷ 3 = 15 ÷ 3</p>
                    <p className="ml-4">x = 5</p>
                  </div>
                  <div className="bg-green-100 p-3 rounded">
                    <p><strong>Check:</strong> 3(5) + 7 = 15 + 7 = 22 ✓</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Example 2: Variables on Both Sides */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-primary">Example 2: 2x + 3 = x + 8</h3>
            <div className="bg-gradient-to-r from-green-50 to-yellow-50 p-6 rounded-lg">
              <div className="space-y-4">
                <p className="font-medium">When variables appear on both sides:</p>
                <div className="grid gap-3">
                  <div className="bg-white/60 p-3 rounded">
                    <p><strong>Given:</strong> 2x + 3 = x + 8</p>
                  </div>
                  <div className="bg-white/60 p-3 rounded">
                    <p><strong>Step 1:</strong> Subtract x from both sides</p>
                    <p className="ml-4">2x - x + 3 = x - x + 8</p>
                    <p className="ml-4">x + 3 = 8</p>
                  </div>
                  <div className="bg-white/60 p-3 rounded">
                    <p><strong>Step 2:</strong> Subtract 3 from both sides</p>
                    <p className="ml-4">x + 3 - 3 = 8 - 3</p>
                    <p className="ml-4">x = 5</p>
                  </div>
                  <div className="bg-green-100 p-3 rounded">
                    <p><strong>Check:</strong> 2(5) + 3 = 13, and 5 + 8 = 13 ✓</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Example 3: With Fractions */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-primary">Example 3: x/2 + 3 = 7</h3>
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-lg">
              <div className="space-y-4">
                <p className="font-medium">Working with fractions:</p>
                <div className="grid gap-3">
                  <div className="bg-white/60 p-3 rounded">
                    <p><strong>Given:</strong> x/2 + 3 = 7</p>
                  </div>
                  <div className="bg-white/60 p-3 rounded">
                    <p><strong>Step 1:</strong> Subtract 3 from both sides</p>
                    <p className="ml-4">x/2 + 3 - 3 = 7 - 3</p>
                    <p className="ml-4">x/2 = 4</p>
                  </div>
                  <div className="bg-white/60 p-3 rounded">
                    <p><strong>Step 2:</strong> Multiply both sides by 2</p>
                    <p className="ml-4">(x/2) × 2 = 4 × 2</p>
                    <p className="ml-4">x = 8</p>
                  </div>
                  <div className="bg-green-100 p-3 rounded">
                    <p><strong>Check:</strong> 8/2 + 3 = 4 + 3 = 7 ✓</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Key Tips */}
          <div className="bg-yellow-50 border border-yellow-200 p-6 rounded-lg">
            <h3 className="text-xl font-semibold text-yellow-800 mb-3">💡 Pro Tips</h3>
            <ul className="list-disc list-inside space-y-2 text-yellow-700">
              <li>Always check your answer by substituting back into the original equation</li>
              <li>When dividing by a negative number, remember it doesn't change the equation balance</li>
              <li>Keep your work organized - write each step clearly</li>
              <li>If you get a decimal answer, double-check your arithmetic</li>
            </ul>
          </div>

          {/* Coming Up Next */}
          <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-lg">
            <h3 className="text-xl font-semibold text-green-700 mb-3">Coming Up Next</h3>
            <p className="text-muted-foreground mb-4">
              In the next lesson, we'll tackle more complex equations involving distribution 
              and combining like terms!
            </p>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-4">
              <li>Using the distributive property</li>
              <li>Combining like terms</li>
              <li>Multi-step equations</li>
              <li>Practice with word problems</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Lesson Actions */}
      <div className="flex justify-between items-center">
        <div className="text-sm text-muted-foreground">
          Lesson 2 of 7 • Solving Linear Equations: Step-by-Step
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