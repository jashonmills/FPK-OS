import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen, ArrowRight } from 'lucide-react';
import LessonTTSControls from '@/components/course/LessonTTSControls';

interface AlgebraLesson1Props {
  onComplete: () => void;
  onNext: () => void;
  hasNext: boolean;
}

export const AlgebraLesson1: React.FC<AlgebraLesson1Props> = ({ onComplete, onNext, hasNext }) => {
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
        lessonTitle="Introduction to Algebra"
        lessonNumber={1}
        totalLessons={7}
        contentRef={lessonContentRef}
      />

      {/* Lesson Introduction */}
      <Card ref={lessonContentRef}>
        <CardHeader>
          <div className="flex items-center gap-2 mb-2">
            <BookOpen className="h-6 w-6 text-primary" />
            <CardTitle className="text-2xl">Introduction to Algebra</CardTitle>
          </div>
          <p className="text-muted-foreground">
            Welcome to algebra! Learn the fundamental concepts of working with variables and algebraic expressions.
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* What is Algebra? */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-primary">What is Algebra?</h3>
            <div className="bg-muted/50 p-4 rounded-lg">
              <p className="text-foreground leading-relaxed">
                <strong>Algebra</strong> is a branch of mathematics that uses letters and symbols to represent 
                numbers and quantities in formulas and equations. It's the language of mathematics that allows 
                us to solve problems with unknown values.
              </p>
            </div>
            <p className="text-muted-foreground">
              Algebra helps us solve real-world problems involving:
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
              <li>Finding unknown quantities in business and finance</li>
              <li>Calculating rates, distances, and time</li>
              <li>Engineering and scientific calculations</li>
              <li>Computer programming and algorithms</li>
              <li>Data analysis and statistics</li>
            </ul>
          </div>

          {/* Variables and Constants */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-primary">Variables and Constants</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h4 className="font-medium">Variables</h4>
                <p className="text-muted-foreground text-sm">
                  Variables are letters (like x, y, a, b) that represent unknown or changing values.
                </p>
                <div className="bg-blue-50 p-3 rounded-lg">
                  <p className="text-sm"><strong>Examples:</strong></p>
                  <ul className="list-disc list-inside text-sm mt-2 space-y-1">
                    <li>x = the number of apples</li>
                    <li>t = time in hours</li>
                    <li>n = any whole number</li>
                  </ul>
                </div>
              </div>
              <div className="space-y-3">
                <h4 className="font-medium">Constants</h4>
                <p className="text-muted-foreground text-sm">
                  Constants are fixed numbers that don't change, like 5, -3, or π.
                </p>
                <div className="bg-green-50 p-3 rounded-lg">
                  <p className="text-sm"><strong>Examples:</strong></p>
                  <ul className="list-disc list-inside text-sm mt-2 space-y-1">
                    <li>7 (always seven)</li>
                    <li>-2 (always negative two)</li>
                    <li>π ≈ 3.14159... (pi)</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Algebraic Expressions */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-primary">Algebraic Expressions</h3>
            <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-6 rounded-lg border">
              <div className="space-y-4">
                <h4 className="font-medium">What is an Expression?</h4>
                <p className="text-sm text-muted-foreground">
                  An algebraic expression is a mathematical phrase that contains variables, constants, 
                  and operation symbols (+, -, ×, ÷).
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-white/60 p-4 rounded-lg">
                    <h5 className="font-medium text-sm mb-2">Simple Expressions:</h5>
                    <ul className="space-y-1 text-sm">
                      <li>• x + 5</li>
                      <li>• 3y - 2</li>
                      <li>• 2a + 7b</li>
                    </ul>
                  </div>
                  <div className="bg-white/60 p-4 rounded-lg">
                    <h5 className="font-medium text-sm mb-2">Complex Expressions:</h5>
                    <ul className="space-y-1 text-sm">
                      <li>• 4x² + 3x - 1</li>
                      <li>• (x + 2)(x - 3)</li>
                      <li>• 2(a + b) - 5c</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Order of Operations */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-primary">Order of Operations (PEMDAS)</h3>
            <div className="bg-gradient-to-r from-orange-50 to-red-50 p-6 rounded-lg">
              <p className="font-medium mb-3">Remember: Please Excuse My Dear Aunt Sally</p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="bg-white/60 p-3 rounded-lg">
                    <div className="text-2xl font-bold text-primary">P</div>
                    <div className="text-sm">Parentheses</div>
                  </div>
                </div>
                <div className="text-center">
                  <div className="bg-white/60 p-3 rounded-lg">
                    <div className="text-2xl font-bold text-primary">E</div>
                    <div className="text-sm">Exponents</div>
                  </div>
                </div>
                <div className="text-center">
                  <div className="bg-white/60 p-3 rounded-lg">
                    <div className="text-2xl font-bold text-primary">MD</div>
                    <div className="text-sm">× and ÷</div>
                  </div>
                </div>
                <div className="text-center">
                  <div className="bg-white/60 p-3 rounded-lg">
                    <div className="text-2xl font-bold text-primary">AS</div>
                    <div className="text-sm">+ and -</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Coming Up Next */}
          <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-lg">
            <h3 className="text-xl font-semibold text-green-700 mb-3">Coming Up Next</h3>
            <p className="text-muted-foreground mb-4">
              In the next lesson, we'll dive deeper into working with variables and learn how to 
              simplify algebraic expressions through combining like terms!
            </p>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-4">
              <li>Identifying like terms</li>
              <li>Combining and simplifying expressions</li>
              <li>Using the distributive property</li>
              <li>Practice with real-world examples</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Lesson Actions */}
      <div className="flex justify-between items-center">
        <div className="text-sm text-muted-foreground">
          Lesson 1 of 7 • Introduction to Algebra
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