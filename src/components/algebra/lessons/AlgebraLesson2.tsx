import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calculator, ArrowRight } from 'lucide-react';
import LessonTTSControls from '@/components/course/LessonTTSControls';

interface AlgebraLesson2Props {
  onComplete: () => void;
  onNext: () => void;
  hasNext: boolean;
}

export const AlgebraLesson2: React.FC<AlgebraLesson2Props> = ({ onComplete, onNext, hasNext }) => {
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
        lessonTitle="Working with Variables"
        lessonNumber={2}
        totalLessons={7}
        contentRef={lessonContentRef}
      />

      {/* Lesson Introduction */}
      <Card ref={lessonContentRef}>
        <CardHeader>
          <div className="flex items-center gap-2 mb-2">
            <Calculator className="h-6 w-6 text-primary" />
            <CardTitle className="text-2xl">Working with Variables</CardTitle>
          </div>
          <p className="text-muted-foreground">
            Learn how to manipulate and simplify algebraic expressions by working with variables and like terms.
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Like Terms */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-primary">Understanding Like Terms</h3>
            <div className="bg-muted/50 p-4 rounded-lg">
              <p className="text-foreground leading-relaxed">
                <strong>Like terms</strong> are terms that have exactly the same variable parts. 
                They can be combined by adding or subtracting their coefficients.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-medium text-green-700 mb-2">✓ Like Terms</h4>
                <ul className="space-y-1 text-sm">
                  <li>• 3x and 5x</li>
                  <li>• -2y and 7y</li>
                  <li>• 4x² and -x²</li>
                  <li>• 6 and -3 (constants)</li>
                </ul>
              </div>
              <div className="bg-red-50 p-4 rounded-lg">
                <h4 className="font-medium text-red-700 mb-2">✗ Unlike Terms</h4>
                <ul className="space-y-1 text-sm">
                  <li>• 2x and 3y</li>
                  <li>• 4x and 5x²</li>
                  <li>• 3xy and 2x</li>
                  <li>• 7a and 7b</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Combining Like Terms */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-primary">Combining Like Terms</h3>
            <div className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium mb-3">Example 1: Simple Combination</h4>
                <div className="space-y-2">
                  <p className="text-sm"><strong>Expression:</strong> 3x + 5x</p>
                  <p className="text-sm"><strong>Step 1:</strong> Identify like terms: both terms have variable x</p>
                  <p className="text-sm"><strong>Step 2:</strong> Add coefficients: 3 + 5 = 8</p>
                  <p className="text-sm"><strong>Answer:</strong> 8x</p>
                </div>
              </div>
              
              <div className="bg-purple-50 p-4 rounded-lg">
                <h4 className="font-medium mb-3">Example 2: Multiple Variables</h4>
                <div className="space-y-2">
                  <p className="text-sm"><strong>Expression:</strong> 2x + 3y + 5x - y</p>
                  <p className="text-sm"><strong>Step 1:</strong> Group like terms: (2x + 5x) + (3y - y)</p>
                  <p className="text-sm"><strong>Step 2:</strong> Combine: 7x + 2y</p>
                  <p className="text-sm"><strong>Answer:</strong> 7x + 2y</p>
                </div>
              </div>
            </div>
          </div>

          {/* Distributive Property */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-primary">The Distributive Property</h3>
            <div className="bg-gradient-to-r from-orange-50 to-yellow-50 p-6 rounded-lg border">
              <div className="space-y-4">
                <p className="font-medium">a(b + c) = ab + ac</p>
                <p className="text-sm text-muted-foreground">
                  The distributive property allows us to multiply a number by a sum by multiplying 
                  the number by each term in the sum separately.
                </p>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-white/60 p-4 rounded-lg">
                    <h5 className="font-medium text-sm mb-2">Example 1:</h5>
                    <div className="space-y-1 text-sm">
                      <p>3(x + 4)</p>
                      <p>= 3 · x + 3 · 4</p>
                      <p>= 3x + 12</p>
                    </div>
                  </div>
                  <div className="bg-white/60 p-4 rounded-lg">
                    <h5 className="font-medium text-sm mb-2">Example 2:</h5>
                    <div className="space-y-1 text-sm">
                      <p>-2(3y - 5)</p>
                      <p>= -2 · 3y + (-2) · (-5)</p>
                      <p>= -6y + 10</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Practice Problems */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-primary">Try These Examples</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-gradient-to-b from-blue-50 to-indigo-50 p-4 rounded-lg">
                <h4 className="font-medium mb-3">Practice 1: Combining Like Terms</h4>
                <div className="space-y-2 text-sm">
                  <p><strong>Simplify:</strong> 4a + 2b - a + 5b</p>
                  <div className="bg-white/60 p-2 rounded mt-2">
                    <p><em>Answer: 3a + 7b</em></p>
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-b from-green-50 to-emerald-50 p-4 rounded-lg">
                <h4 className="font-medium mb-3">Practice 2: Distributive Property</h4>
                <div className="space-y-2 text-sm">
                  <p><strong>Expand:</strong> 5(2x + 3)</p>
                  <div className="bg-white/60 p-2 rounded mt-2">
                    <p><em>Answer: 10x + 15</em></p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Coming Up Next */}
          <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-lg">
            <h3 className="text-xl font-semibold text-green-700 mb-3">Coming Up Next</h3>
            <p className="text-muted-foreground mb-4">
              Now that you can work with variables and expressions, we'll learn how to solve 
              simple equations to find the value of unknown variables!
            </p>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-4">
              <li>What makes an equation different from an expression</li>
              <li>Basic solving techniques</li>
              <li>Checking your solutions</li>
              <li>Real-world equation examples</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Lesson Actions */}
      <div className="flex justify-between items-center">
        <div className="text-sm text-muted-foreground">
          Lesson 2 of 7 • Working with Variables
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